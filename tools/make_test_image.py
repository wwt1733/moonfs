#!/usr/bin/env python3
"""Generate a minimal but structurally valid NTFS 3.1 image for tests.

The image is small enough to live in the repository and is built entirely
from the on-disk layout documented in [MS-FSCC] / linux-ntfs, so anyone can
re-run this script and diff the result instead of trusting a binary blob.

Layout (cluster = 512 bytes, MFT record = 1024 bytes):

    LCN 0        boot sector
    LCN 1..32    $MFT, 16 records
    LCN 33..34   big.bin data (non-resident, 2 clusters)
    LCN 35       compressed.txt payload (LZNT1, occupies 1 cluster)
    LCN 36..37   split.bin first extent   (record 10)
    LCN 38..39   split.bin second extent  (record 11, not adjacent on purpose)
    LCN 40       deep.bin $ATTRIBUTE_LIST (the list itself is non-resident)
    LCN 41..42   deep.bin first extent    (record 12)
    LCN 43..44   deep.bin second extent   (record 13)

The volume carries six files on purpose, one per data path the parser has
to handle: resident, non-resident multi-cluster, LZNT1 compressed, sparse
(allocated nowhere, reads as zero), $DATA split across two MFT records
with a *resident* list, and the same split with the list itself moved onto
the volume (non-resident $ATTRIBUTE_LIST).
"""

import struct
import sys
from pathlib import Path

SECTOR = 512
CLUSTER = 512
RECORD = 1024
MFT_LCN = 1
MFT_RECORDS = 16
# 16 records * 1024 bytes = 16384 bytes = 32 clusters
MFT_CLUSTERS = MFT_RECORDS * RECORD // CLUSTER

DATA_BIG_LCN = 33
DATA_BIG_CLUSTERS = 2
DATA_COMPRESSED_LCN = 35
# split.bin 的两段刻意放在不相邻的位置，合并顺序错了会立刻读出错位内容
DATA_SPLIT_A_LCN = 36
DATA_SPLIT_B_LCN = 38
# deep.bin：$ATTRIBUTE_LIST 自己也非常驻，列表内容存在 LCN 40 上
DATA_DEEP_LIST_LCN = 40
DATA_DEEP_A_LCN = 41
DATA_DEEP_B_LCN = 43
TOTAL_CLUSTERS = 45

FILETIME = 133_000_000_000_000_000  # a fixed timestamp, so fixtures are stable

ATTR_STANDARD_INFORMATION = 0x10
ATTR_ATTRIBUTE_LIST = 0x20
ATTR_FILE_NAME = 0x30
ATTR_DATA = 0x80
ATTR_INDEX_ROOT = 0x90
ATTR_VOLUME_INFORMATION = 0x70
ATTR_REPARSE_POINT = 0xC0

FILE_ATTRIBUTE_ARCHIVE = 0x20
FILE_ATTRIBUTE_DIRECTORY = 0x10000000


def u16(v):
    return struct.pack("<H", v)


def u32(v):
    return struct.pack("<I", v)


def u64(v):
    return struct.pack("<Q", v)


def resident(type_code, value, flags=0, attr_id=1, name=""):
    # $INDEX_ROOT / $INDEX_ALLOCATION / $BITMAP carry the index name "$I30";
    # without it the parser cannot tell which index an attribute belongs to.
    name_bytes = name.encode("utf-16-le")
    name_off = 0x18
    value_off = name_off + len(name_bytes)
    total = value_off + len(value)
    aligned = (total + 7) // 8 * 8
    out = bytearray(aligned)
    out[0:4] = u32(type_code)
    out[4:8] = u32(aligned)
    out[8] = 0
    out[9] = len(name)
    out[0x0A:0x0C] = u16(name_off)
    out[0x0C:0x0E] = u16(flags)
    out[0x0E:0x10] = u16(attr_id)
    out[0x10:0x14] = u32(len(value))
    out[0x14:0x16] = u16(value_off)
    out[name_off : name_off + len(name_bytes)] = name_bytes
    out[value_off : value_off + len(value)] = value
    return bytes(out)


