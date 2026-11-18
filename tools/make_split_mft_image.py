#!/usr/bin/env python3
"""Generate a volume whose $MFT is fragmented into two runs.

This exists for one reason: on a real, long-lived volume the MFT grows until
a single MFT record can no longer describe its runlist, so the later extents
move to an extension record and $ATTRIBUTE_LIST joins them. The list itself
is then usually too big to stay resident, so it lands on the volume too.

That is the recursion the reader has to break: to read an extension record
you need the MFT layout, and the MFT layout is described by an attribute that
lives inside the MFT. It works because the list carries its own runlist, so
it can be fetched with plain cluster reads -- no MFT required.

Layout (cluster = 512 bytes, MFT record = 1024 bytes):

    LCN 0        boot sector
    LCN 10..17   $MFT run 0, records 0..3   (VCN 0..7)
    LCN 20..27   $MFT run 1, records 4..7   (VCN 8..15)
    LCN 30       $ATTRIBUTE_LIST of $MFT (non-resident)

Record 5 (the root directory) and record 6 (a file) live in the *second*
run, so nothing about them can be read until the two runs are joined. A
reader that only believes record 0 sees a runlist that stops at VCN 7 and
fails on record 5 -- loudly, which is the point: the fixture cannot pass by
accident.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from make_test_image import (  # noqa: E402
    ATTR_ATTRIBUTE_LIST,
    ATTR_DATA,
    CLUSTER,
    FILE_ATTRIBUTE_ARCHIVE,
    FILE_ATTRIBUTE_DIRECTORY,
    RECORD,
    SECTOR,
    attribute_list,
    build_record,
    file_name,
    index_entry,
    index_root,
    non_resident,
    resident,
    standard_information,
    u16,
    u32,
    u64,
)

MFT_LCN_A = 10
MFT_LCN_B = 20
MFT_RECORDS = 8
MFT_CLUSTERS = MFT_RECORDS * RECORD // CLUSTER  # 16
RUN_CLUSTERS = MFT_CLUSTERS // 2  # 8 clusters per run
LIST_LCN = 30
TOTAL_CLUSTERS = 32

FILE_NAME = "after.bin"
FILE_BODY = b"read from the second MFT run\n"
ROOT_RECORD = 5
FILE_RECORD = 6
MFT_EXT_RECORD = 1


def boot():
    out = bytearray(SECTOR)
    out[0:3] = b"\xeb\x52\x90"
    out[3:11] = b"NTFS    "
    out[0x0B:0x0D] = u16(SECTOR)
    out[0x0D] = SECTOR // CLUSTER
    out[0x28:0x30] = u64(TOTAL_CLUSTERS * CLUSTER // SECTOR)
    out[0x30:0x38] = u64(MFT_LCN_A)
    out[0x38:0x40] = u64(2)
    out[0x40] = 0xF6  # -10 => 1024-byte records
    out[0x44] = 1
    out[0x48:0x50] = u64(0x4D4F4F4E46530002)
    out[510:512] = b"\x55\xaa"
    return bytes(out)


def build():
    image = bytearray(TOTAL_CLUSTERS * CLUSTER)
    image[0:SECTOR] = boot()

    # The list has to be built before record 0 because record 0 stores its
    # length. Entries: both halves of $MFT's $DATA, plus the list itself.
    list_value = attribute_list(
        [
            (ATTR_DATA, 0, 0, 3),
            (ATTR_DATA, RUN_CLUSTERS, MFT_EXT_RECORD, 2),
            (ATTR_ATTRIBUTE_LIST, 0, 0, 4),
        ]
    )

    records = {}
    records[0] = build_record(
        1,
        0x0001,
        [
            standard_information(0x06),
            non_resident(
                ATTR_DATA,
                bytes([0x11, RUN_CLUSTERS, MFT_LCN_A, 0x00]),
                MFT_RECORDS * RECORD,
                MFT_RECORDS * RECORD,
                lowest_vcn=0,
                highest_vcn=RUN_CLUSTERS - 1,
                attr_id=3,
            ),
            non_resident(
                ATTR_ATTRIBUTE_LIST,
                bytes([0x11, 1, LIST_LCN, 0x00]),
                len(list_value),
                CLUSTER,
                highest_vcn=0,
                attr_id=4,
            ),
        ],
    )

    # Extension record for $MFT. It must sit in the first run (records 0..3),
    # otherwise it is unreachable until the runs are already joined.
    records[MFT_EXT_RECORD] = build_record(
        1,
        0x0001,
        [
            non_resident(
                ATTR_DATA,
                bytes([0x11, RUN_CLUSTERS, MFT_LCN_B, 0x00]),
                MFT_RECORDS * RECORD,
                MFT_RECORDS * RECORD,
                lowest_vcn=RUN_CLUSTERS,
                highest_vcn=MFT_CLUSTERS - 1,
                attr_id=2,
            ),
        ],
        base_record=0,
    )

    records[ROOT_RECORD] = build_record(
        1,
        0x0003,
        [
            standard_information(FILE_ATTRIBUTE_DIRECTORY),
            file_name(ROOT_RECORD, ".", FILE_ATTRIBUTE_DIRECTORY, 0),
            index_root(
                [
                    index_entry(
                        FILE_RECORD, FILE_NAME, FILE_ATTRIBUTE_ARCHIVE, len(FILE_BODY)
                    )
                ]
            ),
        ],
    )
    records[FILE_RECORD] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(ROOT_RECORD, FILE_NAME, FILE_ATTRIBUTE_ARCHIVE, len(FILE_BODY)),
            resident(ATTR_DATA, FILE_BODY, attr_id=2),
        ],
    )

    def place(record_number, payload):
        index = record_number * RECORD // (CLUSTER * 1)
        run = 0 if index < RUN_CLUSTERS else 1
        base_lcn = MFT_LCN_A if run == 0 else MFT_LCN_B
        vcn = index - (0 if run == 0 else RUN_CLUSTERS)
        at = (base_lcn + vcn) * CLUSTER
        image[at : at + RECORD] = payload

    for number, payload in records.items():
        place(number, payload)

    list_at = LIST_LCN * CLUSTER
    image[list_at : list_at + len(list_value)] = list_value

    return bytes(image)


def main():
    out = (
        Path(sys.argv[1])
        if len(sys.argv) > 1
        else Path("testdata/synth-mft-split.img")
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    data = build()
    out.write_bytes(data)
    print(f"wrote {out} ({len(data)} bytes)")
    print(f"  $MFT: run0 {MFT_LCN_A}..{MFT_LCN_A + RUN_CLUSTERS - 1}, "
          f"run1 {MFT_LCN_B}..{MFT_LCN_B + RUN_CLUSTERS - 1}")
    print(f"  $ATTRIBUTE_LIST: non-resident at LCN {LIST_LCN}")
    print(f"  root record {ROOT_RECORD} and file record {FILE_RECORD} live in run1")


if __name__ == "__main__":
    main()