def non_resident(
    type_code,
    runlist,
    data_size,
    alloc_size,
    flags=0,
    compression_unit=0,
    lowest_vcn=0,
    highest_vcn=0,
    attr_id=1,
):
    total = 0x40 + len(runlist)
    aligned = (total + 7) // 8 * 8
    out = bytearray(aligned)
    out[0:4] = u32(type_code)
    out[4:8] = u32(aligned)
    out[8] = 1
    out[9] = 0
    out[0x0A:0x0C] = u16(0x40)
    out[0x0C:0x0E] = u16(flags)
    out[0x0E:0x10] = u16(attr_id)
    out[0x10:0x18] = u64(lowest_vcn)
    out[0x18:0x20] = u64(highest_vcn)
    out[0x20:0x22] = u16(0x40)
    out[0x22:0x24] = u16(compression_unit)
    out[0x28:0x30] = u64(alloc_size)
    out[0x30:0x38] = u64(data_size)
    out[0x38:0x40] = u64(data_size)
    out[0x40 : 0x40 + len(runlist)] = runlist
    return bytes(out)


def attribute_list(entries):
    """Build the value of a resident $ATTRIBUTE_LIST.

    Each entry is (type_code, lowest_vcn, record_number, attribute_id) and is
    0x1A bytes when the attribute has no name. The list is what tells a reader
    that an attribute continues in another MFT record.
    """
    value = bytearray()
    for type_code, lowest_vcn, record, attr_id in entries:
        entry = bytearray(0x1A)
        entry[0x00:0x04] = u32(type_code)
        entry[0x04:0x06] = u16(0x1A)
        entry[0x06] = 0  # name length
        entry[0x07] = 0x1A  # name offset (unused when the name is empty)
        entry[0x08:0x10] = u64(lowest_vcn)
        entry[0x10:0x18] = u64(record)
        entry[0x18:0x1A] = u16(attr_id)
        value += entry
    return bytes(value)


def standard_information(flags):
    value = bytearray(48)
    for off in (0, 8, 16, 24):
        value[off : off + 8] = u64(FILETIME)
    value[0x20:0x24] = u32(flags)
    return resident(ATTR_STANDARD_INFORMATION, bytes(value), attr_id=0)


def file_name(parent, name, flags, size):
    encoded = name.encode("utf-16-le")
    value = bytearray(0x42 + len(encoded))
    # file reference: low 48 bits record number, high 16 bits sequence
    value[0:8] = u64(parent | (1 << 48))
    for off in (0x08, 0x10, 0x18, 0x20):
        value[off : off + 8] = u64(FILETIME)
    value[0x28:0x30] = u64(size)
    value[0x30:0x38] = u64(size)
    value[0x38:0x3C] = u32(flags)
    value[0x40] = len(encoded) // 2
    value[0x41] = 1  # Win32 namespace
    value[0x42:] = encoded
    return resident(ATTR_FILE_NAME, bytes(value), attr_id=1)


def index_entry(record_no, name, flags, size, last=False):
    encoded = name.encode("utf-16-le")
    key = bytearray(0x42 + len(encoded))
    key[0:8] = u64(record_no | (1 << 48))
    for off in (0x08, 0x10, 0x18, 0x20):
        key[off : off + 8] = u64(FILETIME)
    key[0x28:0x30] = u64(size)
    key[0x30:0x38] = u64(size)
    key[0x38:0x3C] = u32(flags)
    key[0x40] = len(encoded) // 2
    key[0x41] = 1
    key[0x42:] = encoded
    total = 0x10 + len(key)
    aligned = (total + 7) // 8 * 8
    out = bytearray(aligned)
    out[0:8] = u64(record_no | (1 << 48))
    out[8:10] = u16(aligned)
    out[10:12] = u16(len(key))
    out[12:14] = u16(0x02 if last else 0)
    out[0x10 : 0x10 + len(key)] = key
    return bytes(out)


def index_root(entries):
    body = b"".join(entries)
    # sentinel: header only, marks the last entry of the node
    sentinel = bytearray(0x10)
    sentinel[8:10] = u16(0x10)
    sentinel[10:12] = u16(0)
    sentinel[12:14] = u16(0x02)
    body += bytes(sentinel)
    out = bytearray(0x20 + len(body))
    out[0:4] = u32(ATTR_FILE_NAME)  # indexed attribute type
    out[4:8] = u32(1)  # collation rule
    out[8:12] = u32(CLUSTER)  # index block size
    out[12] = 1  # clusters per index block
    # INDEX_HEADER starts at 0x10; entries_offset is relative to it
    out[0x10:0x14] = u32(0x10)  # entries start 0x10 bytes into the header
    out[0x14:0x18] = u32(0x10 + len(body))  # index_length, relative to 0x10
    out[0x18:0x1C] = u32(0x10 + len(body))
    out[0x1C] = 0  # no $INDEX_ALLOCATION
    out[0x20 : 0x20 + len(body)] = body
    return resident(ATTR_INDEX_ROOT, bytes(out), attr_id=4, name="$I30")


def build_record(seq, flags, attributes, base_record=0):
    rec = bytearray(RECORD)
    rec[0:4] = b"FILE"
    rec[4:6] = u16(0x30)  # update sequence array offset
    rec[6:8] = u16(RECORD // SECTOR + 1)
    rec[0x10:0x12] = u16(seq)
    rec[0x12:0x14] = u16(1)
    rec[0x14:0x16] = u16(0x38)  # first attribute offset
    rec[0x16:0x18] = u16(flags)
    rec[0x1C:0x20] = u32(RECORD)
    rec[0x20:0x28] = u64(base_record)
    pos = 0x38
    for attr in attributes:
        rec[pos : pos + len(attr)] = attr
        pos += len(attr)
    rec[pos : pos + 4] = b"\xff\xff\xff\xff"
    pos += 8
    rec[0x18:0x1C] = u32(pos)

    # Apply the update sequence array last: every sector's trailing two bytes
    # move into the array and are replaced by the sequence number.
    usn = 0x0001
    sectors = RECORD // SECTOR
    saved = []
    for i in range(sectors):
        tail = (i + 1) * SECTOR
        saved.append(bytes(rec[tail - 2 : tail]))
    rec[0x30:0x32] = u16(usn)
    for i, value in enumerate(saved):
        rec[0x32 + i * 2 : 0x34 + i * 2] = value
    for i in range(sectors):
        tail = (i + 1) * SECTOR
        rec[tail - 2 : tail] = u16(usn)
    return bytes(rec)


def _disp_bits(pos):
    """Bits used for the distance field when `pos` bytes are already produced.

    The phrase token is split dynamically: the distance field is
    ceil(log2(pos)) bits wide (minimum 4), and the length field takes the
    rest. Getting this wrong is invisible until you feed real Windows data
    through the decoder, because a hand-written encoder and decoder can
    agree on the same misreading.
    """
    bits = 0
    span = 1
    while span < pos:
        span *= 2
        bits += 1
    return max(4, bits)


def lznt1_compress_repeated(byte_value, size):
    """Compress `size` copies of one byte into a single LZNT1 chunk.

    Only used for the fixture, so it deliberately implements just the
    "first literal, then distance-1 phrases" shape.
    """
    assert 0 < size <= 4096
    tokens = [(False, bytes([byte_value]))]
    produced = 1
    while produced < size:
        split = 16 - _disp_bits(produced)
        max_len = ((1 << split) - 1) + 3
        take = min(max_len, size - produced)
        if take < 3:
            tokens.append((False, bytes([byte_value])))
            produced += 1
        else:
            # token = ((distance - 1) << split) | (length - 3)
            tokens.append((True, u16(take - 3)))
            produced += take

    body = bytearray()
    i = 0
    while i < len(tokens):
        group = tokens[i : i + 8]
        flag = 0
        for j, (is_phrase, _) in enumerate(group):
            if is_phrase:
                flag |= 1 << j
        body.append(flag)
        for is_phrase, payload in group:
            body += payload
        i += 8

    # 低 12 位是负载长度（不含 2 字节块头），bit15 = 已压缩，bit12-14 = 0b011
    header = 0x8000 | 0x3000 | (len(body) - 1)
    return u16(header) + bytes(body)


def build_boot():
    boot = bytearray(SECTOR)
    boot[0:3] = b"\xeb\x52\x90"
    boot[3:11] = b"NTFS    "
    boot[0x0B:0x0D] = u16(SECTOR)
    boot[0x0D] = SECTOR // CLUSTER  # sectors per cluster
    boot[0x28:0x30] = u64(TOTAL_CLUSTERS * CLUSTER // SECTOR)
    boot[0x30:0x38] = u64(MFT_LCN)
    boot[0x38:0x40] = u64(2)  # $MFTMirr location
    boot[0x40] = 0xF6  # -10 => 1024-byte records
    # clusters-per-index-buffer lives at 0x44; 0x41..0x43 are unused bytes that
    # Windows writes as zero. Leaving 0x41 untouched keeps this fixture shaped
    # like a real volume instead of hiding an offset bug.
    boot[0x44] = 1  # 1 cluster => 512-byte index records
    boot[0x48:0x50] = u64(0x4D4F4F4E46530001)  # volume serial, ours
    boot[510:512] = b"\x55\xaa"
    return bytes(boot)


def build_image():
    image = bytearray(TOTAL_CLUSTERS * CLUSTER)
    image[0:SECTOR] = build_boot()

    records = {}

    # Record 0: $MFT itself. The runlist has to describe the region that is
    # holding it, so the record count is fixed up front.
    mft_runlist = bytes([0x11, MFT_CLUSTERS, MFT_LCN, 0x00])
    records[0] = build_record(
        1,
        0x0001,
        [
            standard_information(0x06),
            non_resident(
                ATTR_DATA,
                mft_runlist,
                MFT_CLUSTERS * CLUSTER,
                MFT_CLUSTERS * CLUSTER,
                highest_vcn=MFT_CLUSTERS - 1,
                attr_id=3,
            ),
        ],
    )

    # Record 3: $Volume. It has to exist for the "version is read from
    # $VOLUME_INFORMATION" claim to be checkable rather than decorative.
    volume_info = bytearray(12)
    volume_info[0x08] = 3
    volume_info[0x09] = 1
    records[3] = build_record(
        1,
        0x0001,
        [
            standard_information(0x06),
            resident(ATTR_VOLUME_INFORMATION, bytes(volume_info), attr_id=2),
        ],
    )

    # Record 5: root directory.
    # Entries must be sorted by name (the index collation rule) and must
    # point at the record that actually holds that file.
    entries = [
        index_entry(7, "big.bin", FILE_ATTRIBUTE_ARCHIVE, 1000),
        index_entry(8, "compressed.txt", FILE_ATTRIBUTE_ARCHIVE, 1024),
        index_entry(12, "deep.bin", FILE_ATTRIBUTE_ARCHIVE, 2000),
        index_entry(6, "hello.txt", FILE_ATTRIBUTE_ARCHIVE, 14),
        index_entry(9, "sparse.bin", FILE_ATTRIBUTE_ARCHIVE, 512),
        index_entry(10, "split.bin", FILE_ATTRIBUTE_ARCHIVE, 2000),
    ]
    records[5] = build_record(
        1,
        0x0003,
        [
            standard_information(FILE_ATTRIBUTE_DIRECTORY),
            file_name(5, ".", FILE_ATTRIBUTE_DIRECTORY, 0),
            index_root(entries),
        ],
    )

    # Record 6: resident data, plus a named data stream (ADS).
    # `dir /r` on Windows shows it as `hello.txt:meta:$DATA`. The default
    # stream stays 14 bytes; a reader that only looks at the unnamed $DATA
    # returns the same 14 bytes and never mentions that the stream exists.
    records[6] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "hello.txt", FILE_ATTRIBUTE_ARCHIVE, 14),
            resident(ATTR_DATA, b"hello, moonfs\n", attr_id=2),
            resident(ATTR_DATA, b"ads:meta\n", attr_id=3, name="meta"),
        ],
    )

    # Record 7: non-resident, two clusters.
    records[7] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "big.bin", FILE_ATTRIBUTE_ARCHIVE, 1000),
            non_resident(
                ATTR_DATA,
                bytes([0x11, DATA_BIG_CLUSTERS, DATA_BIG_LCN, 0x00]),
                1000,
                DATA_BIG_CLUSTERS * CLUSTER,
                highest_vcn=DATA_BIG_CLUSTERS - 1,
                attr_id=2,
            ),
        ],
    )

    # Record 8: compressed. One cluster holds a compression unit that expands
    # to 1024 bytes; compression_unit = 1 means 2 clusters per unit.
    records[8] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "compressed.txt", FILE_ATTRIBUTE_ARCHIVE, 1024),
            non_resident(
                ATTR_DATA,
                bytes([0x11, 1, DATA_COMPRESSED_LCN, 0x00]),
                1024,
                CLUSTER,
                flags=0x0001,
                compression_unit=1,
                highest_vcn=0,
                attr_id=2,
            ),
        ],
    )

    # Record 9: sparse. The runlist holds one unallocated run, so every byte
    # of the file must read back as zero.
    records[9] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "sparse.bin", FILE_ATTRIBUTE_ARCHIVE, 512),
            non_resident(
                ATTR_DATA,
                bytes([0x01, 1, 0x00]),
                512,
                0,
                flags=0x8000,
                highest_vcn=0,
                attr_id=2,
            ),
        ],
    )

    # Records 10 / 11: one file whose $DATA is split across two records.
    # A record can only hold ~1 KiB, so a file with enough attributes -- or a
    # very long runlist -- gets its later extents moved into an "extension
    # record" and joined by $ATTRIBUTE_LIST. Reading only the base record
    # yields the first half of the file and no error at all.
    list_value = attribute_list(
        [
            (ATTR_DATA, 0, 10, 1),
            (ATTR_DATA, 2, 11, 2),
        ]
    )
    records[10] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "split.bin", FILE_ATTRIBUTE_ARCHIVE, 2000),
            resident(ATTR_ATTRIBUTE_LIST, list_value, attr_id=3),
            non_resident(
                ATTR_DATA,
                bytes([0x11, 2, DATA_SPLIT_A_LCN, 0x00]),
                2000,
                2 * CLUSTER,
                lowest_vcn=0,
                highest_vcn=1,
                attr_id=1,
            ),
        ],
    )
    records[11] = build_record(
        1,
        0x0001,
        [
            non_resident(
                ATTR_DATA,
                bytes([0x11, 2, DATA_SPLIT_B_LCN, 0x00]),
                2000,
                2 * CLUSTER,
                lowest_vcn=2,
                highest_vcn=3,
                attr_id=2,
            ),
        ],
        base_record=10,
    )

    # Records 12 / 13: the same split, but now the list itself does not fit in
    # a record either, so it is moved onto the volume and becomes a
    # non-resident attribute with its own runlist. This is what a file with
    # many attributes (or many named streams) actually looks like.
    #
    # Reading the list needs no MFT: its runlist sits in the base record, so
    # it is fetched exactly like file data. Getting this wrong means the
    # extension record is never found and deep.bin reads back as 1024 bytes
    # with no error at all.
    deep_list = attribute_list(
        [
            (ATTR_DATA, 0, 12, 1),
            (ATTR_DATA, 2, 13, 2),
            (ATTR_ATTRIBUTE_LIST, 0, 12, 3),
        ]
    )
    records[12] = build_record(
        1,
        0x0001,
        [
            standard_information(FILE_ATTRIBUTE_ARCHIVE),
            file_name(5, "deep.bin", FILE_ATTRIBUTE_ARCHIVE, 2000),
            non_resident(
                ATTR_ATTRIBUTE_LIST,
                bytes([0x11, 1, DATA_DEEP_LIST_LCN, 0x00]),
                len(deep_list),
                CLUSTER,
                highest_vcn=0,
                attr_id=3,
            ),
            non_resident(
                ATTR_DATA,
                bytes([0x11, 2, DATA_DEEP_A_LCN, 0x00]),
                2000,
                2 * CLUSTER,
                lowest_vcn=0,
                highest_vcn=1,
                attr_id=1,
            ),
        ],
    )
    records[13] = build_record(
        1,
        0x0001,
        [
            non_resident(
                ATTR_DATA,
                bytes([0x11, 2, DATA_DEEP_B_LCN, 0x00]),
                2000,
                2 * CLUSTER,
                lowest_vcn=2,
                highest_vcn=3,
                attr_id=2,
            ),
        ],
        base_record=12,
    )

    mft_offset = MFT_LCN * CLUSTER
    for number, payload in records.items():
        at = mft_offset + number * RECORD
        image[at : at + RECORD] = payload

    # big.bin: 1000 deterministic bytes that are not all identical, so a
    # wrong cluster number produces a visibly different result.
    big = bytes(((i * 37 + 11) & 0xFF) for i in range(1000))
    big_at = DATA_BIG_LCN * CLUSTER
    image[big_at : big_at + len(big)] = big

    # compressed.txt: 1024 copies of 'A', compressed into one cluster
    compressed = lznt1_compress_repeated(ord("A"), 1024)
    comp_at = DATA_COMPRESSED_LCN * CLUSTER
    image[comp_at : comp_at + len(compressed)] = compressed

    # split.bin: 2000 deterministic bytes, stored in two non-adjacent runs
    split = bytes(((i * 7 + 3) & 0xFF) for i in range(2000))
    at_a = DATA_SPLIT_A_LCN * CLUSTER
    image[at_a : at_a + 1024] = split[:1024]
    at_b = DATA_SPLIT_B_LCN * CLUSTER
    image[at_b : at_b + 1024] = split[1024:]

    # deep.bin: the non-resident list on its own cluster, the two extents in
    # two more pairs of clusters
    list_at = DATA_DEEP_LIST_LCN * CLUSTER
    image[list_at : list_at + len(deep_list)] = deep_list
    deep = bytes(((i * 13 + 5) & 0xFF) for i in range(2000))
    deep_a = DATA_DEEP_A_LCN * CLUSTER
    image[deep_a : deep_a + 1024] = deep[:1024]
    deep_b = DATA_DEEP_B_LCN * CLUSTER
    image[deep_b : deep_b + 1024] = deep[1024:]

    return bytes(image), big, compressed


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("testdata/synth-ntfs.img")
    out.parent.mkdir(parents=True, exist_ok=True)
    image, big, compressed = build_image()
    out.write_bytes(image)
    print(f"wrote {out} ({len(image)} bytes)")
    print(f"  big.bin      : 1000 bytes, first 8 = {big[:8].hex()}")
    print(f"  compressed   : {len(compressed)} bytes on disk -> 1024 bytes of 'A'")
    print(f"  sparse       : 512 zero bytes, no allocation")


if __name__ == "__main__":
    main()
