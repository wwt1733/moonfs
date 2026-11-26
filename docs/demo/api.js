function _M0TPC16string10StringView(param0, param1, param2) {
  this.str = param0;
  this.start = param1;
  this.end = param2;
}
function $oob() {
  throw new Error("Index out of bounds");
}
class $PanicError extends Error {}
function $panic(message) {
  throw new $PanicError(message);
}
function _M0TPB13StringBuilder(param0) {
  this.val = param0;
}
const _M0FPB19int__to__string__js = (x, radix) => {
  return x.toString(radix);
};
const _M0FPB21int64__to__string__js = (num, radix) => BigInt.asIntN(64, num).toString(radix);
function _M0TPB4IterGRPC16string10StringViewE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function _M0TPB4IterGcE(param0, param1) {
  this.f = param0;
  this.size_hint = param1;
}
function $makebytes(a, b) {
  const arr = new Uint8Array(a);
  if (b !== 0) {
    arr.fill(b);
  }
  return arr;
}
function _M0TPB8MutLocalGiE(param0) {
  this.val = param0;
}
const _M0FPB22js__code__unit__string = (c) => String.fromCharCode(c);
const _M0FPB13js__index__of = (s, start, end, p) => {
  if (end - start < p.length) return -1;
  if (end === s.length) return s.indexOf(p, start);
  const i = s.substring(start, end).indexOf(p);
  return i < 0 ? i : start + i;
};
function $make_array_len_and_init(a, b) {
  const arr = new Array(a);
  arr.fill(b);
  return arr;
}
const _M0FPB13js__substring = (s, start, end) => start === 0 && end === s.length ? s : s.substring(start, end);
function _M0TPB8MutLocalGORPC16string10StringViewE(param0) {
  this.val = param0;
}
const $bytes_literal$0 = new Uint8Array();
const _M0FPC28encoding4utf823decode__utf8__lossy__js = ((preserveBOMDecoder, dropBOMDecoder) => function(bytes, start, len, preserveBOM) {
   const end = start + len;
   const slice = bytes.subarray(start, end);
   const decoder = preserveBOM ? preserveBOMDecoder : dropBOMDecoder;
   return decoder.decode(slice);
 })(
   new TextDecoder("utf-8", { ignoreBOM: true }),
   new TextDecoder("utf-8", { ignoreBOM: false }),
 );
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE2Ok.prototype.$tag = 1;
function _M0DTPC15error5Error56wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eIo(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error56wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eIo.prototype.$tag = 17;
function _M0DTPC15error5Error66wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eBadSignature(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error66wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eBadSignature.prototype.$tag = 16;
function _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt.prototype.$tag = 15;
function _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotNtfs() {}
_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotNtfs.prototype.$tag = 14;
const _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotNtfs__ = new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotNtfs();
function _M0DTPC15error5Error55wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eBadGeometry(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error55wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eBadGeometry.prototype.$tag = 13;
function _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt.prototype.$tag = 12;
function _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo.prototype.$tag = 11;
function _M0DTPC15error5Error52wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotFound(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error52wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotFound.prototype.$tag = 10;
function _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eReparse(param0, param1) {
  this._0 = param0;
  this._1 = param1;
}
_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eReparse.prototype.$tag = 9;
function _M0DTPC15error5Error53wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eEncrypted(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error53wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eEncrypted.prototype.$tag = 8;
function _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotExt4() {}
_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotExt4.prototype.$tag = 7;
const _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotExt4__ = new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotExt4();
function _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt.prototype.$tag = 6;
function _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo.prototype.$tag = 5;
function _M0DTPC15error5Error52wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotFound(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error52wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotFound.prototype.$tag = 4;
function _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature.prototype.$tag = 3;
function _M0DTPC15error5Error57wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eOutOfBounds(param0, param1, param2) {
  this._0 = param0;
  this._1 = param1;
  this._2 = param2;
}
_M0DTPC15error5Error57wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eOutOfBounds.prototype.$tag = 2;
function _M0DTPC15error5Error63wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eInvalidSectorSize(param0) {
  this._0 = param0;
}
_M0DTPC15error5Error63wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eInvalidSectorSize.prototype.$tag = 1;
function _M0DTPC15error5Error54wwt1733_2fmoonfs_2fsrc_2fbinio_2eBinError_2eOutOfRange(param0, param1, param2) {
  this._0 = param0;
  this._1 = param1;
  this._2 = param2;
}
_M0DTPC15error5Error54wwt1733_2fmoonfs_2fsrc_2fbinio_2eBinError_2eOutOfRange.prototype.$tag = 0;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5binio8BinErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src5binio8BinErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5binio8BinErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src5binio8BinErrorE2Ok.prototype.$tag = 1;
function _M0TPB9ArrayViewGyE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src5block5Image(param0, param1) {
  this.data = param0;
  this.sector_size = param1;
}
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TPC15bytes9BytesView(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ext410Superblock(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15) {
  this.inodes_count = param0;
  this.blocks_count = param1;
  this.first_data_block = param2;
  this.block_size = param3;
  this.blocks_per_group = param4;
  this.inodes_per_group = param5;
  this.inode_size = param6;
  this.desc_size = param7;
  this.feature_compat = param8;
  this.feature_incompat = param9;
  this.feature_ro_compat = param10;
  this.uuid = param11;
  this.volume_name = param12;
  this.base_offset = param13;
  this.groups_count = param14;
  this.needs_recovery = param15;
}
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ext49ExtentRun(param0, param1, param2, param3) {
  this.logical = param0;
  this.length = param1;
  this.physical = param2;
  this.uninitialized = param3;
}
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TPB5ArrayGyE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ext45Inode(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11) {
  this.number = param0;
  this.mode = param1;
  this.size = param2;
  this.modified = param3;
  this.modified_ns = param4;
  this.created = param5;
  this.accessed = param6;
  this.changed = param7;
  this.links_count = param8;
  this.flags = param9;
  this.block = param10;
  this.sectors = param11;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ext49GroupDesc(param0, param1, param2, param3, param4, param5) {
  this.index = param0;
  this.inode_table = param1;
  this.free_blocks_count = param2;
  this.free_inodes_count = param3;
  this.used_dirs_count = param4;
  this.flags = param5;
}
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ext48DirEntry(param0, param1, param2) {
  this.inode = param0;
  this.name = param1;
  this.file_type = param2;
}
function _M0TPB5ArrayGsE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16option6OptionGOlE4None() {}
_M0DTPC16option6OptionGOlE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGOlE4None__ = new _M0DTPC16option6OptionGOlE4None();
function _M0DTPC16option6OptionGOlE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGOlE4Some.prototype.$tag = 1;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TP47wwt17336moonfs3src4ntfs9Attribute(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14) {
  this.type_code = param0;
  this.total_length = param1;
  this.non_resident = param2;
  this.name = param3;
  this.flags = param4;
  this.id = param5;
  this.value = param6;
  this.lowest_vcn = param7;
  this.highest_vcn = param8;
  this.runlist_offset = param9;
  this.compression_unit = param10;
  this.allocated_size = param11;
  this.data_size = param12;
  this.initialized_size = param13;
  this.runs = param14;
}
function _M0TPB5ArrayGcE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TPB9ArrayViewGcE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs13AttrListEntry(param0, param1, param2, param3, param4) {
  this.type_code = param0;
  this.name = param1;
  this.lowest_vcn = param2;
  this.record = param3;
  this.id = param4;
}
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs3Run(param0, param1, param2, param3) {
  this.vcn = param0;
  this.lcn = param1;
  this.clusters = param2;
  this.sparse = param3;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
const $bytes_literal$1 = new Uint8Array([70,73,76,69]);
const $bytes_literal$2 = new Uint8Array([66,65,65,68]);
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs12RecordHeader(param0, param1, param2, param3, param4, param5, param6) {
  this.sequence = param0;
  this.hard_links = param1;
  this.first_attr = param2;
  this.flags = param3;
  this.used_size = param4;
  this.base_record = param5;
  this.next_attr_id = param6;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs12ReparsePoint(param0, param1, param2, param3) {
  this.tag = param0;
  this.kind = param1;
  this.substitute = param2;
  this.print_name = param3;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs3Mft(param0, param1, param2, param3) {
  this.cluster_size = param0;
  this.record_size = param1;
  this.base_offset = param2;
  this.runs = param3;
}
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs8FileName(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
  this.parent_record = param0;
  this.parent_sequence = param1;
  this.created = param2;
  this.modified = param3;
  this.accessed = param4;
  this.logical_size = param5;
  this.allocated_size = param6;
  this.flags = param7;
  this.name = param8;
  this.name_ns = param9;
}
function _M0TP47wwt17336moonfs3src4ntfs8DirEntry(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
  this.record_number = param0;
  this.sequence = param1;
  this.name = param2;
  this.name_ns = param3;
  this.created = param4;
  this.modified = param5;
  this.accessed = param6;
  this.logical_size = param7;
  this.allocated_size = param8;
  this.flags = param9;
}
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
const $bytes_literal$3 = new Uint8Array([73,78,68,88]);
function _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
const $bytes_literal$4 = new Uint8Array([78,84,70,83,32,32,32,32]);
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok.prototype.$tag = 1;
function _M0TP47wwt17336moonfs3src4ntfs6Volume(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
  this.bytes_per_sector = param0;
  this.sectors_per_cluster = param1;
  this.cluster_size = param2;
  this.total_sectors = param3;
  this.mft_lcn = param4;
  this.mft_mirror_lcn = param5;
  this.mft_record_size = param6;
  this.index_record_size = param7;
  this.base_offset = param8;
  this.serial_number = param9;
}
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok.prototype.$tag = 1;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE2Ok.prototype.$tag = 1;
function _M0TPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TP47wwt17336moonfs3src9partition9Partition(param0, param1, param2, param3, param4, param5, param6, param7) {
  this.index = param0;
  this.scheme = param1;
  this.mbr_type = param2;
  this.type_guid = param3;
  this.name = param4;
  this.start_lba = param5;
  this.sector_count = param6;
  this.bootable = param7;
}
function _M0DTPC16result6ResultGsRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRP47wwt17336moonfs3src9partition14PartitionErrorE3Err.prototype.$tag = 0;
function _M0DTPC16result6ResultGsRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(param0) {
  this._0 = param0;
}
_M0DTPC16result6ResultGsRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok.prototype.$tag = 1;
const $bytes_literal$5 = new Uint8Array([69,70,73,32,80,65,82,84]);
const _M0FP47wwt17336moonfs3web3api16expose__describe = (f) => { globalThis.moonfsDescribe = f };
const _M0FP47wwt17336moonfs3web3api12expose__list = (f) => { globalThis.moonfsList = f };
const _M0FP47wwt17336moonfs3web3api12expose__read = (f) => { globalThis.moonfsRead = f };
function _M0DTP47wwt17336moonfs3web3api2Fs4Ntfs(param0) {
  this._0 = param0;
}
_M0DTP47wwt17336moonfs3web3api2Fs4Ntfs.prototype.$tag = 0;
function _M0DTP47wwt17336moonfs3web3api2Fs4Ext4(param0) {
  this._0 = param0;
}
_M0DTP47wwt17336moonfs3web3api2Fs4Ext4.prototype.$tag = 1;
function _M0TPB5ArrayGRP47wwt17336moonfs3web3api5FoundE(param0, param1) {
  this.buf = param0;
  this.len = param1;
}
function _M0TP47wwt17336moonfs3web3api5Found(param0, param1) {
  this.start_lba = param0;
  this.fs = param1;
}
function _M0DTPB6ResultGzsE3Err(param0) {
  this._0 = param0;
}
_M0DTPB6ResultGzsE3Err.prototype.$tag = 0;
function _M0DTPB6ResultGzsE2Ok(param0) {
  this._0 = param0;
}
_M0DTPB6ResultGzsE2Ok.prototype.$tag = 1;
const _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger = { method_0: _M0IPB13StringBuilderPB6Logger13write__string, method_1: _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE, method_2: _M0IPB13StringBuilderPB6Logger11write__view, method_3: _M0IPB13StringBuilderPB6Logger11write__char, method_4: _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE, method_5: _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE };
const _M0MPB4Iter4nextN6constrS377GRPC16string10StringViewE = 0;
const _M0MPB4Iter4nextN6constrS378GRPC16string10StringViewE = 0;
const _M0MPB4Iter4nextN6constrS385GcE = 0;
const _M0MPB4Iter4nextN6constrS386GcE = 0;
const _M0MPB4Iter3newN6constrS399GRPC16string10StringViewE = 0;
const _M0MPB4Iter3newN6constrS405GcE = 0;
const _M0MPC16string10StringView4findN6constrS530 = 0;
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1713 = new _M0TPC16string10StringView("\\", 0, 1);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1714 = new _M0TPC16string10StringView("\\\\", 0, 2);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1715 = new _M0TPC16string10StringView("\"", 0, 1);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1716 = new _M0TPC16string10StringView("\\\"", 0, 2);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1717 = new _M0TPC16string10StringView("\n", 0, 1);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1718 = new _M0TPC16string10StringView("\\n", 0, 2);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1719 = new _M0TPC16string10StringView("\r", 0, 1);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1720 = new _M0TPC16string10StringView("\\r", 0, 2);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1721 = new _M0TPC16string10StringView("\t", 0, 1);
const _M0FP47wwt17336moonfs3web3api5quoteN6recordS1722 = new _M0TPC16string10StringView("\\t", 0, 2);
const _M0FP47wwt17336moonfs3src4ext45hex32N6digitsS827 = "0123456789abcdef";
const _M0FP47wwt17336moonfs3web3api11split__pathN6recordS1774 = new _M0TPC16string10StringView("/", 0, 1);
const _M0FP47wwt17336moonfs3src4ext413resolve__pathN6recordS1046 = new _M0TPC16string10StringView("/", 0, 1);
function _M0MPC16string10StringView12unsafe__view(self, start, end) {
  return new _M0TPC16string10StringView(self.str, self.start + start | 0, self.start + end | 0);
}
function _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGRP47wwt17336moonfs3src4ext49ExtentRunEE(dst, dst_offset, src, src_offset, len) {
  if (dst === src && dst_offset < src_offset) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        const _tmp$2 = dst_offset + i | 0;
        const _tmp$3 = src_offset + i | 0;
        if (_tmp$2 >>> 0 < dst.length) {
          dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
        } else {
          $oob();
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  } else {
    let _tmp = len - 1 | 0;
    let _tmp$2 = len > 0;
    while (true) {
      const i = _tmp;
      const _more = _tmp$2;
      if (_more) {
        const _tmp$3 = dst_offset + i | 0;
        const _tmp$4 = src_offset + i | 0;
        if (_tmp$3 >>> 0 < dst.length) {
          dst[_tmp$3] = _tmp$4 >>> 0 < src.length ? src[_tmp$4] : $oob();
        } else {
          $oob();
        }
        _tmp = i - 1 | 0;
        _tmp$2 = i > 0;
        continue;
      } else {
        return;
      }
    }
  }
}
function _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGcEE(dst, dst_offset, src, src_offset, len) {
  if (dst === src && dst_offset < src_offset) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        const _tmp$2 = dst_offset + i | 0;
        const _tmp$3 = src_offset + i | 0;
        if (_tmp$2 >>> 0 < dst.length) {
          dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
        } else {
          $oob();
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  } else {
    let _tmp = len - 1 | 0;
    let _tmp$2 = len > 0;
    while (true) {
      const i = _tmp;
      const _more = _tmp$2;
      if (_more) {
        const _tmp$3 = dst_offset + i | 0;
        const _tmp$4 = src_offset + i | 0;
        if (_tmp$3 >>> 0 < dst.length) {
          dst[_tmp$3] = _tmp$4 >>> 0 < src.length ? src[_tmp$4] : $oob();
        } else {
          $oob();
        }
        _tmp = i - 1 | 0;
        _tmp$2 = i > 0;
        continue;
      } else {
        return;
      }
    }
  }
}
function _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len) {
  if (dst === src && dst_offset < src_offset) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        const _tmp$2 = dst_offset + i | 0;
        const _tmp$3 = src_offset + i | 0;
        if (_tmp$2 >>> 0 < dst.length) {
          dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
        } else {
          $oob();
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  } else {
    let _tmp = len - 1 | 0;
    let _tmp$2 = len > 0;
    while (true) {
      const i = _tmp;
      const _more = _tmp$2;
      if (_more) {
        const _tmp$3 = dst_offset + i | 0;
        const _tmp$4 = src_offset + i | 0;
        if (_tmp$3 >>> 0 < dst.length) {
          dst[_tmp$3] = _tmp$4 >>> 0 < src.length ? src[_tmp$4] : $oob();
        } else {
          $oob();
        }
        _tmp = i - 1 | 0;
        _tmp$2 = i > 0;
        continue;
      } else {
        return;
      }
    }
  }
}
function _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, len) {
  _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len);
}
function _M0MPB18UninitializedArray12unsafe__blitGRP47wwt17336moonfs3web3api5FoundE(dst, dst_offset, src, src_offset, len) {
  _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGRP47wwt17336moonfs3src4ext49ExtentRunEE(dst, dst_offset, src, src_offset, len);
}
function _M0MPB18UninitializedArray12unsafe__blitGcE(dst, dst_offset, src, src_offset, len) {
  _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGcEE(dst, dst_offset, src, src_offset, len);
}
function _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(src, allocate_len, src_offset, dst_offset, blit_len) {
  const dst = new Uint8Array(allocate_len);
  _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, blit_len);
  return dst;
}
function _M0MPB18UninitializedArray23unsafe__make__and__blitGRP47wwt17336moonfs3web3api5FoundE(src, allocate_len, src_offset, dst_offset, blit_len) {
  const dst = new Array(allocate_len);
  _M0MPB18UninitializedArray12unsafe__blitGRP47wwt17336moonfs3web3api5FoundE(dst, dst_offset, src, src_offset, blit_len);
  return dst;
}
function _M0MPB18UninitializedArray23unsafe__make__and__blitGcE(src, allocate_len, src_offset, dst_offset, blit_len) {
  const dst = new Array(allocate_len);
  _M0MPB18UninitializedArray12unsafe__blitGcE(dst, dst_offset, src, src_offset, blit_len);
  return dst;
}
function _M0MPB13StringBuilder13write__objectGiE(self, obj) {
  _M0IP016_24default__implPB4Show6outputGiE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPB18UninitializedArray23make__and__blit_2einnerGyE(src, allocate_len, len, src_offset, dst_offset) {
  let _tmp;
  if (allocate_len >= 0) {
    let _tmp$2;
    if (len >= 0) {
      let _tmp$3;
      const _p = src.length;
      if (src_offset >= 0 && src_offset <= (_p - len | 0)) {
        _tmp$3 = dst_offset >= 0 && dst_offset <= (allocate_len - len | 0);
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    _tmp = _tmp$2;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    return _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(src, allocate_len, src_offset, dst_offset, len);
  } else {
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "bounds check failed: allocate_len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, allocate_len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", dst_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, dst_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src.length = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src.length);
    return $panic(_string_builder.val);
  }
}
function _M0MPB18UninitializedArray23make__and__blit_2einnerGRP47wwt17336moonfs3web3api5FoundE(src, allocate_len, len, src_offset, dst_offset) {
  let _tmp;
  if (allocate_len >= 0) {
    let _tmp$2;
    if (len >= 0) {
      let _tmp$3;
      const _p = src.length;
      if (src_offset >= 0 && src_offset <= (_p - len | 0)) {
        _tmp$3 = dst_offset >= 0 && dst_offset <= (allocate_len - len | 0);
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    _tmp = _tmp$2;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    return _M0MPB18UninitializedArray23unsafe__make__and__blitGRP47wwt17336moonfs3web3api5FoundE(src, allocate_len, src_offset, dst_offset, len);
  } else {
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "bounds check failed: allocate_len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, allocate_len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", dst_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, dst_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src.length = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src.length);
    return $panic(_string_builder.val);
  }
}
function _M0MPB18UninitializedArray23make__and__blit_2einnerGcE(src, allocate_len, len, src_offset, dst_offset) {
  let _tmp;
  if (allocate_len >= 0) {
    let _tmp$2;
    if (len >= 0) {
      let _tmp$3;
      const _p = src.length;
      if (src_offset >= 0 && src_offset <= (_p - len | 0)) {
        _tmp$3 = dst_offset >= 0 && dst_offset <= (allocate_len - len | 0);
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    _tmp = _tmp$2;
  } else {
    _tmp = false;
  }
  if (_tmp) {
    return _M0MPB18UninitializedArray23unsafe__make__and__blitGcE(src, allocate_len, src_offset, dst_offset, len);
  } else {
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "bounds check failed: allocate_len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, allocate_len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", dst_offset = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, dst_offset);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", len = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src.length = ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, src.length);
    return $panic(_string_builder.val);
  }
}
function _M0MPB13StringBuilder21StringBuilder_2einner(size_hint) {
  return size_hint >= 0 ? new _M0TPB13StringBuilder("") : $panic("size_hint must be non-negative");
}
function _M0IPB13StringBuilderPB6Logger11write__char(self, ch) {
  self.val = `${self.val}${String.fromCodePoint(ch)}`;
}
function _M0IPB13StringBuilderPB6Logger13write__string(self, str) {
  self.val = `${self.val}${str}`;
}
function _M0FPB32code__point__of__surrogate__pair(leading, trailing) {
  return (((Math.imul(leading - 55296 | 0, 1024) | 0) + trailing | 0) - 56320 | 0) + 65536 | 0;
}
function _M0MPC14byte4Byte7to__hexN14to__hex__digitS351(i) {
  if (i < 10) {
    const _p = (i + 48 | 0) & 255;
    return _p;
  } else {
    const _p = (i + 97 | 0) & 255;
    const _p$2 = (_p - 10 | 0) & 255;
    return _p$2;
  }
}
function _M0MPC14byte4Byte7to__hex(b) {
  const _self = _M0MPB13StringBuilder21StringBuilder_2einner(8);
  _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS351((b / 16 | 0) & 255));
  _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS351((b % 16 | 0) & 255));
  const _p = _self;
  return _p.val;
}
function _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE(self, show) {
  show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
}
function _M0MPC16string6String21clamped__view_2einner(self, start, end) {
  const len = self.length;
  let lo;
  if (start <= 0) {
    lo = 0;
  } else {
    if (start >= len) {
      lo = len;
    } else {
      let _tmp;
      const _p = self.charCodeAt(start);
      if (_p >= 56320 && _p <= 57343) {
        const _p$2 = self.charCodeAt(start - 1 | 0);
        _tmp = _p$2 >= 55296 && _p$2 <= 56319;
      } else {
        _tmp = false;
      }
      if (_tmp) {
        lo = start + 1 | 0;
      } else {
        lo = start;
      }
    }
  }
  let hi;
  if (end === undefined) {
    hi = len;
  } else {
    const _Some = end;
    const _e = _Some;
    if (_e <= 0) {
      hi = 0;
    } else {
      if (_e >= len) {
        hi = len;
      } else {
        let _tmp;
        const _p = self.charCodeAt(_e);
        if (_p >= 56320 && _p <= 57343) {
          const _p$2 = self.charCodeAt(_e - 1 | 0);
          _tmp = _p$2 >= 55296 && _p$2 <= 56319;
        } else {
          _tmp = false;
        }
        if (_tmp) {
          hi = _e - 1 | 0;
        } else {
          hi = _e;
        }
      }
    }
  }
  return lo >= hi ? new _M0TPC16string10StringView(self, lo, lo) : new _M0TPC16string10StringView(self, lo, hi);
}
function _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(self, value, start, len) {
  _M0IPB13StringBuilderPB6Logger11write__view(self, _M0MPC16string6String21clamped__view_2einner(value, start, start + len | 0));
}
function _M0IP016_24default__implPB4Show6outputGiE(self, logger) {
  logger.method_table.method_0(logger.self, _M0IPC13int3IntPB4Show10to__string(self));
}
function _M0MPB4Iter4nextGRPC16string10StringViewE(self) {
  const _func = self.f;
  const result = _func();
  const _bind = self.size_hint;
  if (result === undefined) {
    self.size_hint = _M0MPB4Iter4nextN6constrS378GRPC16string10StringViewE;
  } else {
    if (_bind === undefined) {
    } else {
      const _Some = _bind;
      const _n = _Some;
      self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS377GRPC16string10StringViewE;
    }
  }
  return result;
}
function _M0MPB4Iter4nextGcE(self) {
  const _func = self.f;
  const result = _func();
  const _bind = self.size_hint;
  if (result === -1) {
    self.size_hint = _M0MPB4Iter4nextN6constrS386GcE;
  } else {
    if (_bind === undefined) {
    } else {
      const _Some = _bind;
      const _n = _Some;
      self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS385GcE;
    }
  }
  return result;
}
function _M0MPC13int3Int18to__string_2einner(self, radix) {
  return _M0FPB19int__to__string__js(self, radix);
}
function _M0MPC15int645Int6418to__string_2einner(self, radix) {
  return _M0FPB21int64__to__string__js(self, radix);
}
function _M0MPC16uint166UInt1618to__string_2einner(self, radix) {
  return _M0MPC13int3Int18to__string_2einner(self, radix);
}
function _M0MPB4Iter3newGRPC16string10StringViewE(f, size_hint) {
  let size_hint$2;
  if (size_hint === undefined) {
    size_hint$2 = undefined;
  } else {
    const _Some = size_hint;
    const _n = _Some;
    size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS399GRPC16string10StringViewE;
  }
  return new _M0TPB4IterGRPC16string10StringViewE(f, size_hint$2);
}
function _M0MPB4Iter3newGcE(f, size_hint) {
  let size_hint$2;
  if (size_hint === undefined) {
    size_hint$2 = undefined;
  } else {
    const _Some = size_hint;
    const _n = _Some;
    size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS405GcE;
  }
  return new _M0TPB4IterGcE(f, size_hint$2);
}
function _M0MPC16string10StringView9to__owned(self) {
  return self.str.substring(self.start, self.end);
}
function _M0MPC16string10StringView4iter(self) {
  const start = self.start;
  const end = self.end;
  const index = new _M0TPB8MutLocalGiE(start);
  return _M0MPB4Iter3newGcE(() => {
    if (index.val < end) {
      const c1 = self.str.charCodeAt(index.val);
      if (c1 >= 55296 && c1 <= 56319 && (index.val + 1 | 0) < self.end) {
        const c2 = self.str.charCodeAt(index.val + 1 | 0);
        if (c2 >= 56320 && c2 <= 57343) {
          index.val = index.val + 2 | 0;
          return _M0FPB32code__point__of__surrogate__pair(c1, c2);
        }
      }
      index.val = index.val + 1 | 0;
      return c1;
    } else {
      return -1;
    }
  }, undefined);
}
function _M0MPC16string6String11from__array(chars) {
  const buf = _M0MPB13StringBuilder21StringBuilder_2einner(Math.imul(chars.end - chars.start | 0, 4) | 0);
  const _bind = chars.end - chars.start | 0;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const c = chars.buf[chars.start + _ | 0];
      _M0IPB13StringBuilderPB6Logger11write__char(buf, c);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return buf.val;
}
function _M0IPB13StringBuilderPB6Logger11write__view(self, str) {
  self.val = `${self.val}${_M0MPC16string10StringView9to__owned(str)}`;
}
function _M0FPB24find__code__unit__scalar(data, start, end, code) {
  let _tmp = start;
  while (true) {
    const pos = _tmp;
    if (pos < end) {
      if (data.charCodeAt(pos) === code) {
        return pos;
      }
      _tmp = pos + 1 | 0;
      continue;
    } else {
      return -1;
    }
  }
}
function _M0FPB30find__code__unit__from__string(data, start, end, code) {
  return (end - start | 0) <= 8 ? _M0FPB24find__code__unit__scalar(data, start, end, code) : _M0FPB13js__index__of(data, start, end, _M0FPB22js__code__unit__string(code));
}
function _M0FPB28find__code__unit__from__view(target, start, end, code) {
  const target_start = target.start;
  const found = _M0FPB30find__code__unit__from__string(target.str, target_start + start | 0, target_start + end | 0, code);
  return found < 0 ? -1 : found - target_start | 0;
}
function _M0FPB19kmp__failure__table(pattern) {
  const m = pattern.end - pattern.start | 0;
  const table = $make_array_len_and_init(m, 0);
  let k = 0;
  let _tmp = 1;
  while (true) {
    const i = _tmp;
    if (i < m) {
      const c = pattern.str.charCodeAt(pattern.start + i | 0);
      while (true) {
        if (k > 0 && c !== pattern.str.charCodeAt(pattern.start + k | 0)) {
          const _tmp$2 = k - 1 | 0;
          k = _tmp$2 >>> 0 < table.length ? table[_tmp$2] : $oob();
          continue;
        } else {
          break;
        }
      }
      if (c === pattern.str.charCodeAt(pattern.start + k | 0)) {
        k = k + 1 | 0;
      }
      if (i >>> 0 < table.length) {
        table[i] = k;
      } else {
        $oob();
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return table;
}
function _M0FPB24find__pattern__kmp__from(target, pattern, start) {
  const n = target.end - target.start | 0;
  const m = pattern.end - pattern.start | 0;
  const table = _M0FPB19kmp__failure__table(pattern);
  let k = 0;
  let _tmp = start;
  while (true) {
    const i = _tmp;
    if (i < n) {
      const c = target.str.charCodeAt(target.start + i | 0);
      while (true) {
        if (k > 0 && c !== pattern.str.charCodeAt(pattern.start + k | 0)) {
          const _tmp$2 = k - 1 | 0;
          k = _tmp$2 >>> 0 < table.length ? table[_tmp$2] : $oob();
          continue;
        } else {
          break;
        }
      }
      if (c === pattern.str.charCodeAt(pattern.start + k | 0)) {
        k = k + 1 | 0;
      }
      if (k === m) {
        return (i - m | 0) + 1 | 0;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return undefined;
}
function _M0FPB36find__two__anchor__candidate__scalar(data, start, candidate_end, first, last_offset, last) {
  let _tmp = start;
  while (true) {
    const pos = _tmp;
    if (pos < candidate_end) {
      if (data.charCodeAt(pos) === first && data.charCodeAt(pos + last_offset | 0) === last) {
        return pos;
      }
      _tmp = pos + 1 | 0;
      continue;
    } else {
      return -1;
    }
  }
}
function _M0FPB42find__two__anchor__candidate__from__string(data, start, candidate_end, first, last_offset, last) {
  return _M0FPB36find__two__anchor__candidate__scalar(data, start, candidate_end, first, last_offset, last);
}
function _M0FPB21string__ranges__equal(left, left_start, right, right_start, length) {
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < length) {
      if (left.charCodeAt(left_start + i | 0) !== right.charCodeAt(right_start + i | 0)) {
        return false;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0FPB22find__by__two__anchors(target, pattern) {
  const target_len = target.end - target.start | 0;
  const pattern_len = pattern.end - pattern.start | 0;
  const target_start = target.start;
  const pattern_start = pattern.start;
  const last_offset = pattern_len - 1 | 0;
  const candidate_end = ((target_start + target_len | 0) - pattern_len | 0) + 1 | 0;
  const first = pattern.str.charCodeAt(pattern.start);
  const last = pattern.str.charCodeAt(pattern.start + last_offset | 0);
  const middle_len = last_offset - 1 | 0;
  let _tmp = target_start;
  let _tmp$2 = 0;
  while (true) {
    const pos = _tmp;
    const failures = _tmp$2;
    if (pos < candidate_end) {
      const found = _M0FPB42find__two__anchor__candidate__from__string(target.str, pos, candidate_end, first, last_offset, last);
      if (found < 0) {
        return undefined;
      }
      if (_M0FPB21string__ranges__equal(target.str, found + 1 | 0, pattern.str, pattern_start + 1 | 0, middle_len)) {
        return found - target_start | 0;
      }
      const failures$2 = failures + 1 | 0;
      const scanned = found - target_start | 0;
      if (failures$2 > 64 || failures$2 > (4 + (scanned / 8 | 0) | 0)) {
        return _M0FPB24find__pattern__kmp__from(target, pattern, scanned + 1 | 0);
      }
      _tmp = found + 1 | 0;
      _tmp$2 = failures$2;
      continue;
    } else {
      return undefined;
    }
  }
}
function _M0FPB13find__pattern(target, pattern) {
  if ((pattern.end - pattern.start | 0) <= 250) {
    const target_start = target.start;
    const pattern_start = pattern.start;
    const found = _M0FPB13js__index__of(target.str, target_start, target_start + (target.end - target.start | 0) | 0, _M0FPB13js__substring(pattern.str, pattern_start, pattern_start + (pattern.end - pattern.start | 0) | 0));
    return found < 0 ? undefined : found - target_start | 0;
  } else {
    return _M0FPB22find__by__two__anchors(target, pattern);
  }
}
function _M0MPC16string10StringView4find(self, str) {
  const pattern_len = str.end - str.start | 0;
  switch (pattern_len) {
    case 0: {
      return _M0MPC16string10StringView4findN6constrS530;
    }
    case 1: {
      const found = _M0FPB28find__code__unit__from__view(self, 0, self.end - self.start | 0, str.str.charCodeAt(str.start));
      return found < 0 ? undefined : found;
    }
    default: {
      return pattern_len > (self.end - self.start | 0) ? undefined : _M0FPB13find__pattern(self, str);
    }
  }
}
function _M0MPC16string6String4find(self, str) {
  return _M0MPC16string10StringView4find(new _M0TPC16string10StringView(self, 0, self.length), str);
}
function _M0FPB23array__growth__capacity(current, len, required) {
  if (required < len) {
    $panic("Array capacity overflow");
  }
  const start = current === 0 ? 8 : current;
  let _tmp = start;
  while (true) {
    const space = _tmp;
    if (space < required) {
      const next = Math.imul(space, 2) | 0;
      if (next <= space) {
        return required;
      }
      _tmp = next;
      continue;
    } else {
      return space;
    }
  }
}
function _M0MPC15array5Array8capacityGyE(self) {
  return self.buf.length;
}
function _M0MPC15array5Array8capacityGRP47wwt17336moonfs3web3api5FoundE(self) {
  return self.buf.length;
}
function _M0MPC15array5Array8capacityGcE(self) {
  return self.buf.length;
}
function _M0MPC15array5Array14resize__bufferGyE(self, new_capacity) {
  const old_buf = self.buf;
  self.buf = new Uint8Array([]);
  const len = self.len;
  const copy_len = len < new_capacity ? len : new_capacity;
  const new_buf = _M0MPB18UninitializedArray23make__and__blit_2einnerGyE(old_buf, new_capacity, copy_len, 0, 0);
  self.buf = new_buf;
}
function _M0MPC15array5Array14resize__bufferGRP47wwt17336moonfs3web3api5FoundE(self, new_capacity) {
  const old_buf = self.buf;
  self.buf = [];
  const len = self.len;
  const copy_len = len < new_capacity ? len : new_capacity;
  const new_buf = _M0MPB18UninitializedArray23make__and__blit_2einnerGRP47wwt17336moonfs3web3api5FoundE(old_buf, new_capacity, copy_len, 0, 0);
  self.buf = new_buf;
}
function _M0MPC15array5Array14resize__bufferGcE(self, new_capacity) {
  const old_buf = self.buf;
  self.buf = [];
  const len = self.len;
  const copy_len = len < new_capacity ? len : new_capacity;
  const new_buf = _M0MPB18UninitializedArray23make__and__blit_2einnerGcE(old_buf, new_capacity, copy_len, 0, 0);
  self.buf = new_buf;
}
function _M0MPC15array5Array7reallocGyE(self, required) {
  const old_cap = _M0MPC15array5Array8capacityGyE(self);
  const new_cap = _M0FPB23array__growth__capacity(old_cap, self.len, required);
  _M0MPC15array5Array14resize__bufferGyE(self, new_cap);
}
function _M0MPC15array5Array7reallocGRP47wwt17336moonfs3web3api5FoundE(self, required) {
  const old_cap = _M0MPC15array5Array8capacityGRP47wwt17336moonfs3web3api5FoundE(self);
  const new_cap = _M0FPB23array__growth__capacity(old_cap, self.len, required);
  _M0MPC15array5Array14resize__bufferGRP47wwt17336moonfs3web3api5FoundE(self, new_cap);
}
function _M0MPC15array5Array7reallocGcE(self, required) {
  const old_cap = _M0MPC15array5Array8capacityGcE(self);
  const new_cap = _M0FPB23array__growth__capacity(old_cap, self.len, required);
  _M0MPC15array5Array14resize__bufferGcE(self, new_cap);
}
function _M0MPC15array5Array4pushGyE(self, value) {
  if (self.len === self.buf.length) {
    _M0MPC15array5Array7reallocGyE(self, self.len + 1 | 0);
  }
  const length = self.len;
  self.buf[length] = value;
  self.len = length + 1 | 0;
}
function _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(self, value) {
  if (self.len === self.buf.length) {
    _M0MPC15array5Array7reallocGRP47wwt17336moonfs3web3api5FoundE(self, self.len + 1 | 0);
  }
  const length = self.len;
  self.buf[length] = value;
  self.len = length + 1 | 0;
}
function _M0MPC15array5Array4pushGcE(self, value) {
  if (self.len === self.buf.length) {
    _M0MPC15array5Array7reallocGcE(self, self.len + 1 | 0);
  }
  const length = self.len;
  self.buf[length] = value;
  self.len = length + 1 | 0;
}
function _M0MPB4Iter3mapGcRPC16string10StringViewE(self, f) {
  return new _M0TPB4IterGRPC16string10StringViewE(() => {
    const _bind = _M0MPB4Iter4nextGcE(self);
    if (_bind === -1) {
      return undefined;
    } else {
      const _Some = _bind;
      const _x = _Some;
      return f(_x);
    }
  }, self.size_hint);
}
function _M0IPC14char4CharPB4Show10to__string(self) {
  return String.fromCodePoint(self);
}
function _M0MPC16string10StringView5split(self, sep) {
  const sep_len = sep.end - sep.start | 0;
  if (sep_len === 0) {
    return _M0MPB4Iter3mapGcRPC16string10StringViewE(_M0MPC16string10StringView4iter(self), (c) => {
      const _bind = _M0IPC14char4CharPB4Show10to__string(c);
      return new _M0TPC16string10StringView(_bind, 0, _bind.length);
    });
  }
  const remaining = new _M0TPB8MutLocalGORPC16string10StringViewE(self);
  return _M0MPB4Iter3newGRPC16string10StringViewE(() => {
    const _bind = remaining.val;
    if (_bind === undefined) {
      return undefined;
    } else {
      const _Some = _bind;
      const _view = _Some;
      const _bind$2 = _M0MPC16string10StringView4find(_view, sep);
      if (_bind$2 === undefined) {
        remaining.val = undefined;
        return _view;
      } else {
        const _Some$2 = _bind$2;
        const _end = _Some$2;
        remaining.val = _M0MPC16string10StringView12unsafe__view(_view, _end + sep_len | 0, _view.end - _view.start | 0);
        return _M0MPC16string10StringView12unsafe__view(_view, 0, _end);
      }
    }
  }, undefined);
}
function _M0MPC16string6String5split(self, sep) {
  return _M0MPC16string10StringView5split(new _M0TPC16string10StringView(self, 0, self.length), sep);
}
function _M0MPC16string6String12replace__all(self, old, new_) {
  const len = self.length;
  const buf = _M0MPB13StringBuilder21StringBuilder_2einner(len);
  const old_len = old.end - old.start | 0;
  const new$2 = _M0MPC16string10StringView9to__owned(new_);
  if (old_len === 0) {
    _M0IPB13StringBuilderPB6Logger13write__string(buf, new$2);
    const _bind = self.length;
    let _tmp = 0;
    while (true) {
      const _string_index = _tmp;
      if (_string_index < _bind) {
        let _decoded_next_string_index;
        let _decoded_char;
        _L: {
          const _bind$2 = self.charCodeAt(_string_index);
          if (_bind$2 >= 55296 && _bind$2 <= 56319 && (_string_index + 1 | 0) < _bind) {
            const _bind$3 = self.charCodeAt(_string_index + 1 | 0);
            if (_bind$3 >= 56320 && _bind$3 <= 57343) {
              const _tmp$2 = _string_index + 2 | 0;
              const _p = (((Math.imul(_bind$2 - 55296 | 0, 1024) | 0) + _bind$3 | 0) - 56320 | 0) + 65536 | 0;
              _decoded_next_string_index = _tmp$2;
              _decoded_char = _p;
              break _L;
            } else {
              const _tmp$2 = _string_index + 1 | 0;
              const _p = _bind$2;
              _decoded_next_string_index = _tmp$2;
              _decoded_char = _p;
              break _L;
            }
          } else {
            const _tmp$2 = _string_index + 1 | 0;
            const _p = _bind$2;
            _decoded_next_string_index = _tmp$2;
            _decoded_char = _p;
            break _L;
          }
        }
        _M0IPB13StringBuilderPB6Logger11write__char(buf, _decoded_char);
        _M0IPB13StringBuilderPB6Logger13write__string(buf, new$2);
        _tmp = _decoded_next_string_index;
        continue;
      } else {
        break;
      }
    }
    return buf.val;
  } else {
    const first_end = _M0MPC16string6String4find(self, old);
    if (first_end === undefined) {
      return self;
    } else {
      const _Some = first_end;
      const _end = _Some;
      let _tmp = new _M0TPC16string10StringView(self, 0, self.length);
      let _tmp$2 = _end;
      while (true) {
        const view = _tmp;
        const end = _tmp$2;
        const seg = _M0MPC16string10StringView12unsafe__view(view, 0, end);
        _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(buf, seg.str, seg.start, seg.end - seg.start | 0);
        _M0IPB13StringBuilderPB6Logger13write__string(buf, new$2);
        if ((end + old_len | 0) <= len) {
          const next_view = _M0MPC16string10StringView12unsafe__view(view, end + old_len | 0, view.end - view.start | 0);
          const _bind = _M0MPC16string10StringView4find(next_view, old);
          if (_bind === undefined) {
            _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(buf, next_view.str, next_view.start, next_view.end - next_view.start | 0);
            break;
          } else {
            const _Some$2 = _bind;
            const _next_end = _Some$2;
            _tmp = next_view;
            _tmp$2 = _next_end;
            continue;
          }
        } else {
          break;
        }
      }
      return buf.val;
    }
  }
}
function _M0IPC13int3IntPB4Show10to__string(self) {
  return _M0MPC13int3Int18to__string_2einner(self, 10);
}
function _M0MPC13int3Int8to__char(self) {
  _L: {
    if (self >= 0 && self <= 55295) {
      break _L;
    } else {
      if (self >= 57344 && self <= 1114111) {
        break _L;
      } else {
        return -1;
      }
    }
  }
  return self;
}
function _M0MPC15bytes5Bytes11from__array(arr) {
  const len = arr.end - arr.start | 0;
  if (len === 0) {
    return $bytes_literal$0;
  }
  const result = _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(arr.buf, len, arr.start, 0, len);
  return result;
}
function _M0MPC15array5Array6insertGRP47wwt17336moonfs3src4ntfs9AttributeE(self, index, value) {
  if (index >= 0 && index <= self.len) {
    if (self.len === self.buf.length) {
      _M0MPC15array5Array7reallocGRP47wwt17336moonfs3web3api5FoundE(self, self.len + 1 | 0);
    }
    _M0MPB18UninitializedArray12unsafe__blitGRP47wwt17336moonfs3web3api5FoundE(self.buf, index + 1 | 0, self.buf, index, self.len - index | 0);
    const length = self.len;
    self.buf[index] = value;
    self.len = length + 1 | 0;
    return;
  } else {
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(60);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "index out of bounds: the len is from 0 to ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, self.len);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " but the index is ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, index);
    $panic(_string_builder.val);
    return;
  }
}
function _M0FPC28encoding4utf821decode__lossy_2einner(bytes, ignore_bom) {
  return _M0FPC28encoding4utf823decode__utf8__lossy__js(bytes.buf, bytes.start, bytes.end - bytes.start | 0, !ignore_bom);
}
function _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, need) {
  if (offset < 0 || (need < 0 || (offset + need | 0) > bytes.length)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE3Err(new _M0DTPC15error5Error54wwt1733_2fmoonfs_2fsrc_2fbinio_2eBinError_2eOutOfRange(offset, need, bytes.length));
  } else {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src5binio8BinErrorE2Ok(undefined);
  }
}
function _M0FP47wwt17336moonfs3src5binio2u8(bytes, offset) {
  const _bind = _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, 1);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  const _p = offset >>> 0 < bytes.length ? bytes[offset] : $oob();
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok(BigInt.asUintN(64, BigInt(_p)));
}
function _M0FP47wwt17336moonfs3src5binio5u16le(bytes, offset) {
  const _bind = _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, 2);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  const _p = offset >>> 0 < bytes.length ? bytes[offset] : $oob();
  const _tmp = BigInt.asUintN(64, BigInt(_p));
  const _tmp$2 = offset + 1 | 0;
  const _p$2 = _tmp$2 >>> 0 < bytes.length ? bytes[_tmp$2] : $oob();
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok(BigInt.asUintN(64, _tmp | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p$2)) << BigInt(8 & 63))));
}
function _M0FP47wwt17336moonfs3src5binio5u32le(bytes, offset) {
  const _bind = _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, 4);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  const _p = offset >>> 0 < bytes.length ? bytes[offset] : $oob();
  const _tmp = BigInt.asUintN(64, BigInt(_p));
  const _tmp$2 = offset + 1 | 0;
  const _p$2 = _tmp$2 >>> 0 < bytes.length ? bytes[_tmp$2] : $oob();
  const _tmp$3 = BigInt.asUintN(64, _tmp | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p$2)) << BigInt(8 & 63)));
  const _tmp$4 = offset + 2 | 0;
  const _p$3 = _tmp$4 >>> 0 < bytes.length ? bytes[_tmp$4] : $oob();
  const _tmp$5 = BigInt.asUintN(64, _tmp$3 | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p$3)) << BigInt(16 & 63)));
  const _tmp$6 = offset + 3 | 0;
  const _p$4 = _tmp$6 >>> 0 < bytes.length ? bytes[_tmp$6] : $oob();
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok(BigInt.asUintN(64, _tmp$5 | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p$4)) << BigInt(24 & 63))));
}
function _M0FP47wwt17336moonfs3src5binio5i64le(bytes, offset) {
  const _bind = _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, 8);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src5binio5u32le(bytes, offset);
  let _tmp;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp = _ok._0;
  } else {
    return _bind$2;
  }
  const _tmp$2 = _tmp;
  const _bind$3 = _M0FP47wwt17336moonfs3src5binio5u32le(bytes, offset + 4 | 0);
  let _tmp$3;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp$3 = _ok._0;
  } else {
    return _bind$3;
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src5binio8BinErrorE2Ok(BigInt.asUintN(64, _tmp$2 | BigInt.asUintN(64, _tmp$3 << BigInt(32 & 63))));
}
function _M0FP47wwt17336moonfs3src5binio5slice(bytes, offset, len) {
  const _bind = _M0FP47wwt17336moonfs3src5binio6ensure(bytes, offset, len);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  const out = $makebytes(len, 0);
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < len) {
      const _tmp$2 = offset + i | 0;
      if (i >>> 0 < out.length) {
        out[i] = _tmp$2 >>> 0 < bytes.length ? bytes[_tmp$2] : $oob();
      } else {
        $oob();
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5binio8BinErrorE2Ok(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out, 0, out.length)));
}
function _M0FP47wwt17336moonfs3src5binio12starts__with(bytes, offset, prefix) {
  const n = prefix.length;
  if (offset < 0 || (offset + n | 0) > bytes.length) {
    return false;
  }
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < n) {
      const _tmp$2 = offset + i | 0;
      if ((_tmp$2 >>> 0 < bytes.length ? bytes[_tmp$2] : $oob()) !== (i >>> 0 < prefix.length ? prefix[i] : $oob())) {
        return false;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0MP47wwt17336moonfs3src5block5Image19from__bytes_2einner(data, sector_size) {
  let ok;
  switch (sector_size) {
    case 512: {
      ok = true;
      break;
    }
    case 1024: {
      ok = true;
      break;
    }
    case 2048: {
      ok = true;
      break;
    }
    case 4096: {
      ok = true;
      break;
    }
    default: {
      ok = false;
    }
  }
  if (!ok) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE3Err(new _M0DTPC15error5Error63wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eInvalidSectorSize(sector_size));
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src5block5ImageRP47wwt17336moonfs3src5block10BlockErrorE2Ok(new _M0TP47wwt17336moonfs3src5block5Image(data, sector_size));
}
function _M0MP47wwt17336moonfs3src5block5Image4read(self, offset, len) {
  const size = BigInt.asUintN(64, BigInt(self.data.length));
  const need = BigInt.asUintN(64, BigInt(len));
  if (BigInt.asIntN(64, offset) < BigInt.asIntN(64, 0n) || (BigInt.asIntN(64, need) < BigInt.asIntN(64, 0n) || BigInt.asIntN(64, BigInt.asUintN(64, offset + need)) > BigInt.asIntN(64, size))) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE3Err(new _M0DTPC15error5Error57wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eOutOfBounds(offset, need, size));
  }
  const start = Number(BigInt.asIntN(32, offset)) | 0;
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5slice(self.data, start, len);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src5block10BlockErrorE3Err(new _M0DTPC15error5Error57wwt1733_2fmoonfs_2fsrc_2fblock_2eBlockError_2eOutOfBounds(offset, need, size));
}
function _M0MP47wwt17336moonfs3src5block5Image12read__sector(self, lba) {
  return _M0MP47wwt17336moonfs3src5block5Image4read(self, BigInt.asUintN(64, lba * BigInt.asUintN(64, BigInt(self.sector_size))), self.sector_size);
}
function _M0FP47wwt17336moonfs3src5block10reason__of(err) {
  if (err.$tag === 2) {
    const _OutOfBounds = err;
    const _offset = _OutOfBounds._0;
    const _need = _OutOfBounds._1;
    const _size = _OutOfBounds._2;
    return `need ${_M0MPC15int645Int6418to__string_2einner(_need, 10)} byte(s) at ${_M0MPC15int645Int6418to__string_2einner(_offset, 10)}, image is ${_M0MPC15int645Int6418to__string_2einner(_size, 10)} byte(s)`;
  } else {
    const _InvalidSectorSize = err;
    const _size = _InvalidSectorSize._0;
    return `invalid sector size ${_M0MPC13int3Int18to__string_2einner(_size, 10)}`;
  }
}
function _M0FP47wwt17336moonfs3src4ext47rd__u16(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u16le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ext47rd__u32(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u32le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ext413fixed__string(buf, off, len) {
  let raw;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FP47wwt17336moonfs3src5binio5slice(buf, off, len);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        raw = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`string field out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
  }
  let end = len;
  while (true) {
    let _tmp;
    if (end > 0) {
      const _tmp$2 = end - 1 | 0;
      _tmp = (_tmp$2 >>> 0 < raw.length ? raw[_tmp$2] : $oob()) === 0;
    } else {
      _tmp = false;
    }
    if (_tmp) {
      end = end - 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let trimmed;
  let _try_err$2;
  _L$2: {
    _L$3: {
      const _bind = _M0FP47wwt17336moonfs3src5binio5slice(raw, 0, end);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        trimmed = _ok._0;
      } else {
        const _err = _bind;
        _try_err$2 = _err._0;
        break _L$3;
      }
      break _L$2;
    }
    trimmed = raw;
  }
  return new _M0DTPC16result6ResultGsRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_M0FPC28encoding4utf821decode__lossy_2einner(new _M0TPC15bytes9BytesView(trimmed, 0, trimmed.length), false));
}
function _M0FP47wwt17336moonfs3src4ext45hex32(value) {
  let out = "";
  let shift = 28;
  while (true) {
    if (shift >= 0) {
      const nibble = BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asIntN(64, value) >> BigInt(shift & 63)) & 15n);
      const _tmp = out;
      const _tmp$2 = Number(BigInt.asIntN(32, nibble)) | 0;
      out = `${_tmp}${_M0MPC16uint166UInt1618to__string_2einner(_tmp$2 >>> 0 < _M0FP47wwt17336moonfs3src4ext45hex32N6digitsS827.length ? _M0FP47wwt17336moonfs3src4ext45hex32N6digitsS827.charCodeAt(_tmp$2) : $oob(), 10)}`;
      shift = shift - 4 | 0;
      continue;
    } else {
      break;
    }
  }
  return out;
}
function _M0FP47wwt17336moonfs3src4ext417parse__superblock(raw, base_offset) {
  if (raw.length < 1024) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("superblock buffer is shorter than 1024 bytes"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 56);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asUintN(64, _tmp) !== BigInt.asUintN(64, 61267n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotExt4__);
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 92);
  let feature_compat;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    feature_compat = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 96);
  let feature_incompat;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    feature_incompat = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 100);
  let feature_ro_compat;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    feature_ro_compat = _ok._0;
  } else {
    return _bind$4;
  }
  const unknown = BigInt.asUintN(64, feature_incompat & 4294895677n);
  if (BigInt.asUintN(64, unknown) !== BigInt.asUintN(64, 0n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature(`incompat 0x${_M0FP47wwt17336moonfs3src4ext45hex32(unknown)}`));
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 24);
  let log_block_size;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    log_block_size = _ok._0;
  } else {
    return _bind$5;
  }
  if (BigInt.asIntN(64, log_block_size) > BigInt.asIntN(64, 6n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`s_log_block_size ${_M0MPC15int645Int6418to__string_2einner(log_block_size, 10)} is out of range`));
  }
  const block_size = Number(BigInt.asIntN(32, BigInt.asUintN(64, 1024n << BigInt(Number(BigInt.asIntN(32, log_block_size)) & 63)))) | 0;
  const _bind$6 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 88);
  let inode_size_raw;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    inode_size_raw = _ok._0;
  } else {
    return _bind$6;
  }
  const _bind$7 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 76);
  let rev_level;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    rev_level = _ok._0;
  } else {
    return _bind$7;
  }
  const inode_size = BigInt.asUintN(64, rev_level) === BigInt.asUintN(64, 0n) || BigInt.asUintN(64, inode_size_raw) === BigInt.asUintN(64, 0n) ? 128 : Number(BigInt.asIntN(32, inode_size_raw)) | 0;
  if (inode_size < 128 || (inode_size > block_size || (inode_size % 128 | 0) !== 0)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`inode size ${_M0MPC13int3Int18to__string_2einner(inode_size, 10)} is invalid`));
  }
  const has_64bit = BigInt.asUintN(64, BigInt.asUintN(64, feature_incompat & 128n)) !== BigInt.asUintN(64, 0n);
  let desc_size;
  if (has_64bit) {
    const _bind$8 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 254);
    let _tmp$2;
    if (_bind$8.$tag === 1) {
      const _ok = _bind$8;
      _tmp$2 = _ok._0;
    } else {
      return _bind$8;
    }
    const raw_desc = Number(BigInt.asIntN(32, _tmp$2)) | 0;
    if (raw_desc < 64 || raw_desc > block_size) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`descriptor size ${_M0MPC13int3Int18to__string_2einner(raw_desc, 10)} contradicts 64bit feature`));
    }
    desc_size = raw_desc;
  } else {
    desc_size = 32;
  }
  if (BigInt.asUintN(64, BigInt.asUintN(64, feature_ro_compat & 512n)) !== BigInt.asUintN(64, 0n)) {
    const _bind$8 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 28);
    let log_cluster;
    if (_bind$8.$tag === 1) {
      const _ok = _bind$8;
      log_cluster = _ok._0;
    } else {
      return _bind$8;
    }
    if (BigInt.asUintN(64, log_cluster) !== BigInt.asUintN(64, log_block_size)) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature("bigalloc"));
    }
  }
  const _bind$8 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 4);
  let blocks_lo;
  if (_bind$8.$tag === 1) {
    const _ok = _bind$8;
    blocks_lo = _ok._0;
  } else {
    return _bind$8;
  }
  let blocks_hi;
  if (has_64bit) {
    const _bind$9 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 336);
    if (_bind$9.$tag === 1) {
      const _ok = _bind$9;
      blocks_hi = _ok._0;
    } else {
      return _bind$9;
    }
  } else {
    blocks_hi = 0n;
  }
  const blocks_count = BigInt.asUintN(64, BigInt.asUintN(64, blocks_hi << BigInt(32 & 63)) | blocks_lo);
  const _bind$9 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 0);
  let inodes_count;
  if (_bind$9.$tag === 1) {
    const _ok = _bind$9;
    inodes_count = _ok._0;
  } else {
    return _bind$9;
  }
  const _bind$10 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 32);
  let blocks_per_group;
  if (_bind$10.$tag === 1) {
    const _ok = _bind$10;
    blocks_per_group = _ok._0;
  } else {
    return _bind$10;
  }
  const _bind$11 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 40);
  let inodes_per_group;
  if (_bind$11.$tag === 1) {
    const _ok = _bind$11;
    inodes_per_group = _ok._0;
  } else {
    return _bind$11;
  }
  const _bind$12 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 20);
  let first_data_block;
  if (_bind$12.$tag === 1) {
    const _ok = _bind$12;
    first_data_block = _ok._0;
  } else {
    return _bind$12;
  }
  if (BigInt.asIntN(64, blocks_count) <= BigInt.asIntN(64, 0n) || (BigInt.asIntN(64, blocks_per_group) <= BigInt.asIntN(64, 0n) || BigInt.asIntN(64, inodes_per_group) <= BigInt.asIntN(64, 0n))) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("superblock has a zero count where one is required"));
  }
  if (BigInt.asIntN(64, inodes_count) > BigInt.asIntN(64, 0n) && BigInt.asIntN(64, inodes_per_group) > BigInt.asIntN(64, inodes_count)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("inodes per group exceeds the total inode count"));
  }
  if (blocks_per_group === 0n) {
    $panic();
  }
  const groups_count = BigInt.asUintN(64, BigInt.asIntN(64, BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, blocks_count - first_data_block) + blocks_per_group) - 1n)) / BigInt.asIntN(64, blocks_per_group));
  let uuid;
  let _try_err;
  _L: {
    _L$2: {
      const _bind$13 = _M0FP47wwt17336moonfs3src5binio5slice(raw, 104, 16);
      if (_bind$13.$tag === 1) {
        const _ok = _bind$13;
        uuid = _ok._0;
      } else {
        const _err = _bind$13;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("uuid field out of range"));
  }
  const _bind$13 = _M0FP47wwt17336moonfs3src4ext413fixed__string(raw, 120, 16);
  let _tmp$2;
  if (_bind$13.$tag === 1) {
    const _ok = _bind$13;
    _tmp$2 = _ok._0;
  } else {
    return _bind$13;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(new _M0TP47wwt17336moonfs3src4ext410Superblock(inodes_count, blocks_count, first_data_block, block_size, blocks_per_group, inodes_per_group, inode_size, desc_size, feature_compat, feature_incompat, feature_ro_compat, uuid, _tmp$2, base_offset, groups_count, BigInt.asUintN(64, BigInt.asUintN(64, feature_incompat & 4n)) !== BigInt.asUintN(64, 0n)));
}
function _M0MP47wwt17336moonfs3src4ext410Superblock8open__at(img, base_offset) {
  let raw;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image4read(img, BigInt.asUintN(64, base_offset + 1024n), 1024);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        raw = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext410SuperblockRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(`cannot read superblock: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
  }
  return _M0FP47wwt17336moonfs3src4ext417parse__superblock(raw, base_offset);
}
function _M0MP47wwt17336moonfs3src4ext410Superblock4open(img, start_lba) {
  const base = BigInt.asUintN(64, start_lba * BigInt.asUintN(64, BigInt(img.sector_size)));
  return _M0MP47wwt17336moonfs3src4ext410Superblock8open__at(img, base);
}
function _M0FP47wwt17336moonfs3src4ext415describe__error(err) {
  switch (err.$tag) {
    case 7: {
      return "not an ext2/3/4 filesystem (magic 0xEF53 missing)";
    }
    case 6: {
      const _Corrupt = err;
      const _reason = _Corrupt._0;
      return `corrupt: ${_reason}`;
    }
    case 5: {
      const _Io = err;
      const _reason$2 = _Io._0;
      return `io: ${_reason$2}`;
    }
    case 4: {
      const _NotFound = err;
      const _name = _NotFound._0;
      return `not found: ${_name}`;
    }
    default: {
      const _UnsupportedFeature = err;
      const _feature = _UnsupportedFeature._0;
      return `unsupported ext4 feature: ${_feature}`;
    }
  }
}
function _M0FP47wwt17336moonfs3src4ext422check__readable__inode(inode) {
  if (BigInt.asUintN(64, BigInt.asUintN(64, inode.flags & 2048n)) !== BigInt.asUintN(64, 0n)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature("fscrypt-encrypted inode"));
  }
  if (BigInt.asUintN(64, BigInt.asUintN(64, inode.flags & 16777216n)) !== BigInt.asUintN(64, 0n)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature("inline data inode"));
  } else {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(undefined);
  }
}
function _M0FP47wwt17336moonfs3src4ext418walk__extent__node(img, sb, node, level, runs) {
  if (BigInt.asIntN(64, level) > BigInt.asIntN(64, 5n)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("extent tree is deeper than 5 levels"));
  }
  if (node.length < 12) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("extent node is shorter than its 12-byte header"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, 0);
  let magic;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    magic = _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asUintN(64, magic) !== BigInt.asUintN(64, 62218n)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`extent node magic is 0x${_M0FP47wwt17336moonfs3src4ext45hex32(magic)}`));
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, 2);
  let entries;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    entries = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, 4);
  let max_entries;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    max_entries = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, 6);
  let depth;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    depth = _ok._0;
  } else {
    return _bind$4;
  }
  if (BigInt.asIntN(64, depth) > BigInt.asIntN(64, 5n)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`extent node claims depth ${_M0MPC15int645Int6418to__string_2einner(depth, 10)}`));
  }
  const capacity = (node.length - 12 | 0) / 12 | 0;
  if (BigInt.asIntN(64, entries) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt(capacity)))) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`extent node holds ${_M0MPC15int645Int6418to__string_2einner(entries, 10)} entries but only fits ${_M0MPC13int3Int18to__string_2einner(capacity, 10)}`));
  }
  if (BigInt.asIntN(64, max_entries) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt(capacity))) || BigInt.asIntN(64, max_entries) < BigInt.asIntN(64, entries)) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`extent node max_entries ${_M0MPC15int645Int6418to__string_2einner(max_entries, 10)} is inconsistent`));
  }
  let i = 0n;
  while (true) {
    if (BigInt.asIntN(64, i) < BigInt.asIntN(64, entries)) {
      const at = 12 + (Number(BigInt.asIntN(32, BigInt.asUintN(64, i * 12n))) | 0) | 0;
      if (BigInt.asUintN(64, depth) === BigInt.asUintN(64, 0n)) {
        const _bind$5 = _M0FP47wwt17336moonfs3src4ext47rd__u32(node, at);
        let logical;
        if (_bind$5.$tag === 1) {
          const _ok = _bind$5;
          logical = _ok._0;
        } else {
          return _bind$5;
        }
        const _bind$6 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, at + 4 | 0);
        let raw_len;
        if (_bind$6.$tag === 1) {
          const _ok = _bind$6;
          raw_len = _ok._0;
        } else {
          return _bind$6;
        }
        const _bind$7 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, at + 6 | 0);
        let _tmp;
        if (_bind$7.$tag === 1) {
          const _ok = _bind$7;
          _tmp = _ok._0;
        } else {
          return _bind$7;
        }
        const _tmp$2 = BigInt.asUintN(64, _tmp << BigInt(32 & 63));
        const _bind$8 = _M0FP47wwt17336moonfs3src4ext47rd__u32(node, at + 8 | 0);
        let _tmp$3;
        if (_bind$8.$tag === 1) {
          const _ok = _bind$8;
          _tmp$3 = _ok._0;
        } else {
          return _bind$8;
        }
        const physical = BigInt.asUintN(64, _tmp$2 | _tmp$3);
        const uninit = BigInt.asIntN(64, raw_len) > BigInt.asIntN(64, 32768n);
        const length = uninit ? BigInt.asUintN(64, raw_len - 32768n) : raw_len;
        if (BigInt.asIntN(64, length) > BigInt.asIntN(64, 0n)) {
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(runs, new _M0TP47wwt17336moonfs3src4ext49ExtentRun(logical, length, physical, uninit));
        }
      } else {
        const _bind$5 = _M0FP47wwt17336moonfs3src4ext47rd__u16(node, at + 8 | 0);
        let _tmp;
        if (_bind$5.$tag === 1) {
          const _ok = _bind$5;
          _tmp = _ok._0;
        } else {
          return _bind$5;
        }
        const _tmp$2 = BigInt.asUintN(64, _tmp << BigInt(32 & 63));
        const _bind$6 = _M0FP47wwt17336moonfs3src4ext47rd__u32(node, at + 4 | 0);
        let _tmp$3;
        if (_bind$6.$tag === 1) {
          const _ok = _bind$6;
          _tmp$3 = _ok._0;
        } else {
          return _bind$6;
        }
        const child_block = BigInt.asUintN(64, _tmp$2 | _tmp$3);
        let child;
        let _try_err;
        _L: {
          _L$2: {
            const _bind$7 = _M0MP47wwt17336moonfs3src5block5Image4read(img, BigInt.asUintN(64, sb.base_offset + BigInt.asUintN(64, child_block * BigInt.asUintN(64, BigInt(sb.block_size)))), sb.block_size);
            if (_bind$7.$tag === 1) {
              const _ok = _bind$7;
              child = _ok._0;
            } else {
              const _err = _bind$7;
              _try_err = _err._0;
              break _L$2;
            }
            break _L;
          }
          return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(`cannot read extent node block ${_M0MPC15int645Int6418to__string_2einner(child_block, 10)}: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
        }
        const _bind$7 = _M0FP47wwt17336moonfs3src4ext418walk__extent__node(img, sb, child, BigInt.asUintN(64, level + 1n), runs);
        if (_bind$7.$tag === 1) {
          const _ok = _bind$7;
          _ok._0;
        } else {
          return _bind$7;
        }
      }
      i = BigInt.asUintN(64, i + 1n);
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(undefined);
}
function _M0FP47wwt17336moonfs3src4ext412extent__runs(img, sb, inode) {
  if (!(BigInt.asUintN(64, BigInt.asUintN(64, inode.flags & 524288n)) !== BigInt.asUintN(64, 0n))) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature("inode without extents (legacy block map)"));
  }
  const runs = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunE([], 0);
  const _bind = _M0FP47wwt17336moonfs3src4ext418walk__extent__node(img, sb, inode.block, 0n, runs);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext49ExtentRunERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(runs);
}
function _M0FP47wwt17336moonfs3src4ext410read__runs(img, sb, runs, size) {
  const total = Number(BigInt.asIntN(32, size)) | 0;
  const out = new _M0TPB5ArrayGyE(new Uint8Array([]), 0);
  let i = 0;
  while (true) {
    if (i < total) {
      _M0MPC15array5Array4pushGyE(out, 0);
      i = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const block_size = BigInt.asUintN(64, BigInt(sb.block_size));
  const _bind = runs.len;
  const _bind$2 = runs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const run = _bind$2[_];
      _L: {
        if (run.uninitialized) {
          break _L;
        }
        let k = 0n;
        while (true) {
          if (BigInt.asIntN(64, k) < BigInt.asIntN(64, run.length)) {
            const logical = BigInt.asUintN(64, run.logical + k);
            const byte_start = BigInt.asUintN(64, logical * block_size);
            if (BigInt.asIntN(64, byte_start) >= BigInt.asIntN(64, size)) {
              break;
            }
            let data;
            let _try_err;
            _L$2: {
              _L$3: {
                const _p = BigInt.asUintN(64, run.physical + k);
                const _bind$3 = _M0MP47wwt17336moonfs3src5block5Image4read(img, BigInt.asUintN(64, sb.base_offset + BigInt.asUintN(64, _p * BigInt.asUintN(64, BigInt(sb.block_size)))), sb.block_size);
                if (_bind$3.$tag === 1) {
                  const _ok = _bind$3;
                  data = _ok._0;
                } else {
                  const _err = _bind$3;
                  _try_err = _err._0;
                  break _L$3;
                }
                break _L$2;
              }
              return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(`cannot read data block ${_M0MPC15int645Int6418to__string_2einner(BigInt.asUintN(64, run.physical + k), 10)}: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
            }
            const remaining = BigInt.asUintN(64, size - byte_start);
            const count = BigInt.asIntN(64, block_size) < BigInt.asIntN(64, remaining) ? Number(BigInt.asIntN(32, block_size)) | 0 : Number(BigInt.asIntN(32, remaining)) | 0;
            let j = 0;
            while (true) {
              if (j < count) {
                const _bind$3 = (Number(BigInt.asIntN(32, byte_start)) | 0) + j | 0;
                const _tmp$2 = j;
                const _bind$4 = _tmp$2 >>> 0 < data.length ? data[_tmp$2] : $oob();
                if (_bind$3 < 0 || _bind$3 >= out.len) {
                  $panic();
                }
                out.buf[_bind$3] = _bind$4;
                j = j + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            k = BigInt.asUintN(64, k + 1n);
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out.buf, 0, out.len)));
}
function _M0MP47wwt17336moonfs3src4ext45Inode11is__symlink(self) {
  return BigInt.asUintN(64, BigInt.asUintN(64, self.mode & 61440n)) === BigInt.asUintN(64, 40960n);
}
function _M0FP47wwt17336moonfs3src4ext417read__inode__data(img, sb, inode) {
  const _bind = _M0FP47wwt17336moonfs3src4ext422check__readable__inode(inode);
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asUintN(64, inode.size) === BigInt.asUintN(64, 0n)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok($bytes_literal$0);
  }
  if (_M0MP47wwt17336moonfs3src4ext45Inode11is__symlink(inode) && !(BigInt.asUintN(64, BigInt.asUintN(64, inode.flags & 524288n)) !== BigInt.asUintN(64, 0n))) {
    if (BigInt.asIntN(64, inode.size) > BigInt.asIntN(64, 60n)) {
      return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error62wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eUnsupportedFeature("slow symlink target"));
    }
    let _tmp;
    let _try_err;
    _L: {
      _L$2: {
        const _bind$2 = _M0FP47wwt17336moonfs3src5binio5slice(inode.block, 0, Number(BigInt.asIntN(32, inode.size)) | 0);
        if (_bind$2.$tag === 1) {
          const _ok = _bind$2;
          _tmp = _ok._0;
        } else {
          const _err = _bind$2;
          _try_err = _err._0;
          break _L$2;
        }
        break _L;
      }
      return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt("symlink target is outside i_block"));
    }
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_tmp);
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext412extent__runs(img, sb, inode);
  let runs;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    runs = _ok._0;
  } else {
    return _bind$2;
  }
  return _M0FP47wwt17336moonfs3src4ext410read__runs(img, sb, runs, inode.size);
}
function _M0MP47wwt17336moonfs3src4ext45Inode13is__directory(self) {
  return BigInt.asUintN(64, BigInt.asUintN(64, self.mode & 61440n)) === BigInt.asUintN(64, 16384n);
}
function _M0FP47wwt17336moonfs3src4ext411split__time(lo, extra, has_extra) {
  if (!has_extra) {
    return { _0: lo, _1: 0n };
  }
  const epoch = BigInt.asUintN(64, extra & 3n);
  const ns = BigInt.asUintN(64, BigInt.asIntN(64, extra) >> BigInt(2 & 63));
  return { _0: BigInt.asUintN(64, BigInt.asUintN(64, epoch << BigInt(32 & 63)) | lo), _1: ns };
}
function _M0FP47wwt17336moonfs3src4ext412parse__inode(raw, number) {
  const _bind = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 0);
  let mode;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    mode = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 4);
  let size_lo;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    size_lo = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 8);
  let atime_lo;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    atime_lo = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 12);
  let ctime_lo;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    ctime_lo = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 16);
  let mtime_lo;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    mtime_lo = _ok._0;
  } else {
    return _bind$5;
  }
  const _bind$6 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 26);
  let links;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    links = _ok._0;
  } else {
    return _bind$6;
  }
  const _bind$7 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 28);
  let sectors;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    sectors = _ok._0;
  } else {
    return _bind$7;
  }
  const _bind$8 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 32);
  let flags;
  if (_bind$8.$tag === 1) {
    const _ok = _bind$8;
    flags = _ok._0;
  } else {
    return _bind$8;
  }
  let extra_isize;
  if (raw.length > 130) {
    const _bind$9 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 128);
    let declared;
    if (_bind$9.$tag === 1) {
      const _ok = _bind$9;
      declared = _ok._0;
    } else {
      return _bind$9;
    }
    extra_isize = BigInt.asIntN(64, declared) > BigInt.asIntN(64, 4n) ? Number(BigInt.asIntN(32, declared)) | 0 : 0;
  } else {
    extra_isize = 0;
  }
  const has_mtime_extra = extra_isize >= 12;
  const has_crtime = extra_isize >= 24;
  let _bind$9;
  if (has_mtime_extra) {
    const _bind$10 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 136);
    let _tmp;
    if (_bind$10.$tag === 1) {
      const _ok = _bind$10;
      _tmp = _ok._0;
    } else {
      return _bind$10;
    }
    _bind$9 = _M0FP47wwt17336moonfs3src4ext411split__time(mtime_lo, _tmp, true);
  } else {
    _bind$9 = _M0FP47wwt17336moonfs3src4ext411split__time(mtime_lo, 0n, false);
  }
  const _modified = _bind$9._0;
  const _modified_ns = _bind$9._1;
  let _bind$10;
  if (extra_isize >= 8) {
    const _bind$11 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 132);
    let _tmp;
    if (_bind$11.$tag === 1) {
      const _ok = _bind$11;
      _tmp = _ok._0;
    } else {
      return _bind$11;
    }
    _bind$10 = _M0FP47wwt17336moonfs3src4ext411split__time(ctime_lo, _tmp, true);
  } else {
    _bind$10 = _M0FP47wwt17336moonfs3src4ext411split__time(ctime_lo, 0n, false);
  }
  const _changed = _bind$10._0;
  let _bind$11;
  if (extra_isize >= 16) {
    const _bind$12 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 140);
    let _tmp;
    if (_bind$12.$tag === 1) {
      const _ok = _bind$12;
      _tmp = _ok._0;
    } else {
      return _bind$12;
    }
    _bind$11 = _M0FP47wwt17336moonfs3src4ext411split__time(atime_lo, _tmp, true);
  } else {
    _bind$11 = _M0FP47wwt17336moonfs3src4ext411split__time(atime_lo, 0n, false);
  }
  const _accessed = _bind$11._0;
  let created;
  if (has_crtime) {
    const _bind$12 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 144);
    let _tmp;
    if (_bind$12.$tag === 1) {
      const _ok = _bind$12;
      _tmp = _ok._0;
    } else {
      return _bind$12;
    }
    const _tmp$2 = _tmp;
    const _bind$13 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 148);
    let _tmp$3;
    if (_bind$13.$tag === 1) {
      const _ok = _bind$13;
      _tmp$3 = _ok._0;
    } else {
      return _bind$13;
    }
    const _bind$14 = _M0FP47wwt17336moonfs3src4ext411split__time(_tmp$2, _tmp$3, true);
    created = _bind$14._0;
  } else {
    created = 0n;
  }
  const _bind$12 = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, 108);
  let size_high;
  if (_bind$12.$tag === 1) {
    const _ok = _bind$12;
    size_high = _ok._0;
  } else {
    return _bind$12;
  }
  const size = BigInt.asUintN(64, BigInt.asUintN(64, size_high << BigInt(32 & 63)) | size_lo);
  let block;
  let _try_err;
  _L: {
    _L$2: {
      const _bind$13 = _M0FP47wwt17336moonfs3src5binio5slice(raw, 40, 60);
      if (_bind$13.$tag === 1) {
        const _ok = _bind$13;
        block = _ok._0;
      } else {
        const _err = _bind$13;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`inode ${_M0MPC15int645Int6418to__string_2einner(number, 10)} is too short`));
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(new _M0TP47wwt17336moonfs3src4ext45Inode(number, mode, size, _modified, _modified_ns, created, _accessed, _changed, links, flags, block, sectors));
}
function _M0FP47wwt17336moonfs3src4ext416read__block__ptr(raw, lo_off, hi_off, has_64bit) {
  const _bind = _M0FP47wwt17336moonfs3src4ext47rd__u32(raw, lo_off);
  let lo;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    lo = _ok._0;
  } else {
    return _bind;
  }
  if (!has_64bit) {
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(lo);
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, hi_off);
  let hi;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    hi = _ok._0;
  } else {
    return _bind$2;
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(BigInt.asUintN(64, BigInt.asUintN(64, hi << BigInt(32 & 63)) | lo));
}
function _M0FP47wwt17336moonfs3src4ext413read__count16(raw, lo_off, hi_off, has_64bit) {
  const _bind = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, lo_off);
  let lo;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    lo = _ok._0;
  } else {
    return _bind;
  }
  if (!has_64bit) {
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(lo);
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, hi_off);
  let hi;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    hi = _ok._0;
  } else {
    return _bind$2;
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(BigInt.asUintN(64, BigInt.asUintN(64, hi << BigInt(16 & 63)) | lo));
}
function _M0FP47wwt17336moonfs3src4ext417read__group__desc(img, sb, index) {
  if (BigInt.asIntN(64, index) < BigInt.asIntN(64, 0n) || BigInt.asIntN(64, index) >= BigInt.asIntN(64, sb.groups_count)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`group index ${_M0MPC15int645Int6418to__string_2einner(index, 10)} is outside the volume`));
  }
  const table_block = sb.block_size === 1024 ? 2n : 1n;
  const offset = BigInt.asUintN(64, BigInt.asUintN(64, sb.base_offset + BigInt.asUintN(64, table_block * BigInt.asUintN(64, BigInt(sb.block_size)))) + BigInt.asUintN(64, index * BigInt.asUintN(64, BigInt(sb.desc_size))));
  let raw;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image4read(img, offset, sb.desc_size);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        raw = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(`cannot read group descriptor: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
  }
  const has_64bit = sb.desc_size >= 64;
  const _bind = _M0FP47wwt17336moonfs3src4ext416read__block__ptr(raw, 8, 40, has_64bit);
  let inode_table;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    inode_table = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ext413read__count16(raw, 12, 44, has_64bit);
  let free_blocks;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    free_blocks = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ext413read__count16(raw, 14, 46, has_64bit);
  let free_inodes;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    free_inodes = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ext413read__count16(raw, 16, 48, has_64bit);
  let used_dirs;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    used_dirs = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ext47rd__u16(raw, 18);
  let _tmp;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    _tmp = _ok._0;
  } else {
    return _bind$5;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext49GroupDescRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(new _M0TP47wwt17336moonfs3src4ext49GroupDesc(index, inode_table, free_blocks, free_inodes, used_dirs, _tmp));
}
function _M0FP47wwt17336moonfs3src4ext411read__inode(img, sb, number) {
  if (BigInt.asIntN(64, number) <= BigInt.asIntN(64, 0n) || BigInt.asIntN(64, number) > BigInt.asIntN(64, sb.inodes_count)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`inode ${_M0MPC15int645Int6418to__string_2einner(number, 10)} is outside the volume`));
  }
  const _tmp = sb.inodes_per_group;
  if (_tmp === 0n) {
    $panic();
  }
  const group_index = BigInt.asUintN(64, BigInt.asIntN(64, BigInt.asUintN(64, number - 1n)) / BigInt.asIntN(64, _tmp));
  const _bind = _M0FP47wwt17336moonfs3src4ext417read__group__desc(img, sb, group_index);
  let desc;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    desc = _ok._0;
  } else {
    return _bind;
  }
  const _tmp$2 = sb.inodes_per_group;
  if (_tmp$2 === 0n) {
    $panic();
  }
  const slot = BigInt.asUintN(64, BigInt.asIntN(64, BigInt.asUintN(64, number - 1n)) % BigInt.asIntN(64, _tmp$2));
  const _p = desc.inode_table;
  const offset = BigInt.asUintN(64, BigInt.asUintN(64, sb.base_offset + BigInt.asUintN(64, _p * BigInt.asUintN(64, BigInt(sb.block_size)))) + BigInt.asUintN(64, slot * BigInt.asUintN(64, BigInt(sb.inode_size))));
  let raw;
  let _try_err;
  _L: {
    _L$2: {
      const _bind$2 = _M0MP47wwt17336moonfs3src5block5Image4read(img, offset, sb.inode_size);
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        raw = _ok._0;
      } else {
        const _err = _bind$2;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eIo(`cannot read inode ${_M0MPC15int645Int6418to__string_2einner(number, 10)}: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
  }
  return _M0FP47wwt17336moonfs3src4ext412parse__inode(raw, number);
}
function _M0FP47wwt17336moonfs3src4ext419parse__dir__entries(data, sb) {
  const has_file_type = BigInt.asUintN(64, BigInt.asUintN(64, sb.feature_incompat & 2n)) !== BigInt.asUintN(64, 0n);
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryE([], 0);
  const total = data.length;
  let pos = 0;
  while (true) {
    if ((pos + 8 | 0) <= total) {
      let inode_no;
      let _try_err;
      _L: {
        _L$2: {
          const _bind = _M0FP47wwt17336moonfs3src5binio5u32le(data, pos);
          if (_bind.$tag === 1) {
            const _ok = _bind;
            inode_no = _ok._0;
          } else {
            const _err = _bind;
            _try_err = _err._0;
            break _L$2;
          }
          break _L;
        }
        inode_no = 0n;
      }
      let rec_len;
      let _try_err$2;
      _L$2: {
        _L$3: {
          const _bind = _M0FP47wwt17336moonfs3src5binio5u16le(data, pos + 4 | 0);
          if (_bind.$tag === 1) {
            const _ok = _bind;
            rec_len = _ok._0;
          } else {
            const _err = _bind;
            _try_err$2 = _err._0;
            break _L$3;
          }
          break _L$2;
        }
        rec_len = 0n;
      }
      if (BigInt.asIntN(64, rec_len) < BigInt.asIntN(64, 8n) || BigInt.asUintN(64, BigInt.asUintN(64, rec_len & 3n)) !== BigInt.asUintN(64, 0n)) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`directory entry at ${_M0MPC13int3Int18to__string_2einner(pos, 10)} has rec_len ${_M0MPC15int645Int6418to__string_2einner(rec_len, 10)}`));
      }
      if ((pos + (Number(BigInt.asIntN(32, rec_len)) | 0) | 0) > total) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`directory entry at ${_M0MPC13int3Int18to__string_2einner(pos, 10)} runs past its block`));
      }
      let name_len;
      if (has_file_type) {
        let _try_err$3;
        _L$3: {
          _L$4: {
            const _bind = _M0FP47wwt17336moonfs3src5binio2u8(data, pos + 6 | 0);
            if (_bind.$tag === 1) {
              const _ok = _bind;
              name_len = _ok._0;
            } else {
              const _err = _bind;
              _try_err$3 = _err._0;
              break _L$4;
            }
            break _L$3;
          }
          name_len = 0n;
        }
      } else {
        let _try_err$3;
        _L$3: {
          _L$4: {
            const _bind = _M0FP47wwt17336moonfs3src5binio5u16le(data, pos + 6 | 0);
            if (_bind.$tag === 1) {
              const _ok = _bind;
              name_len = _ok._0;
            } else {
              const _err = _bind;
              _try_err$3 = _err._0;
              break _L$4;
            }
            break _L$3;
          }
          name_len = 0n;
        }
      }
      let file_type;
      if (has_file_type) {
        let _tmp;
        let _try_err$3;
        _L$3: {
          _L$4: {
            const _bind = _M0FP47wwt17336moonfs3src5binio2u8(data, pos + 7 | 0);
            if (_bind.$tag === 1) {
              const _ok = _bind;
              _tmp = _ok._0;
            } else {
              const _err = _bind;
              _try_err$3 = _err._0;
              break _L$4;
            }
            break _L$3;
          }
          _tmp = 0n;
        }
        file_type = Number(BigInt.asIntN(32, _tmp)) | 0;
      } else {
        file_type = 0;
      }
      if (BigInt.asUintN(64, inode_no) !== BigInt.asUintN(64, 0n) && (BigInt.asIntN(64, name_len) > BigInt.asIntN(64, 0n) && BigInt.asIntN(64, name_len) <= BigInt.asIntN(64, 255n))) {
        const name_end = (pos + 8 | 0) + (Number(BigInt.asIntN(32, name_len)) | 0) | 0;
        if (name_end <= (pos + (Number(BigInt.asIntN(32, rec_len)) | 0) | 0)) {
          let name_bytes;
          let _try_err$3;
          _L$3: {
            _L$4: {
              const _bind = _M0FP47wwt17336moonfs3src5binio5slice(data, pos + 8 | 0, Number(BigInt.asIntN(32, name_len)) | 0);
              if (_bind.$tag === 1) {
                const _ok = _bind;
                name_bytes = _ok._0;
              } else {
                const _err = _bind;
                _try_err$3 = _err._0;
                break _L$4;
              }
              break _L$3;
            }
            name_bytes = $bytes_literal$0;
          }
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3src4ext48DirEntry(inode_no, _M0FPC28encoding4utf821decode__lossy_2einner(new _M0TPC15bytes9BytesView(name_bytes, 0, name_bytes.length), false), file_type));
        }
      }
      pos = pos + (Number(BigInt.asIntN(32, rec_len)) | 0) | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ext415list__directory(img, sb, inode) {
  if (!_M0MP47wwt17336moonfs3src4ext45Inode13is__directory(inode)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ext48DirEntryERP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`inode ${_M0MPC15int645Int6418to__string_2einner(inode.number, 10)} is not a directory`));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ext417read__inode__data(img, sb, inode);
  let data;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    data = _ok._0;
  } else {
    return _bind;
  }
  return _M0FP47wwt17336moonfs3src4ext419parse__dir__entries(data, sb);
}
function _M0FP47wwt17336moonfs3src4ext413resolve__path(img, sb, path) {
  const _bind = _M0FP47wwt17336moonfs3src4ext411read__inode(img, sb, 2n);
  let current;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    current = _ok._0;
  } else {
    return _bind;
  }
  const segments = new _M0TPB5ArrayGsE([], 0);
  const _it = _M0MPC16string6String5split(path, _M0FP47wwt17336moonfs3src4ext413resolve__pathN6recordS1046);
  while (true) {
    const _bind$2 = _M0MPB4Iter4nextGRPC16string10StringViewE(_it);
    if (_bind$2 === undefined) {
      break;
    } else {
      const _Some = _bind$2;
      const _piece = _Some;
      const seg = _M0MPC16string10StringView9to__owned(_piece);
      let _tmp;
      const _p = "";
      if (!(seg === _p)) {
        const _p$2 = ".";
        _tmp = !(seg === _p$2);
      } else {
        _tmp = false;
      }
      if (_tmp) {
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(segments, seg);
      }
      continue;
    }
  }
  const _bind$2 = segments.len;
  const _bind$3 = segments.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const seg = _bind$3[_];
      if (!_M0MP47wwt17336moonfs3src4ext45Inode13is__directory(current)) {
        return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eCorrupt(`path component ${seg} is not a directory`));
      }
      const _bind$4 = _M0FP47wwt17336moonfs3src4ext415list__directory(img, sb, current);
      let entries;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        entries = _ok._0;
      } else {
        return _bind$4;
      }
      let found = 0n;
      const _bind$5 = entries.len;
      const _bind$6 = entries.buf;
      let _tmp$2 = 0;
      while (true) {
        const _$2 = _tmp$2;
        if (_$2 < _bind$5) {
          const entry = _bind$6[_$2];
          if (entry.name === seg) {
            found = entry.inode;
            break;
          }
          _tmp$2 = _$2 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      if (BigInt.asUintN(64, found) === BigInt.asUintN(64, 0n)) {
        return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE3Err(new _M0DTPC15error5Error52wwt1733_2fmoonfs_2fsrc_2fext4_2eExt4Error_2eNotFound(seg));
      }
      const _bind$7 = _M0FP47wwt17336moonfs3src4ext411read__inode(img, sb, found);
      let _tmp$3;
      if (_bind$7.$tag === 1) {
        const _ok = _bind$7;
        _tmp$3 = _ok._0;
      } else {
        return _bind$7;
      }
      current = _tmp$3;
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(current);
}
function _M0FP47wwt17336moonfs3src4ntfs13collect__unit(img, base_offset, cluster_size, runs, start_vcn, end_vcn) {
  const out = new _M0TPB5ArrayGyE(new Uint8Array([]), 0);
  const _bind = runs.len;
  const _bind$2 = runs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const run = _bind$2[_];
      _L: {
        const run_end = BigInt.asUintN(64, run.vcn + run.clusters);
        if (BigInt.asIntN(64, run_end) <= BigInt.asIntN(64, start_vcn) || BigInt.asIntN(64, run.vcn) >= BigInt.asIntN(64, end_vcn)) {
          break _L;
        }
        if (run.sparse) {
          break _L;
        }
        const from = BigInt.asIntN(64, run.vcn) > BigInt.asIntN(64, start_vcn) ? run.vcn : start_vcn;
        const to = BigInt.asIntN(64, run_end) < BigInt.asIntN(64, end_vcn) ? run_end : end_vcn;
        const count = BigInt.asUintN(64, to - from);
        const lcn = BigInt.asUintN(64, run.lcn + BigInt.asUintN(64, from - run.vcn));
        let bytes;
        let _try_err;
        _L$2: {
          _L$3: {
            const _bind$3 = _M0MP47wwt17336moonfs3src5block5Image4read(img, BigInt.asUintN(64, base_offset + BigInt.asUintN(64, lcn * cluster_size)), Number(BigInt.asIntN(32, BigInt.asUintN(64, count * cluster_size))) | 0);
            if (_bind$3.$tag === 1) {
              const _ok = _bind$3;
              bytes = _ok._0;
            } else {
              const _err = _bind$3;
              _try_err = _err._0;
              break _L$3;
            }
            break _L$2;
          }
          return new _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(`cannot read compressed unit: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
        }
        const _bind$3 = bytes.length;
        let _tmp$2 = 0;
        while (true) {
          const i = _tmp$2;
          if (i < _bind$3) {
            _M0MPC15array5Array4pushGyE(out, i >>> 0 < bytes.length ? bytes[i] : $oob());
            _tmp$2 = i + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs18displacement__bits(pos) {
  let bits = 0;
  let span = 1;
  while (true) {
    if (span < pos) {
      span = Math.imul(span, 2) | 0;
      bits = bits + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return bits < 4 ? 4 : bits;
}
function _M0FP47wwt17336moonfs3src4ntfs17decompress__chunk(src, start, end, out, limit) {
  const chunk_start = out.len;
  let pos = start;
  while (true) {
    if (pos < end && out.len < limit) {
      const _tmp = pos;
      const flags = _tmp >>> 0 < src.length ? src[_tmp] : $oob();
      pos = pos + 1 | 0;
      let bit = 0;
      while (true) {
        if (bit < 8 && (pos < end && out.len < limit)) {
          if ((flags >> bit & 1) === 0) {
            const _tmp$2 = pos;
            _M0MPC15array5Array4pushGyE(out, _tmp$2 >>> 0 < src.length ? src[_tmp$2] : $oob());
            pos = pos + 1 | 0;
          } else {
            if ((pos + 1 | 0) >= end) {
              return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("LZNT1 phrase token is truncated"));
            }
            const _tmp$2 = pos;
            const _tmp$3 = _tmp$2 >>> 0 < src.length ? src[_tmp$2] : $oob();
            const _tmp$4 = pos + 1 | 0;
            const token = _tmp$3 | (_tmp$4 >>> 0 < src.length ? src[_tmp$4] : $oob()) << 8;
            pos = pos + 2 | 0;
            const in_chunk = out.len - chunk_start | 0;
            const split = 16 - _M0FP47wwt17336moonfs3src4ntfs18displacement__bits(in_chunk) | 0;
            const length = (token & ((1 << split) - 1 | 0)) + 3 | 0;
            const distance = (token >> split) + 1 | 0;
            if (distance > in_chunk) {
              return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`LZNT1 phrase points ${_M0MPC13int3Int18to__string_2einner(distance, 10)} byte(s) back, before the chunk start`));
            }
            let copied = 0;
            while (true) {
              if (copied < length && out.len < limit) {
                const from = out.len - distance | 0;
                if (from < 0 || from >= out.len) {
                  $panic();
                }
                _M0MPC15array5Array4pushGyE(out, out.buf[from]);
                copied = copied + 1 | 0;
                continue;
              } else {
                break;
              }
            }
          }
          bit = bit + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(undefined);
}
function _M0FP47wwt17336moonfs3src4ntfs10decompress(src, limit) {
  const out = new _M0TPB5ArrayGyE(new Uint8Array([]), 0);
  const len = src.length;
  let pos = 0;
  while (true) {
    if ((pos + 2 | 0) <= len && out.len < limit) {
      const _tmp = pos;
      const _tmp$2 = _tmp >>> 0 < src.length ? src[_tmp] : $oob();
      const _tmp$3 = pos + 1 | 0;
      const header = _tmp$2 | (_tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob()) << 8;
      const payload_len = (header & 4095) + 1 | 0;
      const is_compressed = (header & 32768) !== 0;
      if (payload_len < 1) {
        return new _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`LZNT1 chunk declares length ${_M0MPC13int3Int18to__string_2einner(payload_len, 10)}`));
      }
      if (((pos + 2 | 0) + payload_len | 0) > len) {
        return new _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`LZNT1 chunk at ${_M0MPC13int3Int18to__string_2einner(pos, 10)} overruns the input buffer`));
      }
      if (is_compressed) {
        const _bind = _M0FP47wwt17336moonfs3src4ntfs17decompress__chunk(src, pos + 2 | 0, (pos + 2 | 0) + payload_len | 0, out, limit);
        if (_bind.$tag === 1) {
          const _ok = _bind;
          _ok._0;
        } else {
          return _bind;
        }
      } else {
        let i = pos + 2 | 0;
        while (true) {
          if (i < ((pos + 2 | 0) + payload_len | 0)) {
            const _tmp$4 = i;
            _M0MPC15array5Array4pushGyE(out, _tmp$4 >>> 0 < src.length ? src[_tmp$4] : $oob());
            i = i + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      }
      pos = (pos + 2 | 0) + payload_len | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGyERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs15describe__error(err) {
  switch (err.$tag) {
    case 14: {
      return "not an NTFS volume (OEM identifier mismatch)";
    }
    case 13: {
      const _BadGeometry = err;
      const _reason = _BadGeometry._0;
      return `bad geometry: ${_reason}`;
    }
    case 12: {
      const _Corrupt = err;
      const _reason$2 = _Corrupt._0;
      return `corrupt: ${_reason$2}`;
    }
    case 11: {
      const _Io = err;
      const _reason$3 = _Io._0;
      return `io: ${_reason$3}`;
    }
    case 10: {
      const _NotFound = err;
      const _name = _NotFound._0;
      return `not found: ${_name}`;
    }
    case 9: {
      const _Reparse = err;
      const _kind = _Reparse._0;
      const _target = _Reparse._1;
      return `reparse point (${_kind}): ${_target} -- not followed`;
    }
    default: {
      const _Encrypted = err;
      const _path = _Encrypted._0;
      return `encrypted: ${_path}`;
    }
  }
}
function _M0FP47wwt17336moonfs3src4ntfs16read__compressed(img, vol, attr, runs) {
  const unit_clusters = attr.compression_unit <= 0 ? 1n : BigInt.asUintN(64, 1n << BigInt(attr.compression_unit & 63));
  const cluster = BigInt.asUintN(64, BigInt(vol.cluster_size));
  const unit_bytes = BigInt.asUintN(64, unit_clusters * cluster);
  const total = attr.data_size;
  if (BigInt.asIntN(64, total) <= BigInt.asIntN(64, 0n)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok($bytes_literal$0);
  }
  const out = new _M0TPB5ArrayGyE(new Uint8Array([]), 0);
  let unit = 0n;
  while (true) {
    if (BigInt.asIntN(64, BigInt.asUintN(64, unit * unit_bytes)) < BigInt.asIntN(64, total)) {
      const start_vcn = BigInt.asUintN(64, unit * unit_clusters);
      const end_vcn = BigInt.asUintN(64, start_vcn + unit_clusters);
      const _bind = _M0FP47wwt17336moonfs3src4ntfs13collect__unit(img, vol.base_offset, cluster, runs, start_vcn, end_vcn);
      let collected;
      if (_bind.$tag === 1) {
        const _ok = _bind;
        collected = _ok._0;
      } else {
        return _bind;
      }
      const remain = BigInt.asUintN(64, total - BigInt.asUintN(64, unit * unit_bytes));
      const want = BigInt.asIntN(64, remain) > BigInt.asIntN(64, unit_bytes) ? unit_bytes : remain;
      const want_len = Number(BigInt.asIntN(32, want)) | 0;
      if (collected.len === 0) {
        let i = 0;
        while (true) {
          if (i < want_len) {
            _M0MPC15array5Array4pushGyE(out, 0);
            i = i + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      } else {
        if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt(collected.len))) === BigInt.asUintN(64, unit_bytes)) {
          let i = 0;
          while (true) {
            if (i < want_len && i < collected.len) {
              const _bind$2 = i;
              if (_bind$2 < 0 || _bind$2 >= collected.len) {
                $panic();
              }
              _M0MPC15array5Array4pushGyE(out, collected.buf[_bind$2]);
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
        } else {
          let raw;
          let _try_err;
          _L: {
            _L$2: {
              const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs10decompress(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(collected.buf, 0, collected.len)), Number(BigInt.asIntN(32, unit_bytes)) | 0);
              if (_bind$2.$tag === 1) {
                const _ok = _bind$2;
                raw = _ok._0;
              } else {
                const _err = _bind$2;
                _try_err = _err._0;
                break _L$2;
              }
              break _L;
            }
            return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`cannot decompress the unit at VCN ${_M0MPC15int645Int6418to__string_2einner(start_vcn, 10)}: ${_M0FP47wwt17336moonfs3src4ntfs15describe__error(_try_err)}`));
          }
          let i = 0;
          while (true) {
            if (i < want_len && i < raw.len) {
              const _bind$2 = i;
              if (_bind$2 < 0 || _bind$2 >= raw.len) {
                $panic();
              }
              _M0MPC15array5Array4pushGyE(out, raw.buf[_bind$2]);
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          while (true) {
            if (i < want_len) {
              _M0MPC15array5Array4pushGyE(out, 0);
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
        }
      }
      unit = BigInt.asUintN(64, unit + 1n);
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out.buf, 0, out.len)));
}
function _M0FP47wwt17336moonfs3src4ntfs15lookup__cluster(runs, vcn) {
  const _bind = runs.len;
  const _bind$2 = runs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const run = _bind$2[_];
      if (BigInt.asIntN(64, vcn) >= BigInt.asIntN(64, run.vcn) && BigInt.asIntN(64, vcn) < BigInt.asIntN(64, BigInt.asUintN(64, run.vcn + run.clusters))) {
        if (run.sparse) {
          return new _M0DTPC16option6OptionGOlE4Some(undefined);
        }
        return new _M0DTPC16option6OptionGOlE4Some(BigInt.asUintN(64, run.lcn + BigInt.asUintN(64, vcn - run.vcn)));
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0DTPC16option6OptionGOlE4None__;
}
function _M0FP47wwt17336moonfs3src4ntfs16read__from__runs(img, base_offset, cluster_size, runs, byte_offset, len) {
  const out = new _M0TPB5ArrayGyE(new Uint8Array([]), 0);
  const cluster = BigInt.asUintN(64, BigInt(cluster_size));
  let pos = byte_offset;
  let remaining = len;
  while (true) {
    if (BigInt.asIntN(64, remaining) > BigInt.asIntN(64, 0n)) {
      if (cluster === 0n) {
        $panic();
      }
      const vcn = BigInt.asUintN(64, BigInt.asIntN(64, pos) / BigInt.asIntN(64, cluster));
      if (cluster === 0n) {
        $panic();
      }
      const in_cluster = BigInt.asUintN(64, BigInt.asIntN(64, pos) % BigInt.asIntN(64, cluster));
      let chunk = BigInt.asUintN(64, cluster - in_cluster);
      if (BigInt.asIntN(64, chunk) > BigInt.asIntN(64, remaining)) {
        chunk = remaining;
      }
      const _bind = _M0FP47wwt17336moonfs3src4ntfs15lookup__cluster(runs, vcn);
      if (_bind.$tag === 1) {
        const _Some = _bind;
        const _x = _Some._0;
        if (_x === undefined) {
          const _bind$2 = Number(BigInt.asIntN(32, chunk)) | 0;
          let _tmp = 0;
          while (true) {
            const _ = _tmp;
            if (_ < _bind$2) {
              _M0MPC15array5Array4pushGyE(out, 0);
              _tmp = _ + 1 | 0;
              continue;
            } else {
              break;
            }
          }
        } else {
          const _Some$2 = _x;
          const _lcn = _Some$2;
          const at = BigInt.asUintN(64, BigInt.asUintN(64, base_offset + BigInt.asUintN(64, _lcn * cluster)) + in_cluster);
          let bytes;
          let _try_err;
          _L: {
            _L$2: {
              const _bind$2 = _M0MP47wwt17336moonfs3src5block5Image4read(img, at, Number(BigInt.asIntN(32, chunk)) | 0);
              if (_bind$2.$tag === 1) {
                const _ok = _bind$2;
                bytes = _ok._0;
              } else {
                const _err = _bind$2;
                _try_err = _err._0;
                break _L$2;
              }
              break _L;
            }
            return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(`cannot read cluster data: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
          }
          const _bind$2 = bytes.length;
          let _tmp = 0;
          while (true) {
            const i = _tmp;
            if (i < _bind$2) {
              _M0MPC15array5Array4pushGyE(out, i >>> 0 < bytes.length ? bytes[i] : $oob());
              _tmp = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
        }
      } else {
        return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`runlist does not cover byte offset ${_M0MPC15int645Int6418to__string_2einner(pos, 10)}`));
      }
      pos = BigInt.asUintN(64, pos + chunk);
      remaining = BigInt.asUintN(64, remaining - chunk);
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out.buf, 0, out.len)));
}
function _M0FP47wwt17336moonfs3src4ntfs21read__attribute__data(img, vol, attr, path) {
  if (BigInt.asUintN(64, BigInt.asUintN(64, attr.flags & 16384n)) !== BigInt.asUintN(64, 0n)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error53wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eEncrypted(path));
  }
  if (!attr.non_resident) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(attr.value);
  }
  if (BigInt.asIntN(64, attr.data_size) <= BigInt.asIntN(64, 0n)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok($bytes_literal$0);
  }
  const runs = attr.runs;
  return BigInt.asUintN(64, BigInt.asUintN(64, attr.flags & 1n)) !== BigInt.asUintN(64, 0n) ? _M0FP47wwt17336moonfs3src4ntfs16read__compressed(img, vol, attr, runs) : _M0FP47wwt17336moonfs3src4ntfs16read__from__runs(img, vol.base_offset, vol.cluster_size, runs, 0n, attr.data_size);
}
function _M0FP47wwt17336moonfs3src4ntfs7rd__u16(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u16le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(record, sector_size, label) {
  const len = record.length;
  if (len < 48) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label}: record too short (${_M0MPC13int3Int18to__string_2einner(len, 10)} bytes)`));
  }
  if (sector_size <= 0 || (len % sector_size | 0) !== 0) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label}: size ${_M0MPC13int3Int18to__string_2einner(len, 10)} is not a multiple of sector size ${_M0MPC13int3Int18to__string_2einner(sector_size, 10)}`));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 4);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  const usa_offset = Number(BigInt.asIntN(32, _tmp)) | 0;
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 6);
  let _tmp$2;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp$2 = _ok._0;
  } else {
    return _bind$2;
  }
  const usa_count = Number(BigInt.asIntN(32, _tmp$2)) | 0;
  const sectors = len / sector_size | 0;
  if (usa_count !== (sectors + 1 | 0)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label}: update sequence count ${_M0MPC13int3Int18to__string_2einner(usa_count, 10)} does not match ${_M0MPC13int3Int18to__string_2einner(sectors, 10)} sector(s)`));
  }
  if (usa_offset < 0 || (usa_offset + (Math.imul(usa_count, 2) | 0) | 0) > len) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label}: update sequence array at ${_M0MPC13int3Int18to__string_2einner(usa_offset, 10)} is out of range`));
  }
  const out = $makebytes(len, 0);
  let _tmp$3 = 0;
  while (true) {
    const i = _tmp$3;
    if (i < len) {
      if (i >>> 0 < out.length) {
        out[i] = i >>> 0 < record.length ? record[i] : $oob();
      } else {
        $oob();
      }
      _tmp$3 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const usn_lo = usa_offset >>> 0 < out.length ? out[usa_offset] : $oob();
  const _tmp$4 = usa_offset + 1 | 0;
  const usn_hi = _tmp$4 >>> 0 < out.length ? out[_tmp$4] : $oob();
  let _tmp$5 = 1;
  while (true) {
    const i = _tmp$5;
    if (i < usa_count) {
      const tail = (Math.imul(i, sector_size) | 0) - 2 | 0;
      let _tmp$6;
      if ((tail >>> 0 < out.length ? out[tail] : $oob()) !== usn_lo) {
        _tmp$6 = true;
      } else {
        const _tmp$7 = tail + 1 | 0;
        _tmp$6 = (_tmp$7 >>> 0 < out.length ? out[_tmp$7] : $oob()) !== usn_hi;
      }
      if (_tmp$6) {
        return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label}: update sequence mismatch at end of sector ${_M0MPC13int3Int18to__string_2einner(i, 10)} (torn write)`));
      }
      const _tmp$7 = usa_offset + (Math.imul(i, 2) | 0) | 0;
      if (tail >>> 0 < out.length) {
        out[tail] = _tmp$7 >>> 0 < out.length ? out[_tmp$7] : $oob();
      } else {
        $oob();
      }
      const _tmp$8 = tail + 1 | 0;
      const _tmp$9 = (usa_offset + (Math.imul(i, 2) | 0) | 0) + 1 | 0;
      if (_tmp$8 >>> 0 < out.length) {
        out[_tmp$8] = _tmp$9 >>> 0 < out.length ? out[_tmp$9] : $oob();
      } else {
        $oob();
      }
      _tmp$5 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out, 0, out.length)));
}
function _M0FP47wwt17336moonfs3src4ntfs22find__named__attribute(attrs, type_code, name) {
  const _bind = attrs.len;
  const _bind$2 = attrs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const attr = _bind$2[_];
      if (BigInt.asUintN(64, attr.type_code) === BigInt.asUintN(64, type_code) && attr.name === name) {
        return attr;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return undefined;
}
function _M0FP47wwt17336moonfs3src4ntfs15find__attribute(attrs, type_code) {
  const _bind = attrs.len;
  const _bind$2 = attrs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const attr = _bind$2[_];
      if (BigInt.asUintN(64, attr.type_code) === BigInt.asUintN(64, type_code)) {
        return attr;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return undefined;
}
function _M0FP47wwt17336moonfs3src4ntfs16combine__extents(extents) {
  const ordered = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE([], 0);
  const _bind = extents.len;
  const _bind$2 = extents.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = _bind$2[_];
      let at = ordered.len;
      while (true) {
        let _tmp$2;
        if (at > 0) {
          const _bind$3 = at - 1 | 0;
          if (_bind$3 < 0 || _bind$3 >= ordered.len) {
            $panic();
          }
          _tmp$2 = BigInt.asIntN(64, ordered.buf[_bind$3].lowest_vcn) > BigInt.asIntN(64, e.lowest_vcn);
        } else {
          _tmp$2 = false;
        }
        if (_tmp$2) {
          at = at - 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0MPC15array5Array6insertGRP47wwt17336moonfs3src4ntfs9AttributeE(ordered, at, e);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (0 >= ordered.len) {
    $panic();
  }
  const proto = ordered.buf[0];
  const runs = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunE([], 0);
  let data_size = 0n;
  let initialized = 0n;
  let allocated = 0n;
  let highest = 0n;
  const _bind$3 = ordered.len;
  const _bind$4 = ordered.buf;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$3) {
      const e = _bind$4[_];
      const _bind$5 = e.runs;
      const _bind$6 = _bind$5.len;
      const _bind$7 = _bind$5.buf;
      let _tmp$3 = 0;
      while (true) {
        const _$2 = _tmp$3;
        if (_$2 < _bind$6) {
          const run = _bind$7[_$2];
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(runs, run);
          _tmp$3 = _$2 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      if (BigInt.asIntN(64, e.data_size) > BigInt.asIntN(64, data_size)) {
        data_size = e.data_size;
      }
      if (BigInt.asIntN(64, e.initialized_size) > BigInt.asIntN(64, initialized)) {
        initialized = e.initialized_size;
      }
      allocated = BigInt.asUintN(64, allocated + e.allocated_size);
      if (BigInt.asIntN(64, e.highest_vcn) > BigInt.asIntN(64, highest)) {
        highest = e.highest_vcn;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0TP47wwt17336moonfs3src4ntfs9Attribute(proto.type_code, proto.total_length, proto.non_resident, proto.name, proto.flags, proto.id, proto.value, 0n, highest, proto.runlist_offset, proto.compression_unit, allocated, data_size, initialized, runs);
}
function _M0FP47wwt17336moonfs3src4ntfs14merge__extents(attrs) {
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE([], 0);
  let i = 0;
  while (true) {
    if (i < attrs.len) {
      const _bind = i;
      if (_bind < 0 || _bind >= attrs.len) {
        $panic();
      }
      const a = attrs.buf[_bind];
      if (a.non_resident && BigInt.asIntN(64, a.lowest_vcn) > BigInt.asIntN(64, 0n)) {
        i = i + 1 | 0;
        continue;
      }
      if (a.non_resident) {
        const extents = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE([a], 1);
        let j = i + 1 | 0;
        while (true) {
          if (j < attrs.len) {
            const _bind$2 = j;
            if (_bind$2 < 0 || _bind$2 >= attrs.len) {
              $panic();
            }
            const b = attrs.buf[_bind$2];
            if (b.non_resident && (BigInt.asUintN(64, b.type_code) === BigInt.asUintN(64, a.type_code) && b.name === a.name)) {
              _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(extents, b);
            }
            j = j + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        if (extents.len > 1) {
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, _M0FP47wwt17336moonfs3src4ntfs16combine__extents(extents));
        } else {
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, a);
        }
      } else {
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, a);
      }
      i = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return out;
}
function _M0FP47wwt17336moonfs3src4ntfs7rd__i64(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5i64le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ntfs7rd__u32(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u32le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ntfs6rd__u8(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio2u8(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src4ntfs19utf16le__to__string(raw, off, len) {
  const chars = new _M0TPB5ArrayGcE([], 0);
  let i = 0;
  while (true) {
    if ((i + 1 | 0) < len) {
      const _tmp = off + i | 0;
      const _tmp$2 = _tmp >>> 0 < raw.length ? raw[_tmp] : $oob();
      const _tmp$3 = (off + i | 0) + 1 | 0;
      const unit = _tmp$2 | (_tmp$3 >>> 0 < raw.length ? raw[_tmp$3] : $oob()) << 8;
      if (unit === 0) {
        break;
      }
      if (unit >= 55296 && (unit <= 56319 && (i + 3 | 0) < len)) {
        const _tmp$4 = (off + i | 0) + 2 | 0;
        const _tmp$5 = _tmp$4 >>> 0 < raw.length ? raw[_tmp$4] : $oob();
        const _tmp$6 = (off + i | 0) + 3 | 0;
        const low = _tmp$5 | (_tmp$6 >>> 0 < raw.length ? raw[_tmp$6] : $oob()) << 8;
        if (low >= 56320 && low <= 57343) {
          const code = (65536 + (unit - 55296 << 10) | 0) + (low - 56320 | 0) | 0;
          const _bind = _M0MPC13int3Int8to__char(code);
          if (_bind === -1) {
          } else {
            const _Some = _bind;
            const _c = _Some;
            _M0MPC15array5Array4pushGcE(chars, _c);
          }
          i = i + 4 | 0;
          continue;
        }
      }
      const _bind = _M0MPC13int3Int8to__char(unit);
      if (_bind === -1) {
      } else {
        const _Some = _bind;
        const _c = _Some;
        _M0MPC15array5Array4pushGcE(chars, _c);
      }
      i = i + 2 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0MPC16string6String11from__array(new _M0TPB9ArrayViewGcE(chars.buf, 0, chars.len));
}
function _M0FP47wwt17336moonfs3src4ntfs22parse__attribute__list(value) {
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryE([], 0);
  const size = value.length;
  let pos = 0;
  while (true) {
    if ((pos + 26 | 0) <= size) {
      const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(value, pos);
      let type_code;
      if (_bind.$tag === 1) {
        const _ok = _bind;
        type_code = _ok._0;
      } else {
        return _bind;
      }
      const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, pos + 4 | 0);
      let _tmp;
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        _tmp = _ok._0;
      } else {
        return _bind$2;
      }
      const entry_len = Number(BigInt.asIntN(32, _tmp)) | 0;
      const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(value, pos + 6 | 0);
      let _tmp$2;
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        _tmp$2 = _ok._0;
      } else {
        return _bind$3;
      }
      const name_length = Number(BigInt.asIntN(32, _tmp$2)) | 0;
      const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(value, pos + 7 | 0);
      let _tmp$3;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        _tmp$3 = _ok._0;
      } else {
        return _bind$4;
      }
      const name_offset = Number(BigInt.asIntN(32, _tmp$3)) | 0;
      if (entry_len < 26 || (pos + entry_len | 0) > size) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`$ATTRIBUTE_LIST entry length ${_M0MPC13int3Int18to__string_2einner(entry_len, 10)} does not fit the list`));
      }
      const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, pos + 8 | 0);
      let lowest_vcn;
      if (_bind$5.$tag === 1) {
        const _ok = _bind$5;
        lowest_vcn = _ok._0;
      } else {
        return _bind$5;
      }
      const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, pos + 16 | 0);
      let _tmp$4;
      if (_bind$6.$tag === 1) {
        const _ok = _bind$6;
        _tmp$4 = _ok._0;
      } else {
        return _bind$6;
      }
      const record = BigInt.asUintN(64, _tmp$4 & 281474976710655n);
      const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, pos + 24 | 0);
      let id;
      if (_bind$7.$tag === 1) {
        const _ok = _bind$7;
        id = _ok._0;
      } else {
        return _bind$7;
      }
      const name = name_length === 0 ? "" : ((pos + name_offset | 0) + (Math.imul(name_length, 2) | 0) | 0) <= size ? _M0FP47wwt17336moonfs3src4ntfs19utf16le__to__string(value, pos + name_offset | 0, Math.imul(name_length, 2) | 0) : "";
      _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3src4ntfs13AttrListEntry(type_code, name, lowest_vcn, record, id));
      pos = pos + entry_len | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs16read__signed__le(data, pos, n) {
  let value = 0n;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < n) {
      const _tmp$2 = value;
      const _tmp$3 = pos + i | 0;
      const _p = _tmp$3 >>> 0 < data.length ? data[_tmp$3] : $oob();
      value = BigInt.asUintN(64, _tmp$2 | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p)) << BigInt(Math.imul(8, i) & 63)));
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  if (n < 8) {
    const _tmp$2 = (pos + n | 0) - 1 | 0;
    const high = _tmp$2 >>> 0 < data.length ? data[_tmp$2] : $oob();
    if (high >= 128) {
      value = BigInt.asUintN(64, value - BigInt.asUintN(64, 1n << BigInt(Math.imul(8, n) & 63)));
    }
  }
  return value;
}
function _M0FP47wwt17336moonfs3src4ntfs18read__unsigned__le(data, pos, n) {
  let value = 0n;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < n) {
      const _tmp$2 = value;
      const _tmp$3 = pos + i | 0;
      const _p = _tmp$3 >>> 0 < data.length ? data[_tmp$3] : $oob();
      value = BigInt.asUintN(64, _tmp$2 | BigInt.asUintN(64, BigInt.asUintN(64, BigInt(_p)) << BigInt(Math.imul(8, i) & 63)));
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return value;
}
function _M0FP47wwt17336moonfs3src4ntfs14parse__runlist(data, offset, lowest_vcn) {
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunE([], 0);
  const end = data.length;
  let pos = offset;
  let vcn = lowest_vcn;
  let lcn = 0n;
  while (true) {
    if (pos < end) {
      const _tmp = pos;
      const header = _tmp >>> 0 < data.length ? data[_tmp] : $oob();
      if (header === 0) {
        break;
      }
      const len_bytes = header & 15;
      const off_bytes = header >> 4 & 15;
      if (len_bytes === 0 || (len_bytes > 8 || off_bytes > 8)) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`runlist entry at ${_M0MPC13int3Int18to__string_2einner(pos, 10)} has an invalid header`));
      }
      const entry_end = ((pos + 1 | 0) + len_bytes | 0) + off_bytes | 0;
      if (entry_end > end) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`runlist entry at ${_M0MPC13int3Int18to__string_2einner(pos, 10)} is truncated`));
      }
      const clusters = _M0FP47wwt17336moonfs3src4ntfs18read__unsigned__le(data, pos + 1 | 0, len_bytes);
      if (BigInt.asIntN(64, clusters) <= BigInt.asIntN(64, 0n)) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("runlist entry declares zero clusters"));
      }
      if (off_bytes === 0) {
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3src4ntfs3Run(vcn, 18446744073709551615n, clusters, true));
      } else {
        const delta = _M0FP47wwt17336moonfs3src4ntfs16read__signed__le(data, (pos + 1 | 0) + len_bytes | 0, off_bytes);
        lcn = BigInt.asUintN(64, lcn + delta);
        if (BigInt.asIntN(64, lcn) < BigInt.asIntN(64, 0n)) {
          return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("runlist resolves to a negative cluster number"));
        }
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3src4ntfs3Run(vcn, lcn, clusters, false));
      }
      vcn = BigInt.asUintN(64, vcn + clusters);
      pos = entry_end;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs16parse__attribute(record, off, type_code, total_length) {
  const _bind = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(record, off + 8 | 0);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  const non_resident = BigInt.asUintN(64, _tmp) !== BigInt.asUintN(64, 0n);
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(record, off + 9 | 0);
  let _tmp$2;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp$2 = _ok._0;
  } else {
    return _bind$2;
  }
  const name_length = Number(BigInt.asIntN(32, _tmp$2)) | 0;
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 10 | 0);
  let _tmp$3;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp$3 = _ok._0;
  } else {
    return _bind$3;
  }
  const name_offset = Number(BigInt.asIntN(32, _tmp$3)) | 0;
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 12 | 0);
  let flags;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    flags = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 14 | 0);
  let id;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    id = _ok._0;
  } else {
    return _bind$5;
  }
  let name;
  if (name_length === 0) {
    name = "";
  } else {
    const start = off + name_offset | 0;
    if ((start + (Math.imul(name_length, 2) | 0) | 0) > (off + total_length | 0)) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("attribute name runs past the attribute end"));
    }
    name = _M0FP47wwt17336moonfs3src4ntfs19utf16le__to__string(record, start, Math.imul(name_length, 2) | 0);
  }
  let _tmp$4;
  if (non_resident) {
    const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, off + 16 | 0);
    let lowest_vcn;
    if (_bind$6.$tag === 1) {
      const _ok = _bind$6;
      lowest_vcn = _ok._0;
    } else {
      return _bind$6;
    }
    const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, off + 24 | 0);
    let highest_vcn;
    if (_bind$7.$tag === 1) {
      const _ok = _bind$7;
      highest_vcn = _ok._0;
    } else {
      return _bind$7;
    }
    const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 32 | 0);
    let runlist_offset;
    if (_bind$8.$tag === 1) {
      const _ok = _bind$8;
      runlist_offset = _ok._0;
    } else {
      return _bind$8;
    }
    const _bind$9 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 34 | 0);
    let compression_unit;
    if (_bind$9.$tag === 1) {
      const _ok = _bind$9;
      compression_unit = _ok._0;
    } else {
      return _bind$9;
    }
    const _bind$10 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, off + 40 | 0);
    let allocated_size;
    if (_bind$10.$tag === 1) {
      const _ok = _bind$10;
      allocated_size = _ok._0;
    } else {
      return _bind$10;
    }
    const _bind$11 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, off + 48 | 0);
    let data_size;
    if (_bind$11.$tag === 1) {
      const _ok = _bind$11;
      data_size = _ok._0;
    } else {
      return _bind$11;
    }
    const _bind$12 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, off + 56 | 0);
    let initialized_size;
    if (_bind$12.$tag === 1) {
      const _ok = _bind$12;
      initialized_size = _ok._0;
    } else {
      return _bind$12;
    }
    if (BigInt.asIntN(64, lowest_vcn) < BigInt.asIntN(64, 0n) || BigInt.asIntN(64, highest_vcn) < BigInt.asIntN(64, lowest_vcn)) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`attribute VCN range ${_M0MPC15int645Int6418to__string_2einner(lowest_vcn, 10)}..${_M0MPC15int645Int6418to__string_2einner(highest_vcn, 10)}`));
    }
    const _bind$13 = _M0FP47wwt17336moonfs3src4ntfs14parse__runlist(record, off + (Number(BigInt.asIntN(32, runlist_offset)) | 0) | 0, lowest_vcn);
    let runs;
    if (_bind$13.$tag === 1) {
      const _ok = _bind$13;
      runs = _ok._0;
    } else {
      return _bind$13;
    }
    _tmp$4 = new _M0TP47wwt17336moonfs3src4ntfs9Attribute(type_code, total_length, non_resident, name, flags, id, $bytes_literal$0, lowest_vcn, highest_vcn, off + (Number(BigInt.asIntN(32, runlist_offset)) | 0) | 0, Number(BigInt.asIntN(32, compression_unit)) | 0, allocated_size, data_size, initialized_size, runs);
  } else {
    const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(record, off + 16 | 0);
    let value_length;
    if (_bind$6.$tag === 1) {
      const _ok = _bind$6;
      value_length = _ok._0;
    } else {
      return _bind$6;
    }
    const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, off + 20 | 0);
    let value_offset;
    if (_bind$7.$tag === 1) {
      const _ok = _bind$7;
      value_offset = _ok._0;
    } else {
      return _bind$7;
    }
    if (BigInt.asIntN(64, value_offset) < BigInt.asIntN(64, 0n) || BigInt.asIntN(64, BigInt.asUintN(64, value_offset + value_length)) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt(total_length)))) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("resident value runs past the attribute end"));
    }
    let value;
    if (BigInt.asUintN(64, value_length) === BigInt.asUintN(64, 0n)) {
      value = $bytes_literal$0;
    } else {
      let _try_err;
      _L: {
        _L$2: {
          const _bind$8 = _M0FP47wwt17336moonfs3src5binio5slice(record, off + (Number(BigInt.asIntN(32, value_offset)) | 0) | 0, Number(BigInt.asIntN(32, value_length)) | 0);
          if (_bind$8.$tag === 1) {
            const _ok = _bind$8;
            value = _ok._0;
          } else {
            const _err = _bind$8;
            _try_err = _err._0;
            break _L$2;
          }
          break _L;
        }
        return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("cannot read resident value"));
      }
    }
    _tmp$4 = new _M0TP47wwt17336moonfs3src4ntfs9Attribute(type_code, total_length, non_resident, name, flags, id, value, 0n, 0n, 0, 0, value_length, value_length, value_length, new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs3RunE([], 0));
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs9AttributeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_tmp$4);
}
function _M0FP47wwt17336moonfs3src4ntfs17parse__attributes(record, limit) {
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE([], 0);
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 20);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  let off = Number(BigInt.asIntN(32, _tmp)) | 0;
  const record_end = record.length;
  let end = Number(BigInt.asIntN(32, limit)) | 0;
  if (end <= 0 || end > record_end) {
    end = record_end;
  }
  while (true) {
    if ((off + 8 | 0) <= end) {
      const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(record, off);
      let type_code;
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        type_code = _ok._0;
      } else {
        return _bind$2;
      }
      if (BigInt.asUintN(64, type_code) === BigInt.asUintN(64, 4294967295n) || BigInt.asUintN(64, type_code) === BigInt.asUintN(64, 0n)) {
        break;
      }
      const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(record, off + 4 | 0);
      let length;
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        length = _ok._0;
      } else {
        return _bind$3;
      }
      if (BigInt.asIntN(64, length) < BigInt.asIntN(64, 24n)) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`attribute at ${_M0MPC13int3Int18to__string_2einner(off, 10)} declares length ${_M0MPC15int645Int6418to__string_2einner(length, 10)}`));
      }
      if (BigInt.asIntN(64, BigInt.asUintN(64, BigInt.asUintN(64, BigInt(off)) + length)) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt(end)))) {
        return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`attribute at ${_M0MPC13int3Int18to__string_2einner(off, 10)} overruns the record's used size`));
      }
      const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs16parse__attribute(record, off, type_code, Number(BigInt.asIntN(32, length)) | 0);
      let _tmp$2;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        _tmp$2 = _ok._0;
      } else {
        return _bind$4;
      }
      _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, _tmp$2);
      off = off + (Number(BigInt.asIntN(32, length)) | 0) | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs13parse__record(record) {
  if (!_M0FP47wwt17336moonfs3src5binio12starts__with(record, 0, $bytes_literal$1)) {
    if (_M0FP47wwt17336moonfs3src5binio12starts__with(record, 0, $bytes_literal$2)) {
      return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("record is marked bad (BAAD signature)"));
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("not an MFT record (signature mismatch)"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 20);
  let first_attr;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    first_attr = _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asIntN(64, first_attr) < BigInt.asIntN(64, 24n) || BigInt.asIntN(64, first_attr) > BigInt.asIntN(64, BigInt.asUintN(64, BigInt(record.length)))) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`first attribute offset ${_M0MPC15int645Int6418to__string_2einner(first_attr, 10)} is invalid`));
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 16);
  let _tmp;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp = _ok._0;
  } else {
    return _bind$2;
  }
  const _tmp$2 = _tmp;
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 18);
  let _tmp$3;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp$3 = _ok._0;
  } else {
    return _bind$3;
  }
  const _tmp$4 = _tmp$3;
  const _tmp$5 = Number(BigInt.asIntN(32, first_attr)) | 0;
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 22);
  let _tmp$6;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    _tmp$6 = _ok._0;
  } else {
    return _bind$4;
  }
  const _tmp$7 = _tmp$6;
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(record, 24);
  let _tmp$8;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    _tmp$8 = _ok._0;
  } else {
    return _bind$5;
  }
  const _tmp$9 = _tmp$8;
  const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(record, 32);
  let _tmp$10;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    _tmp$10 = _ok._0;
  } else {
    return _bind$6;
  }
  const _tmp$11 = _tmp$10;
  const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(record, 40);
  let _tmp$12;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    _tmp$12 = _ok._0;
  } else {
    return _bind$7;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12RecordHeaderRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs12RecordHeader(_tmp$2, _tmp$4, _tmp$5, _tmp$7, _tmp$9, _tmp$11, _tmp$12));
}
function _M0MP47wwt17336moonfs3src4ntfs3Mft12read__record(self, img, number) {
  if (BigInt.asIntN(64, number) < BigInt.asIntN(64, 0n)) {
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("negative MFT record number"));
  }
  const offset = BigInt.asUintN(64, number * BigInt.asUintN(64, BigInt(self.record_size)));
  return _M0FP47wwt17336moonfs3src4ntfs16read__from__runs(img, self.base_offset, self.cluster_size, self.runs, offset, BigInt.asUintN(64, BigInt(self.record_size)));
}
function _M0FP47wwt17336moonfs3src4ntfs16load__attributes(img, vol, mft, number) {
  const label = `MFT record ${_M0MPC15int645Int6418to__string_2einner(number, 10)}`;
  const _bind = _M0MP47wwt17336moonfs3src4ntfs3Mft12read__record(mft, img, number);
  let raw;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    raw = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(raw, vol.bytes_per_sector, label);
  let fixed;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    fixed = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs13parse__record(fixed);
  let header;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    header = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs17parse__attributes(fixed, header.used_size);
  let base;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    base = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs15find__attribute(base, 32n);
  let list;
  if (_bind$5 === undefined) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(base);
  } else {
    const _Some = _bind$5;
    list = _Some;
  }
  let list_value;
  if (list.non_resident) {
    const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs21read__attribute__data(img, vol, list, `${label} $ATTRIBUTE_LIST`);
    if (_bind$6.$tag === 1) {
      const _ok = _bind$6;
      list_value = _ok._0;
    } else {
      return _bind$6;
    }
  } else {
    list_value = list.value;
  }
  const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs22parse__attribute__list(list_value);
  let entries;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    entries = _ok._0;
  } else {
    return _bind$6;
  }
  const collected = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeE([], 0);
  const _bind$7 = base.len;
  const _bind$8 = base.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$7) {
      const attr = _bind$8[_];
      _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(collected, attr);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$9 = entries.len;
  const _bind$10 = entries.buf;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$9) {
      const entry = _bind$10[_];
      _L: {
        if (BigInt.asUintN(64, entry.record) === BigInt.asUintN(64, number)) {
          break _L;
        }
        let ext_raw;
        let _try_err;
        _L$2: {
          _L$3: {
            const _bind$11 = _M0MP47wwt17336moonfs3src4ntfs3Mft12read__record(mft, img, entry.record);
            if (_bind$11.$tag === 1) {
              const _ok = _bind$11;
              ext_raw = _ok._0;
            } else {
              const _err = _bind$11;
              _try_err = _err._0;
              break _L$3;
            }
            break _L$2;
          }
          return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(`cannot read extension record ${_M0MPC15int645Int6418to__string_2einner(entry.record, 10)} for ${label}: ${_M0FP47wwt17336moonfs3src4ntfs15describe__error(_try_err)}`));
        }
        const ext_label = `MFT record ${_M0MPC15int645Int6418to__string_2einner(entry.record, 10)}`;
        const _bind$11 = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(ext_raw, vol.bytes_per_sector, ext_label);
        let ext_fixed;
        if (_bind$11.$tag === 1) {
          const _ok = _bind$11;
          ext_fixed = _ok._0;
        } else {
          return _bind$11;
        }
        const _bind$12 = _M0FP47wwt17336moonfs3src4ntfs13parse__record(ext_fixed);
        let ext_header;
        if (_bind$12.$tag === 1) {
          const _ok = _bind$12;
          ext_header = _ok._0;
        } else {
          return _bind$12;
        }
        const _bind$13 = _M0FP47wwt17336moonfs3src4ntfs17parse__attributes(ext_fixed, ext_header.used_size);
        let ext_attrs;
        if (_bind$13.$tag === 1) {
          const _ok = _bind$13;
          ext_attrs = _ok._0;
        } else {
          return _bind$13;
        }
        const _bind$14 = ext_attrs.len;
        const _bind$15 = ext_attrs.buf;
        let _tmp$3 = 0;
        while (true) {
          const _$2 = _tmp$3;
          if (_$2 < _bind$14) {
            const attr = _bind$15[_$2];
            if (BigInt.asUintN(64, attr.type_code) === BigInt.asUintN(64, entry.type_code) && (BigInt.asUintN(64, attr.id) === BigInt.asUintN(64, entry.id) && attr.name === entry.name)) {
              _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(collected, attr);
            }
            _tmp$3 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break _L;
      }
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs9AttributeERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(_M0FP47wwt17336moonfs3src4ntfs14merge__extents(collected));
}
function _M0FP47wwt17336moonfs3src4ntfs21parse__reparse__pointN5sliceS1433(_env, off, len) {
  const base = _env._1;
  const value = _env._0;
  return len === 0 || ((base + off | 0) + len | 0) > value.length ? "" : _M0FP47wwt17336moonfs3src4ntfs19utf16le__to__string(value, base + off | 0, len);
}
function _M0FP47wwt17336moonfs3src4ntfs21parse__reparse__point(value) {
  if (value.length < 8) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("reparse point is shorter than its 8-byte header"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(value, 0);
  let tag;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    tag = _ok._0;
  } else {
    return _bind;
  }
  const kind = BigInt.asUintN(64, tag) === BigInt.asUintN(64, 2684354572n) ? "symlink" : BigInt.asUintN(64, tag) === BigInt.asUintN(64, 2684354563n) ? "mount-point" : "other";
  if (kind === "other") {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs12ReparsePoint(tag, kind, "", ""));
  }
  const base = BigInt.asUintN(64, tag) === BigInt.asUintN(64, 2684354572n) ? 20 : 16;
  if (value.length < base) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("reparse point is shorter than its path header"));
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, 8);
  let _tmp;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    _tmp = _ok._0;
  } else {
    return _bind$2;
  }
  const sub_off = Number(BigInt.asIntN(32, _tmp)) | 0;
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, 10);
  let _tmp$2;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp$2 = _ok._0;
  } else {
    return _bind$3;
  }
  const sub_len = Number(BigInt.asIntN(32, _tmp$2)) | 0;
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, 12);
  let _tmp$3;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    _tmp$3 = _ok._0;
  } else {
    return _bind$4;
  }
  const print_off = Number(BigInt.asIntN(32, _tmp$3)) | 0;
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(value, 14);
  let _tmp$4;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    _tmp$4 = _ok._0;
  } else {
    return _bind$5;
  }
  const print_len = Number(BigInt.asIntN(32, _tmp$4)) | 0;
  const _env = { _0: value, _1: base };
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs12ReparsePointRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs12ReparsePoint(tag, kind, _M0FP47wwt17336moonfs3src4ntfs21parse__reparse__pointN5sliceS1433(_env, sub_off, sub_len), _M0FP47wwt17336moonfs3src4ntfs21parse__reparse__pointN5sliceS1433(_env, print_off, print_len)));
}
function _M0FP47wwt17336moonfs3src4ntfs10read__file(img, vol, mft, number) {
  const label = `MFT record ${_M0MPC15int645Int6418to__string_2einner(number, 10)}`;
  const _bind = _M0FP47wwt17336moonfs3src4ntfs16load__attributes(img, vol, mft, number);
  let attrs;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    attrs = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs22find__named__attribute(attrs, 128n, "");
  if (_bind$2 === undefined) {
    const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs15find__attribute(attrs, 192n);
    if (_bind$3 === undefined) {
      return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok($bytes_literal$0);
    } else {
      const _Some = _bind$3;
      const _rp_attr = _Some;
      const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs21read__attribute__data(img, vol, _rp_attr, label);
      let value;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        value = _ok._0;
      } else {
        return _bind$4;
      }
      const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs21parse__reparse__point(value);
      let rp;
      if (_bind$5.$tag === 1) {
        const _ok = _bind$5;
        rp = _ok._0;
      } else {
        return _bind$5;
      }
      return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eReparse(rp.kind, rp.print_name));
    }
  } else {
    const _Some = _bind$2;
    const _attr = _Some;
    return _M0FP47wwt17336moonfs3src4ntfs21read__attribute__data(img, vol, _attr, label);
  }
}
function _M0FP47wwt17336moonfs3src4ntfs15total__clusters(runs) {
  let total = 0n;
  const _bind = runs.len;
  const _bind$2 = runs.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const run = _bind$2[_];
      total = BigInt.asUintN(64, total + run.clusters);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return total;
}
function _M0MP47wwt17336moonfs3src4ntfs6Volume11mft__offset(self) {
  const _p = self.mft_lcn;
  return BigInt.asUintN(64, self.base_offset + BigInt.asUintN(64, _p * BigInt.asUintN(64, BigInt(self.cluster_size))));
}
function _M0MP47wwt17336moonfs3src4ntfs3Mft4open(img, vol) {
  const start = _M0MP47wwt17336moonfs3src4ntfs6Volume11mft__offset(vol);
  let raw;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image4read(img, start, vol.mft_record_size);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        raw = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(`cannot read MFT record 0: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(raw, vol.bytes_per_sector, "MFT record 0");
  let fixed;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    fixed = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs13parse__record(fixed);
  let header;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    header = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs17parse__attributes(fixed, header.used_size);
  let attrs;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    attrs = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs22find__named__attribute(attrs, 128n, "");
  let data;
  if (_bind$4 === undefined) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("MFT record 0 has no default $DATA attribute"));
  } else {
    const _Some = _bind$4;
    data = _Some;
  }
  if (!data.non_resident) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("MFT is resident, which a real volume never allows"));
  }
  const runs = data.runs;
  const mft = new _M0TP47wwt17336moonfs3src4ntfs3Mft(vol.cluster_size, vol.mft_record_size, vol.base_offset, runs);
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs15find__attribute(attrs, 32n);
  if (_bind$5 === undefined) {
  } else {
    const _Some = _bind$5;
    const _list = _Some;
    let list_value;
    if (_list.non_resident) {
      let _try_err$2;
      _L$2: {
        _L$3: {
          const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs21read__attribute__data(img, vol, _list, "MFT $ATTRIBUTE_LIST");
          if (_bind$6.$tag === 1) {
            const _ok = _bind$6;
            list_value = _ok._0;
          } else {
            const _err = _bind$6;
            _try_err$2 = _err._0;
            break _L$3;
          }
          break _L$2;
        }
        list_value = $bytes_literal$0;
      }
    } else {
      list_value = _list.value;
    }
    let entries;
    let _try_err$2;
    _L$2: {
      _L$3: {
        const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs22parse__attribute__list(list_value);
        if (_bind$6.$tag === 1) {
          const _ok = _bind$6;
          entries = _ok._0;
        } else {
          const _err = _bind$6;
          _try_err$2 = _err._0;
          break _L$3;
        }
        break _L$2;
      }
      entries = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs13AttrListEntryE([], 0);
    }
    const _bind$6 = entries.len;
    const _bind$7 = entries.buf;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$6) {
        const entry = _bind$7[_];
        _L$3: {
          if (BigInt.asUintN(64, entry.type_code) !== BigInt.asUintN(64, 128n) || BigInt.asUintN(64, entry.lowest_vcn) === BigInt.asUintN(64, 0n)) {
            break _L$3;
          }
          let ext_raw;
          let _try_err$3;
          _L$4: {
            _L$5: {
              const _bind$8 = _M0MP47wwt17336moonfs3src4ntfs3Mft12read__record(mft, img, entry.record);
              if (_bind$8.$tag === 1) {
                const _ok = _bind$8;
                ext_raw = _ok._0;
              } else {
                const _err = _bind$8;
                _try_err$3 = _err._0;
                break _L$5;
              }
              break _L$4;
            }
            break _L$3;
          }
          const ext_label = `MFT record ${_M0MPC15int645Int6418to__string_2einner(entry.record, 10)}`;
          let ext_fixed;
          let _try_err$4;
          _L$5: {
            _L$6: {
              const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(ext_raw, vol.bytes_per_sector, ext_label);
              if (_bind$8.$tag === 1) {
                const _ok = _bind$8;
                ext_fixed = _ok._0;
              } else {
                const _err = _bind$8;
                _try_err$4 = _err._0;
                break _L$6;
              }
              break _L$5;
            }
            break _L$3;
          }
          const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs13parse__record(ext_fixed);
          let ext_header;
          if (_bind$8.$tag === 1) {
            const _ok = _bind$8;
            ext_header = _ok._0;
          } else {
            return _bind$8;
          }
          let ext_attrs;
          let _try_err$5;
          _L$6: {
            _L$7: {
              const _bind$9 = _M0FP47wwt17336moonfs3src4ntfs17parse__attributes(ext_fixed, ext_header.used_size);
              if (_bind$9.$tag === 1) {
                const _ok = _bind$9;
                ext_attrs = _ok._0;
              } else {
                const _err = _bind$9;
                _try_err$5 = _err._0;
                break _L$7;
              }
              break _L$6;
            }
            break _L$3;
          }
          const _bind$9 = ext_attrs.len;
          const _bind$10 = ext_attrs.buf;
          let _tmp$2 = 0;
          while (true) {
            const _$2 = _tmp$2;
            if (_$2 < _bind$9) {
              const attr = _bind$10[_$2];
              if (BigInt.asUintN(64, attr.type_code) === BigInt.asUintN(64, 128n) && BigInt.asUintN(64, attr.id) === BigInt.asUintN(64, entry.id)) {
                const _bind$11 = attr.runs;
                const _bind$12 = _bind$11.len;
                const _bind$13 = _bind$11.buf;
                let _tmp$3 = 0;
                while (true) {
                  const _$3 = _tmp$3;
                  if (_$3 < _bind$12) {
                    const run = _bind$13[_$3];
                    _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(runs, run);
                    _tmp$3 = _$3 + 1 | 0;
                    continue;
                  } else {
                    break;
                  }
                }
              }
              _tmp$2 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          break _L$3;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs3MftRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(mft);
}
function _M0FP47wwt17336moonfs3src4ntfs17parse__file__name(value) {
  if (value.length < 66) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("file name attribute is too short"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(value, 64);
  let _tmp;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    _tmp = _ok._0;
  } else {
    return _bind;
  }
  const name_length = Number(BigInt.asIntN(32, _tmp)) | 0;
  if ((66 + (Math.imul(name_length, 2) | 0) | 0) > value.length) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("file name runs past the attribute value"));
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 0);
  let parent;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    parent = _ok._0;
  } else {
    return _bind$2;
  }
  const _tmp$2 = BigInt.asUintN(64, parent & 281474976710655n);
  const _tmp$3 = BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asIntN(64, parent) >> BigInt(48 & 63)) & 65535n);
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 8);
  let _tmp$4;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp$4 = _ok._0;
  } else {
    return _bind$3;
  }
  const _tmp$5 = _tmp$4;
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 16);
  let _tmp$6;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    _tmp$6 = _ok._0;
  } else {
    return _bind$4;
  }
  const _tmp$7 = _tmp$6;
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 32);
  let _tmp$8;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    _tmp$8 = _ok._0;
  } else {
    return _bind$5;
  }
  const _tmp$9 = _tmp$8;
  const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 48);
  let _tmp$10;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    _tmp$10 = _ok._0;
  } else {
    return _bind$6;
  }
  const _tmp$11 = _tmp$10;
  const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(value, 40);
  let _tmp$12;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    _tmp$12 = _ok._0;
  } else {
    return _bind$7;
  }
  const _tmp$13 = _tmp$12;
  const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(value, 56);
  let _tmp$14;
  if (_bind$8.$tag === 1) {
    const _ok = _bind$8;
    _tmp$14 = _ok._0;
  } else {
    return _bind$8;
  }
  const _tmp$15 = _tmp$14;
  const _tmp$16 = _M0FP47wwt17336moonfs3src4ntfs19utf16le__to__string(value, 66, Math.imul(name_length, 2) | 0);
  const _bind$9 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(value, 65);
  let _tmp$17;
  if (_bind$9.$tag === 1) {
    const _ok = _bind$9;
    _tmp$17 = _ok._0;
  } else {
    return _bind$9;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs8FileNameRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs8FileName(_tmp$2, _tmp$3, _tmp$5, _tmp$7, _tmp$9, _tmp$11, _tmp$13, _tmp$15, _tmp$16, Number(BigInt.asIntN(32, _tmp$17)) | 0));
}
function _M0FP47wwt17336moonfs3src4ntfs23collect__index__entries(data, header_start, out) {
  if ((header_start + 16 | 0) > data.length) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("index header is outside the buffer"));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(data, header_start);
  let entries_offset;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    entries_offset = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs7rd__u32(data, header_start + 4 | 0);
  let index_length;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    index_length = _ok._0;
  } else {
    return _bind$2;
  }
  const start = header_start + (Number(BigInt.asIntN(32, entries_offset)) | 0) | 0;
  const end = header_start + (Number(BigInt.asIntN(32, index_length)) | 0) | 0;
  if (BigInt.asIntN(64, entries_offset) < BigInt.asIntN(64, 0n) || (BigInt.asIntN(64, index_length) < BigInt.asIntN(64, 0n) || (end > data.length || start > end))) {
    return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`index node declares a range outside its buffer (${_M0MPC13int3Int18to__string_2einner(start, 10)}..${_M0MPC13int3Int18to__string_2einner(end, 10)})`));
  }
  let pos = start;
  while (true) {
    if ((pos + 16 | 0) <= end) {
      const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(data, pos + 8 | 0);
      let _tmp;
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        _tmp = _ok._0;
      } else {
        return _bind$3;
      }
      const entry_length = Number(BigInt.asIntN(32, _tmp)) | 0;
      const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(data, pos + 10 | 0);
      let _tmp$2;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        _tmp$2 = _ok._0;
      } else {
        return _bind$4;
      }
      const key_length = Number(BigInt.asIntN(32, _tmp$2)) | 0;
      const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(data, pos + 12 | 0);
      let flags;
      if (_bind$5.$tag === 1) {
        const _ok = _bind$5;
        flags = _ok._0;
      } else {
        return _bind$5;
      }
      if (entry_length < 16) {
        return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`index entry declares length ${_M0MPC13int3Int18to__string_2einner(entry_length, 10)}`));
      }
      if (key_length >= 66 && ((pos + 16 | 0) + key_length | 0) <= end) {
        const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(data, pos);
        let entry_ref;
        if (_bind$6.$tag === 1) {
          const _ok = _bind$6;
          entry_ref = _ok._0;
        } else {
          return _bind$6;
        }
        let key;
        let _try_err;
        _L: {
          _L$2: {
            const _bind$7 = _M0FP47wwt17336moonfs3src5binio5slice(data, pos + 16 | 0, key_length);
            if (_bind$7.$tag === 1) {
              const _ok = _bind$7;
              key = _ok._0;
            } else {
              const _err = _bind$7;
              _try_err = _err._0;
              break _L$2;
            }
            break _L;
          }
          return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("cannot read index entry key"));
        }
        let parsed;
        let _try_err$2;
        _L$2: {
          _L$3: {
            const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs17parse__file__name(key);
            if (_bind$7.$tag === 1) {
              const _ok = _bind$7;
              parsed = _ok._0;
            } else {
              const _err = _bind$7;
              _try_err$2 = _err._0;
              break _L$3;
            }
            break _L$2;
          }
          parsed = undefined;
        }
        if (parsed === undefined) {
        } else {
          const _Some = parsed;
          const _info = _Some;
          if (_info.name_ns !== 2) {
            _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3src4ntfs8DirEntry(BigInt.asUintN(64, entry_ref & 281474976710655n), BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asIntN(64, entry_ref) >> BigInt(48 & 63)) & 65535n), _info.name, _info.name_ns, _info.created, _info.modified, _info.accessed, _info.logical_size, _info.allocated_size, _info.flags));
          }
        }
      }
      if (BigInt.asUintN(64, BigInt.asUintN(64, flags & 2n)) !== BigInt.asUintN(64, 0n)) {
        break;
      }
      pos = pos + entry_length | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGuRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(undefined);
}
function _M0FP47wwt17336moonfs3src4ntfs15list__directory(img, vol, mft, number) {
  const _bind = _M0MP47wwt17336moonfs3src4ntfs3Mft12read__record(mft, img, number);
  let raw;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    raw = _ok._0;
  } else {
    return _bind;
  }
  const label = `MFT record ${_M0MPC15int645Int6418to__string_2einner(number, 10)}`;
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(raw, vol.bytes_per_sector, label);
  let fixed;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    fixed = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs13parse__record(fixed);
  let header;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    header = _ok._0;
  } else {
    return _bind$3;
  }
  if (!(BigInt.asUintN(64, BigInt.asUintN(64, header.flags & 2n)) !== BigInt.asUintN(64, 0n))) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label} is not a directory`));
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs16load__attributes(img, vol, mft, number);
  let attrs;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    attrs = _ok._0;
  } else {
    return _bind$4;
  }
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryE([], 0);
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs22find__named__attribute(attrs, 144n, "$I30");
  if (_bind$5 === undefined) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`${label} has no $I30 index root attribute`));
  } else {
    const _Some = _bind$5;
    const _root = _Some;
    const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs23collect__index__entries(_root.value, 16, out);
    if (_bind$6.$tag === 1) {
      const _ok = _bind$6;
      _ok._0;
    } else {
      return _bind$6;
    }
  }
  const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs22find__named__attribute(attrs, 160n, "$I30");
  if (_bind$6 === undefined) {
  } else {
    const _Some = _bind$6;
    const _alloc = _Some;
    const runs = _alloc.runs;
    const cluster = BigInt.asUintN(64, BigInt(vol.cluster_size));
    const block = BigInt.asUintN(64, BigInt(vol.index_record_size));
    const cover = BigInt.asUintN(64, _M0FP47wwt17336moonfs3src4ntfs15total__clusters(runs) * cluster);
    let index = 0n;
    while (true) {
      if (BigInt.asIntN(64, BigInt.asUintN(64, index * block)) < BigInt.asIntN(64, cover)) {
        const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs16read__from__runs(img, vol.base_offset, vol.cluster_size, runs, BigInt.asUintN(64, index * block), block);
        let bytes;
        if (_bind$7.$tag === 1) {
          const _ok = _bind$7;
          bytes = _ok._0;
        } else {
          return _bind$7;
        }
        if (_M0FP47wwt17336moonfs3src5binio12starts__with(bytes, 0, $bytes_literal$3)) {
          const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs12apply__fixup(bytes, vol.bytes_per_sector, `INDX block ${_M0MPC15int645Int6418to__string_2einner(index, 10)}`);
          let repaired;
          if (_bind$8.$tag === 1) {
            const _ok = _bind$8;
            repaired = _ok._0;
          } else {
            return _bind$8;
          }
          const _bind$9 = _M0FP47wwt17336moonfs3src4ntfs23collect__index__entries(repaired, 24, out);
          if (_bind$9.$tag === 1) {
            const _ok = _bind$9;
            _ok._0;
          } else {
            return _bind$9;
          }
        }
        index = BigInt.asUintN(64, index + 1n);
        continue;
      } else {
        break;
      }
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src4ntfs8DirEntryERP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src4ntfs12record__size(clusters_per_record, cluster_size) {
  const signed = BigInt.asIntN(64, clusters_per_record) > BigInt.asIntN(64, 127n) ? BigInt.asUintN(64, clusters_per_record - 256n) : clusters_per_record;
  if (BigInt.asIntN(64, signed) > BigInt.asIntN(64, 0n)) {
    const size = BigInt.asUintN(64, signed * BigInt.asUintN(64, BigInt(cluster_size)));
    if (BigInt.asIntN(64, size) <= BigInt.asIntN(64, 0n) || BigInt.asIntN(64, size) > BigInt.asIntN(64, 65536n)) {
      return new _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`record size ${_M0MPC15int645Int6418to__string_2einner(size, 10)} out of range`));
    }
    return new _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(Number(BigInt.asIntN(32, size)) | 0);
  } else {
    if (BigInt.asIntN(64, signed) < BigInt.asIntN(64, 0n) && BigInt.asIntN(64, signed) >= BigInt.asIntN(64, 18446744073709551600n)) {
      return new _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(1 << (Number(BigInt.asIntN(32, BigInt.asUintN(64, -signed))) | 0));
    } else {
      return new _M0DTPC16result6ResultGiRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt(`invalid clusters-per-record encoding ${_M0MPC15int645Int6418to__string_2einner(signed, 10)}`));
    }
  }
}
function _M0FP47wwt17336moonfs3src4ntfs19parse__boot__sector(boot) {
  if (!_M0FP47wwt17336moonfs3src5binio12starts__with(boot, 3, $bytes_literal$4)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(_M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eNotNtfs__);
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs7rd__u16(boot, 11);
  let bytes_per_sector;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    bytes_per_sector = _ok._0;
  } else {
    return _bind;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(boot, 13);
  let sectors_per_cluster;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    sectors_per_cluster = _ok._0;
  } else {
    return _bind$2;
  }
  if (!(BigInt.asIntN(64, bytes_per_sector) > BigInt.asIntN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, bytes_per_sector & BigInt.asUintN(64, bytes_per_sector - 1n))) === BigInt.asUintN(64, 0n)) || (BigInt.asIntN(64, bytes_per_sector) < BigInt.asIntN(64, 256n) || BigInt.asIntN(64, bytes_per_sector) > BigInt.asIntN(64, 4096n))) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error55wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eBadGeometry(`bytes per sector ${_M0MPC15int645Int6418to__string_2einner(bytes_per_sector, 10)}`));
  }
  if (!(BigInt.asIntN(64, sectors_per_cluster) > BigInt.asIntN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, sectors_per_cluster & BigInt.asUintN(64, sectors_per_cluster - 1n))) === BigInt.asUintN(64, 0n)) || BigInt.asIntN(64, sectors_per_cluster) > BigInt.asIntN(64, 128n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error55wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eBadGeometry(`sectors per cluster ${_M0MPC15int645Int6418to__string_2einner(sectors_per_cluster, 10)}`));
  }
  const cluster_size = BigInt.asUintN(64, bytes_per_sector * sectors_per_cluster);
  if (BigInt.asIntN(64, cluster_size) > BigInt.asIntN(64, 131072n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error55wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eBadGeometry(`cluster size ${_M0MPC15int645Int6418to__string_2einner(cluster_size, 10)} exceeds 128 KiB`));
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(boot, 40);
  let total_sectors;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    total_sectors = _ok._0;
  } else {
    return _bind$3;
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(boot, 48);
  let mft_lcn;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    mft_lcn = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(boot, 56);
  let mft_mirror_lcn;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    mft_mirror_lcn = _ok._0;
  } else {
    return _bind$5;
  }
  if (BigInt.asIntN(64, mft_lcn) <= BigInt.asIntN(64, 0n) || BigInt.asIntN(64, mft_mirror_lcn) <= BigInt.asIntN(64, 0n)) {
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error51wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eCorrupt("mft location is not positive"));
  }
  const _tmp = Number(BigInt.asIntN(32, bytes_per_sector)) | 0;
  const _tmp$2 = Number(BigInt.asIntN(32, sectors_per_cluster)) | 0;
  const _tmp$3 = Number(BigInt.asIntN(32, cluster_size)) | 0;
  const _bind$6 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(boot, 64);
  let _tmp$4;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    _tmp$4 = _ok._0;
  } else {
    return _bind$6;
  }
  const _bind$7 = _M0FP47wwt17336moonfs3src4ntfs12record__size(_tmp$4, Number(BigInt.asIntN(32, cluster_size)) | 0);
  let _tmp$5;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    _tmp$5 = _ok._0;
  } else {
    return _bind$7;
  }
  const _tmp$6 = _tmp$5;
  const _bind$8 = _M0FP47wwt17336moonfs3src4ntfs6rd__u8(boot, 68);
  let _tmp$7;
  if (_bind$8.$tag === 1) {
    const _ok = _bind$8;
    _tmp$7 = _ok._0;
  } else {
    return _bind$8;
  }
  const _bind$9 = _M0FP47wwt17336moonfs3src4ntfs12record__size(_tmp$7, Number(BigInt.asIntN(32, cluster_size)) | 0);
  let _tmp$8;
  if (_bind$9.$tag === 1) {
    const _ok = _bind$9;
    _tmp$8 = _ok._0;
  } else {
    return _bind$9;
  }
  const _tmp$9 = _tmp$8;
  const _bind$10 = _M0FP47wwt17336moonfs3src4ntfs7rd__i64(boot, 72);
  let _tmp$10;
  if (_bind$10.$tag === 1) {
    const _ok = _bind$10;
    _tmp$10 = _ok._0;
  } else {
    return _bind$10;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs6Volume(_tmp, _tmp$2, _tmp$3, total_sectors, mft_lcn, mft_mirror_lcn, _tmp$6, _tmp$9, 0n, _tmp$10));
}
function _M0MP47wwt17336moonfs3src4ntfs6Volume4open(img, start_lba) {
  const offset = BigInt.asUintN(64, start_lba * BigInt.asUintN(64, BigInt(img.sector_size)));
  let boot;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image4read(img, offset, 512);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        boot = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE3Err(new _M0DTPC15error5Error46wwt1733_2fmoonfs_2fsrc_2fntfs_2eNtfsError_2eIo(`cannot read boot sector: ${_M0FP47wwt17336moonfs3src5block10reason__of(_try_err)}`));
  }
  const _bind = _M0FP47wwt17336moonfs3src4ntfs19parse__boot__sector(boot);
  let parsed;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    parsed = _ok._0;
  } else {
    return _bind;
  }
  return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ntfs6VolumeRP47wwt17336moonfs3src4ntfs9NtfsErrorE2Ok(new _M0TP47wwt17336moonfs3src4ntfs6Volume(parsed.bytes_per_sector, parsed.sectors_per_cluster, parsed.cluster_size, parsed.total_sectors, parsed.mft_lcn, parsed.mft_mirror_lcn, parsed.mft_record_size, parsed.index_record_size, offset, parsed.serial_number));
}
function _M0FP47wwt17336moonfs3src8checksum5crc32(bytes) {
  let crc = 4294967295n;
  const _bind = bytes.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      const _tmp$2 = crc;
      const _p = i >>> 0 < bytes.length ? bytes[i] : $oob();
      crc = BigInt.asUintN(64, _tmp$2 ^ BigInt.asUintN(64, BigInt(_p)));
      let _tmp$3 = 0;
      while (true) {
        const _ = _tmp$3;
        if (_ < 8) {
          if (BigInt.asUintN(64, BigInt.asUintN(64, crc & 1n)) === BigInt.asUintN(64, 1n)) {
            crc = BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asIntN(64, crc) >> BigInt(1 & 63)) ^ 3988292384n);
          } else {
            crc = BigInt.asUintN(64, BigInt.asIntN(64, crc) >> BigInt(1 & 63));
          }
          _tmp$3 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return BigInt.asUintN(64, crc ^ 4294967295n);
}
function _M0FP47wwt17336moonfs3src9partition10io__reason(err) {
  if (err.$tag === 2) {
    const _OutOfBounds = err;
    const _offset = _OutOfBounds._0;
    const _need = _OutOfBounds._1;
    const _size = _OutOfBounds._2;
    return `need ${_M0MPC15int645Int6418to__string_2einner(_need, 10)} byte(s) at ${_M0MPC15int645Int6418to__string_2einner(_offset, 10)}, image is ${_M0MPC15int645Int6418to__string_2einner(_size, 10)} byte(s)`;
  } else {
    const _InvalidSectorSize = err;
    const _size = _InvalidSectorSize._0;
    return `invalid sector size ${_M0MPC13int3Int18to__string_2einner(_size, 10)}`;
  }
}
function _M0FP47wwt17336moonfs3src9partition6rd__u8(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio2u8(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src9partition7rd__u16(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u16le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src9partition7rd__u32(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5u32le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src9partition7rd__i64(buf, off) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5i64le(buf, off);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGlRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src9partition9rd__slice(buf, off, len) {
  let _try_err;
  _L: {
    const _bind = _M0FP47wwt17336moonfs3src5binio5slice(buf, off, len);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      const _err = _bind;
      _try_err = _err._0;
      break _L;
    }
    return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(_tmp);
  }
  return new _M0DTPC16result6ResultGzRP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`field read out of range at ${_M0MPC13int3Int18to__string_2einner(off, 10)}`));
}
function _M0FP47wwt17336moonfs3src9partition18parse__mbr__sector(sector) {
  const _bind = _M0FP47wwt17336moonfs3src9partition7rd__u16(sector, 510);
  let signature;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    signature = _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asUintN(64, signature) !== BigInt.asUintN(64, 43605n)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error66wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eBadSignature(signature));
  }
  const parts = new _M0TPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionE([], 0);
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < 4) {
      const base = 446 + (Math.imul(i, 16) | 0) | 0;
      const _bind$2 = _M0FP47wwt17336moonfs3src9partition6rd__u8(sector, base);
      let status;
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        status = _ok._0;
      } else {
        return _bind$2;
      }
      const _bind$3 = _M0FP47wwt17336moonfs3src9partition6rd__u8(sector, base + 4 | 0);
      let type_byte;
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        type_byte = _ok._0;
      } else {
        return _bind$3;
      }
      const _bind$4 = _M0FP47wwt17336moonfs3src9partition7rd__u32(sector, base + 8 | 0);
      let start;
      if (_bind$4.$tag === 1) {
        const _ok = _bind$4;
        start = _ok._0;
      } else {
        return _bind$4;
      }
      const _bind$5 = _M0FP47wwt17336moonfs3src9partition7rd__u32(sector, base + 12 | 0);
      let count;
      if (_bind$5.$tag === 1) {
        const _ok = _bind$5;
        count = _ok._0;
      } else {
        return _bind$5;
      }
      if (BigInt.asUintN(64, type_byte) !== BigInt.asUintN(64, 0n) && BigInt.asUintN(64, count) !== BigInt.asUintN(64, 0n)) {
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(parts, new _M0TP47wwt17336moonfs3src9partition9Partition(i, 0, type_byte, "", "", start, count, BigInt.asUintN(64, status) === BigInt.asUintN(64, 128n)));
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(parts);
}
function _M0FP47wwt17336moonfs3src9partition9read__mbr(img) {
  let sector;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image12read__sector(img, 0n);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        sector = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error56wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eIo(_M0FP47wwt17336moonfs3src9partition10io__reason(_try_err)));
  }
  return _M0FP47wwt17336moonfs3src9partition18parse__mbr__sector(sector);
}
function _M0FP47wwt17336moonfs3src9partition20has__protective__mbr(parts) {
  const _bind = parts.len;
  const _bind$2 = parts.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const part = _bind$2[_];
      if (BigInt.asUintN(64, part.mbr_type) === BigInt.asUintN(64, 238n)) {
        return true;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return false;
}
function _M0FP47wwt17336moonfs3src9partition9all__zero(bytes) {
  const _bind = bytes.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      if ((i >>> 0 < bytes.length ? bytes[i] : $oob()) !== 0) {
        return false;
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return true;
}
function _M0FP47wwt17336moonfs3src9partition6zeroed(bytes, from, to) {
  const out = $makebytes(bytes.length, 0);
  const _bind = bytes.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      if (i >>> 0 < out.length) {
        out[i] = i >= from && i < to ? 0 : i >>> 0 < bytes.length ? bytes[i] : $oob();
      } else {
        $oob();
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out, 0, out.length));
}
function _M0FP47wwt17336moonfs3src9partition10hex__digit(v) {
  switch (v) {
    case 0: {
      return "0";
    }
    case 1: {
      return "1";
    }
    case 2: {
      return "2";
    }
    case 3: {
      return "3";
    }
    case 4: {
      return "4";
    }
    case 5: {
      return "5";
    }
    case 6: {
      return "6";
    }
    case 7: {
      return "7";
    }
    case 8: {
      return "8";
    }
    case 9: {
      return "9";
    }
    case 10: {
      return "a";
    }
    case 11: {
      return "b";
    }
    case 12: {
      return "c";
    }
    case 13: {
      return "d";
    }
    case 14: {
      return "e";
    }
    default: {
      return "f";
    }
  }
}
function _M0FP47wwt17336moonfs3src9partition9hex__byte(b) {
  const v = b;
  return `${_M0FP47wwt17336moonfs3src9partition10hex__digit(v >> 4 & 15)}${_M0FP47wwt17336moonfs3src9partition10hex__digit(v & 15)}`;
}
function _M0FP47wwt17336moonfs3src9partition16guid__to__string(raw, off) {
  const _bind = _M0FP47wwt17336moonfs3src9partition9rd__slice(raw, off, 16);
  let g;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    g = _ok._0;
  } else {
    return _bind;
  }
  let out = "";
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < 4) {
      const _tmp$2 = out;
      const _tmp$3 = 3 - i | 0;
      out = `${_tmp$2}${_M0FP47wwt17336moonfs3src9partition9hex__byte(_tmp$3 >>> 0 < g.length ? g[_tmp$3] : $oob())}`;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  out = `${out}-`;
  let _tmp$2 = 0;
  while (true) {
    const i = _tmp$2;
    if (i < 2) {
      const _tmp$3 = out;
      const _tmp$4 = 5 - i | 0;
      out = `${_tmp$3}${_M0FP47wwt17336moonfs3src9partition9hex__byte(_tmp$4 >>> 0 < g.length ? g[_tmp$4] : $oob())}`;
      _tmp$2 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  out = `${out}-`;
  let _tmp$3 = 0;
  while (true) {
    const i = _tmp$3;
    if (i < 2) {
      const _tmp$4 = out;
      const _tmp$5 = 7 - i | 0;
      out = `${_tmp$4}${_M0FP47wwt17336moonfs3src9partition9hex__byte(_tmp$5 >>> 0 < g.length ? g[_tmp$5] : $oob())}`;
      _tmp$3 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  out = `${out}-`;
  out = `${out}${_M0FP47wwt17336moonfs3src9partition9hex__byte(8 >>> 0 < g.length ? g[8] : $oob())}${_M0FP47wwt17336moonfs3src9partition9hex__byte(9 >>> 0 < g.length ? g[9] : $oob())}-`;
  let _tmp$4 = 0;
  while (true) {
    const i = _tmp$4;
    if (i < 6) {
      const _tmp$5 = out;
      const _tmp$6 = 10 + i | 0;
      out = `${_tmp$5}${_M0FP47wwt17336moonfs3src9partition9hex__byte(_tmp$6 >>> 0 < g.length ? g[_tmp$6] : $oob())}`;
      _tmp$4 = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGsRP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(out);
}
function _M0FP47wwt17336moonfs3src9partition19utf16le__to__string(raw, off, len) {
  const chars = new _M0TPB5ArrayGcE([], 0);
  let i = 0;
  while (true) {
    if ((i + 1 | 0) < len) {
      const _tmp = off + i | 0;
      const _tmp$2 = _tmp >>> 0 < raw.length ? raw[_tmp] : $oob();
      const _tmp$3 = (off + i | 0) + 1 | 0;
      const unit = _tmp$2 | (_tmp$3 >>> 0 < raw.length ? raw[_tmp$3] : $oob()) << 8;
      if (unit === 0) {
        break;
      }
      if (unit >= 55296 && (unit <= 56319 && (i + 3 | 0) < len)) {
        const _tmp$4 = (off + i | 0) + 2 | 0;
        const _tmp$5 = _tmp$4 >>> 0 < raw.length ? raw[_tmp$4] : $oob();
        const _tmp$6 = (off + i | 0) + 3 | 0;
        const low = _tmp$5 | (_tmp$6 >>> 0 < raw.length ? raw[_tmp$6] : $oob()) << 8;
        if (low >= 56320 && low <= 57343) {
          const code = (65536 + (unit - 55296 << 10) | 0) + (low - 56320 | 0) | 0;
          const _bind = _M0MPC13int3Int8to__char(code);
          if (_bind === -1) {
          } else {
            const _Some = _bind;
            const _c = _Some;
            _M0MPC15array5Array4pushGcE(chars, _c);
          }
          i = i + 4 | 0;
          continue;
        }
      }
      const _bind = _M0MPC13int3Int8to__char(unit);
      if (_bind === -1) {
      } else {
        const _Some = _bind;
        const _c = _Some;
        _M0MPC15array5Array4pushGcE(chars, _c);
      }
      i = i + 2 | 0;
      continue;
    } else {
      break;
    }
  }
  return _M0MPC16string6String11from__array(new _M0TPB9ArrayViewGcE(chars.buf, 0, chars.len));
}
function _M0FP47wwt17336moonfs3src9partition9read__gpt(img) {
  const sector_size = BigInt.asUintN(64, BigInt(img.sector_size));
  let header;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image12read__sector(img, 1n);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        header = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error56wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eIo(_M0FP47wwt17336moonfs3src9partition10io__reason(_try_err)));
  }
  if (!_M0FP47wwt17336moonfs3src5binio12starts__with(header, 0, $bytes_literal$5)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt("gpt signature not found in LBA 1"));
  }
  const _bind = _M0FP47wwt17336moonfs3src9partition7rd__u32(header, 12);
  let header_size;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    header_size = _ok._0;
  } else {
    return _bind;
  }
  if (BigInt.asIntN(64, header_size) < BigInt.asIntN(64, 92n) || BigInt.asIntN(64, header_size) > BigInt.asIntN(64, sector_size)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`gpt header size ${_M0MPC15int645Int6418to__string_2einner(header_size, 10)} out of range`));
  }
  const _bind$2 = _M0FP47wwt17336moonfs3src9partition7rd__u32(header, 16);
  let stored_crc;
  if (_bind$2.$tag === 1) {
    const _ok = _bind$2;
    stored_crc = _ok._0;
  } else {
    return _bind$2;
  }
  const _bind$3 = _M0FP47wwt17336moonfs3src9partition9rd__slice(header, 0, Number(BigInt.asIntN(32, header_size)) | 0);
  let _tmp;
  if (_bind$3.$tag === 1) {
    const _ok = _bind$3;
    _tmp = _ok._0;
  } else {
    return _bind$3;
  }
  const header_bytes = _M0FP47wwt17336moonfs3src9partition6zeroed(_tmp, 16, 20);
  if (BigInt.asUintN(64, _M0FP47wwt17336moonfs3src8checksum5crc32(header_bytes)) !== BigInt.asUintN(64, stored_crc)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt("gpt header crc mismatch"));
  }
  const _bind$4 = _M0FP47wwt17336moonfs3src9partition7rd__i64(header, 72);
  let entries_lba;
  if (_bind$4.$tag === 1) {
    const _ok = _bind$4;
    entries_lba = _ok._0;
  } else {
    return _bind$4;
  }
  const _bind$5 = _M0FP47wwt17336moonfs3src9partition7rd__u32(header, 80);
  let num_entries;
  if (_bind$5.$tag === 1) {
    const _ok = _bind$5;
    num_entries = _ok._0;
  } else {
    return _bind$5;
  }
  const _bind$6 = _M0FP47wwt17336moonfs3src9partition7rd__u32(header, 84);
  let entry_size;
  if (_bind$6.$tag === 1) {
    const _ok = _bind$6;
    entry_size = _ok._0;
  } else {
    return _bind$6;
  }
  const _bind$7 = _M0FP47wwt17336moonfs3src9partition7rd__u32(header, 88);
  let entries_crc;
  if (_bind$7.$tag === 1) {
    const _ok = _bind$7;
    entries_crc = _ok._0;
  } else {
    return _bind$7;
  }
  if (BigInt.asIntN(64, entry_size) < BigInt.asIntN(64, 128n)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`gpt entry size ${_M0MPC15int645Int6418to__string_2einner(entry_size, 10)} is too small`));
  }
  const total = BigInt.asUintN(64, num_entries * entry_size);
  if (BigInt.asIntN(64, total) <= BigInt.asIntN(64, 0n) || BigInt.asIntN(64, total) > BigInt.asIntN(64, 2147483647n)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt(`gpt entry array size ${_M0MPC15int645Int6418to__string_2einner(total, 10)} out of range`));
  }
  let entries;
  let _try_err$2;
  _L$2: {
    _L$3: {
      const _bind$8 = _M0MP47wwt17336moonfs3src5block5Image4read(img, BigInt.asUintN(64, entries_lba * sector_size), Number(BigInt.asIntN(32, total)) | 0);
      if (_bind$8.$tag === 1) {
        const _ok = _bind$8;
        entries = _ok._0;
      } else {
        const _err = _bind$8;
        _try_err$2 = _err._0;
        break _L$3;
      }
      break _L$2;
    }
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error56wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eIo(_M0FP47wwt17336moonfs3src9partition10io__reason(_try_err$2)));
  }
  if (BigInt.asUintN(64, _M0FP47wwt17336moonfs3src8checksum5crc32(entries)) !== BigInt.asUintN(64, entries_crc)) {
    return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE3Err(new _M0DTPC15error5Error61wwt1733_2fmoonfs_2fsrc_2fpartition_2ePartitionError_2eCorrupt("gpt entry array crc mismatch"));
  }
  const parts = new _M0TPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionE([], 0);
  let idx = 0;
  while (true) {
    if (BigInt.asIntN(64, BigInt.asUintN(64, BigInt(idx))) < BigInt.asIntN(64, num_entries)) {
      const base = Math.imul(idx, Number(BigInt.asIntN(32, entry_size)) | 0) | 0;
      const _bind$8 = _M0FP47wwt17336moonfs3src9partition9rd__slice(entries, base, 16);
      let type_bytes;
      if (_bind$8.$tag === 1) {
        const _ok = _bind$8;
        type_bytes = _ok._0;
      } else {
        return _bind$8;
      }
      if (!_M0FP47wwt17336moonfs3src9partition9all__zero(type_bytes)) {
        const _bind$9 = _M0FP47wwt17336moonfs3src9partition7rd__i64(entries, base + 32 | 0);
        let first_lba;
        if (_bind$9.$tag === 1) {
          const _ok = _bind$9;
          first_lba = _ok._0;
        } else {
          return _bind$9;
        }
        const _bind$10 = _M0FP47wwt17336moonfs3src9partition7rd__i64(entries, base + 40 | 0);
        let last_lba;
        if (_bind$10.$tag === 1) {
          const _ok = _bind$10;
          last_lba = _ok._0;
        } else {
          return _bind$10;
        }
        const _tmp$2 = idx;
        const _bind$11 = _M0FP47wwt17336moonfs3src9partition16guid__to__string(entries, base);
        let _tmp$3;
        if (_bind$11.$tag === 1) {
          const _ok = _bind$11;
          _tmp$3 = _ok._0;
        } else {
          return _bind$11;
        }
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(parts, new _M0TP47wwt17336moonfs3src9partition9Partition(_tmp$2, 1, 0n, _tmp$3, _M0FP47wwt17336moonfs3src9partition19utf16le__to__string(entries, base + 56 | 0, 72), first_lba, BigInt.asUintN(64, BigInt.asUintN(64, last_lba - first_lba) + 1n), false));
      }
      idx = idx + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(parts);
}
function _M0FP47wwt17336moonfs3src9partition4read(img) {
  const _bind = _M0FP47wwt17336moonfs3src9partition9read__mbr(img);
  let mbr;
  if (_bind.$tag === 1) {
    const _ok = _bind;
    mbr = _ok._0;
  } else {
    return _bind;
  }
  return _M0FP47wwt17336moonfs3src9partition20has__protective__mbr(mbr) ? _M0FP47wwt17336moonfs3src9partition9read__gpt(img) : new _M0DTPC16result6ResultGRPB5ArrayGRP47wwt17336moonfs3src9partition9PartitionERP47wwt17336moonfs3src9partition14PartitionErrorE2Ok(mbr);
}
function _M0FP47wwt17336moonfs3web3api5quote(s) {
  const a = _M0MPC16string6String12replace__all(s, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1713, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1714);
  const b = _M0MPC16string6String12replace__all(a, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1715, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1716);
  const c = _M0MPC16string6String12replace__all(b, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1717, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1718);
  const d = _M0MPC16string6String12replace__all(c, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1719, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1720);
  const e = _M0MPC16string6String12replace__all(d, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1721, _M0FP47wwt17336moonfs3web3api5quoteN6recordS1722);
  return `\"${e}\"`;
}
function _M0FP47wwt17336moonfs3web3api9err__json(msg) {
  return `{\"ok\":false,\"error\":${_M0FP47wwt17336moonfs3web3api5quote(msg)}}`;
}
function _M0FP47wwt17336moonfs3web3api9try__ext4(img, start_lba) {
  let sb;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src4ext410Superblock4open(img, start_lba);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        sb = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return undefined;
  }
  return sb;
}
function _M0FP47wwt17336moonfs3web3api9try__ntfs(img, start_lba) {
  let vol;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src4ntfs6Volume4open(img, start_lba);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        vol = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return undefined;
  }
  return vol;
}
function _M0FP47wwt17336moonfs3web3api6detect(img, start_lba) {
  const _bind = _M0FP47wwt17336moonfs3web3api9try__ntfs(img, start_lba);
  if (_bind === undefined) {
    const _bind$2 = _M0FP47wwt17336moonfs3web3api9try__ext4(img, start_lba);
    if (_bind$2 === undefined) {
      return undefined;
    } else {
      const _Some = _bind$2;
      const _sb = _Some;
      return new _M0DTP47wwt17336moonfs3web3api2Fs4Ext4(_sb);
    }
  } else {
    const _Some = _bind;
    const _vol = _Some;
    return new _M0DTP47wwt17336moonfs3web3api2Fs4Ntfs(_vol);
  }
}
function _M0FP47wwt17336moonfs3web3api15try__partitions(img) {
  let parts;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FP47wwt17336moonfs3src9partition4read(img);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        parts = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return undefined;
  }
  return parts;
}
function _M0FP47wwt17336moonfs3web3api13find__volumes(img) {
  const out = new _M0TPB5ArrayGRP47wwt17336moonfs3web3api5FoundE([], 0);
  const _bind = _M0FP47wwt17336moonfs3web3api6detect(img, 0n);
  if (_bind === undefined) {
  } else {
    const _Some = _bind;
    const _fs = _Some;
    _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3web3api5Found(0n, _fs));
    return out;
  }
  const _bind$2 = _M0FP47wwt17336moonfs3web3api15try__partitions(img);
  if (_bind$2 === undefined) {
  } else {
    const _Some = _bind$2;
    const _parts = _Some;
    const _bind$3 = _parts.len;
    const _bind$4 = _parts.buf;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$3) {
        const p = _bind$4[_];
        const _bind$5 = _M0FP47wwt17336moonfs3web3api6detect(img, p.start_lba);
        if (_bind$5 === undefined) {
        } else {
          const _Some$2 = _bind$5;
          const _fs = _Some$2;
          _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, new _M0TP47wwt17336moonfs3web3api5Found(p.start_lba, _fs));
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
  }
  return out;
}
function _M0FP47wwt17336moonfs3web3api9fs__label(fs) {
  if (fs.$tag === 0) {
    const _Ntfs = fs;
    const _vol = _Ntfs._0;
    return `NTFS · cluster ${_M0MPC13int3Int18to__string_2einner(_vol.cluster_size, 10)} B · ${_M0MPC15int645Int6418to__string_2einner(BigInt.asUintN(64, _vol.total_sectors * BigInt.asUintN(64, BigInt(_vol.bytes_per_sector))), 10)} B`;
  } else {
    const _Ext4 = fs;
    const _sb = _Ext4._0;
    return `ext4 · block ${_M0MPC13int3Int18to__string_2einner(_sb.block_size, 10)} B · ${_M0MPC15int645Int6418to__string_2einner(_sb.blocks_count, 10)} 块`;
  }
}
function _M0FP47wwt17336moonfs3web3api8fs__name(fs) {
  if (fs.$tag === 0) {
    return "ntfs";
  } else {
    return "ext4";
  }
}
function _M0FP47wwt17336moonfs3web3api11split__path(path) {
  const out = new _M0TPB5ArrayGsE([], 0);
  const _it = _M0MPC16string6String5split(path, _M0FP47wwt17336moonfs3web3api11split__pathN6recordS1774);
  while (true) {
    const _bind = _M0MPB4Iter4nextGRPC16string10StringViewE(_it);
    if (_bind === undefined) {
      break;
    } else {
      const _Some = _bind;
      const _seg = _Some;
      const s = _M0MPC16string10StringView9to__owned(_seg);
      let _tmp;
      const _p = "";
      if (!(s === _p)) {
        const _p$2 = ".";
        _tmp = !(s === _p$2);
      } else {
        _tmp = false;
      }
      if (_tmp) {
        _M0MPC15array5Array4pushGRP47wwt17336moonfs3web3api5FoundE(out, s);
      }
      continue;
    }
  }
  return out;
}
function _M0FP47wwt17336moonfs3web3api13ext4__resolve(img, sb, path) {
  const clean = _M0FP47wwt17336moonfs3web3api11split__path(path);
  if (clean.len === 0) {
    const _bind = _M0FP47wwt17336moonfs3src4ext411read__inode(img, sb, 2n);
    let _tmp;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      _tmp = _ok._0;
    } else {
      return _bind;
    }
    return new _M0DTPC16result6ResultGRP47wwt17336moonfs3src4ext45InodeRP47wwt17336moonfs3src4ext49Ext4ErrorE2Ok(_tmp);
  }
  return _M0FP47wwt17336moonfs3src4ext413resolve__path(img, sb, path);
}
function _M0FP47wwt17336moonfs3web3api14ext4__size__of(img, sb, inode) {
  let parsed;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FP47wwt17336moonfs3src4ext411read__inode(img, sb, inode);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        parsed = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return 0n;
  }
  return parsed.size;
}
function _M0FP47wwt17336moonfs3web3api16ext4__list__json(img, sb, path) {
  let dir;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0FP47wwt17336moonfs3web3api13ext4__resolve(img, sb, path);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        dir = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return "[]";
  }
  let entries;
  let _try_err$2;
  _L$2: {
    _L$3: {
      const _bind = _M0FP47wwt17336moonfs3src4ext415list__directory(img, sb, dir);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        entries = _ok._0;
      } else {
        const _err = _bind;
        _try_err$2 = _err._0;
        break _L$3;
      }
      break _L$2;
    }
    return "[]";
  }
  let out = "[";
  let first = true;
  const _bind = entries.len;
  const _bind$2 = entries.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const e = _bind$2[_];
      _L$3: {
        if (e.name === "." || e.name === "..") {
          break _L$3;
        }
        const size = _M0FP47wwt17336moonfs3web3api14ext4__size__of(img, sb, e.inode);
        if (!first) {
          out = `${out},`;
        }
        first = false;
        const _tmp$2 = out;
        const _tmp$3 = _M0FP47wwt17336moonfs3web3api5quote(e.name);
        const _tmp$4 = _M0MPC15int645Int6418to__string_2einner(size, 10);
        const _p = e.file_type === 2;
        out = `${_tmp$2}{\"n\":${_tmp$3},\"s\":${_tmp$4},\"d\":${_p ? "true" : "false"}}`;
        break _L$3;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return `${out}]`;
}
function _M0FP47wwt17336moonfs3web3api13ntfs__resolve(img, vol, mft, path) {
  let current = 5n;
  const _bind = _M0FP47wwt17336moonfs3web3api11split__path(path);
  const _bind$2 = _bind.len;
  const _bind$3 = _bind.buf;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const seg = _bind$3[_];
      let entries;
      let _try_err;
      _L: {
        _L$2: {
          const _bind$4 = _M0FP47wwt17336moonfs3src4ntfs15list__directory(img, vol, mft, current);
          if (_bind$4.$tag === 1) {
            const _ok = _bind$4;
            entries = _ok._0;
          } else {
            const _err = _bind$4;
            _try_err = _err._0;
            break _L$2;
          }
          break _L;
        }
        return undefined;
      }
      let next = undefined;
      const _bind$4 = entries.len;
      const _bind$5 = entries.buf;
      let _tmp$2 = 0;
      while (true) {
        const _$2 = _tmp$2;
        if (_$2 < _bind$4) {
          const e = _bind$5[_$2];
          if (e.name === seg) {
            next = e.record_number;
          }
          _tmp$2 = _$2 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const _bind$6 = next;
      if (_bind$6 === undefined) {
        return undefined;
      } else {
        const _Some = _bind$6;
        const _n = _Some;
        current = _n;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return current;
}
function _M0FP47wwt17336moonfs3web3api16ntfs__list__json(img, vol, path) {
  let mft;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src4ntfs3Mft4open(img, vol);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        mft = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return "[]";
  }
  const _bind = _M0FP47wwt17336moonfs3web3api13ntfs__resolve(img, vol, mft, path);
  let number;
  if (_bind === undefined) {
    return "[]";
  } else {
    const _Some = _bind;
    number = _Some;
  }
  let entries;
  let _try_err$2;
  _L$2: {
    _L$3: {
      const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs15list__directory(img, vol, mft, number);
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        entries = _ok._0;
      } else {
        const _err = _bind$2;
        _try_err$2 = _err._0;
        break _L$3;
      }
      break _L$2;
    }
    return "[]";
  }
  let out = "[";
  const _bind$2 = entries.len;
  const _bind$3 = entries.buf;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind$2) {
      const e = _bind$3[i];
      if (i > 0) {
        out = `${out},`;
      }
      const _tmp$2 = out;
      const _tmp$3 = _M0FP47wwt17336moonfs3web3api5quote(e.name);
      const _tmp$4 = _M0MPC15int645Int6418to__string_2einner(e.logical_size, 10);
      const _p = BigInt.asUintN(64, BigInt.asUintN(64, e.flags & 268435456n)) !== BigInt.asUintN(64, 0n);
      out = `${_tmp$2}{\"n\":${_tmp$3},\"s\":${_tmp$4},\"d\":${_p ? "true" : "false"}}`;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return `${out}]`;
}
function _M0FP47wwt17336moonfs3web3api10list__json(img, fs, path) {
  if (fs.$tag === 0) {
    const _Ntfs = fs;
    const _vol = _Ntfs._0;
    return _M0FP47wwt17336moonfs3web3api16ntfs__list__json(img, _vol, path);
  } else {
    const _Ext4 = fs;
    const _sb = _Ext4._0;
    return _M0FP47wwt17336moonfs3web3api16ext4__list__json(img, _sb, path);
  }
}
function _M0FP47wwt17336moonfs3web3api8describe(data) {
  let img;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image19from__bytes_2einner(data, 512);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        img = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0FP47wwt17336moonfs3web3api9err__json("无法把这个文件当成磁盘镜像：长度或扇区大小不合法");
  }
  const found = _M0FP47wwt17336moonfs3web3api13find__volumes(img);
  if (found.len === 0) {
    return _M0FP47wwt17336moonfs3web3api9err__json("没有找到 NTFS 或 ext4 卷。支持裸卷与 MBR / GPT 分区表镜像。");
  }
  let out = `{\"ok\":true,\"size\":${_M0MPC15int645Int6418to__string_2einner(BigInt.asUintN(64, BigInt(img.data.length)), 10)},\"volumes\":[`;
  const _bind = found.len;
  const _bind$2 = found.buf;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      const f = _bind$2[i];
      if (i > 0) {
        out = `${out},`;
      }
      out = `${out}{\"i\":${_M0MPC13int3Int18to__string_2einner(i, 10)},\"start\":${_M0MPC15int645Int6418to__string_2einner(f.start_lba, 10)},\"fs\":${_M0FP47wwt17336moonfs3web3api5quote(_M0FP47wwt17336moonfs3web3api8fs__name(f.fs))},\"label\":${_M0FP47wwt17336moonfs3web3api5quote(_M0FP47wwt17336moonfs3web3api9fs__label(f.fs))},\"root\":${_M0FP47wwt17336moonfs3web3api10list__json(img, f.fs, "/")}}`;
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return `${out}]}`;
}
function _M0FP47wwt17336moonfs3web3api3nth(found, i) {
  if (i < 0 || i >= found.len) {
    return undefined;
  }
  if (i < 0 || i >= found.len) {
    $panic();
  }
  return found.buf[i];
}
function _M0FP47wwt17336moonfs3web3api4list(data, volume, path) {
  let img;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image19from__bytes_2einner(data, 512);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        img = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0FP47wwt17336moonfs3web3api9err__json("镜像不合法");
  }
  const found = _M0FP47wwt17336moonfs3web3api13find__volumes(img);
  const _bind = _M0FP47wwt17336moonfs3web3api3nth(found, volume);
  let f;
  if (_bind === undefined) {
    return _M0FP47wwt17336moonfs3web3api9err__json("卷序号越界");
  } else {
    const _Some = _bind;
    f = _Some;
  }
  return `{\"ok\":true,\"path\":${_M0FP47wwt17336moonfs3web3api5quote(path)},\"entries\":${_M0FP47wwt17336moonfs3web3api10list__json(img, f.fs, path)}}`;
}
function _M0FP47wwt17336moonfs3web3api3hex(data) {
  const buf = _M0MPB13StringBuilder21StringBuilder_2einner(8);
  const _bind = data.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const b = data[_];
      _M0IPB13StringBuilderPB6Logger13write__string(buf, _M0MPC14byte4Byte7to__hex(b));
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return buf.val;
}
function _M0FP47wwt17336moonfs3web3api11looks__text(data) {
  const n = data.length;
  if (n === 0) {
    return true;
  }
  let bad = 0;
  const _bind = data.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const b = data[_];
      const v = b;
      if (v === 0) {
        return false;
      }
      if (v < 9 || v > 13 && v < 32) {
        bad = bad + 1 | 0;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return (Math.imul(bad, 20) | 0) <= n;
}
function _M0FP47wwt17336moonfs3web3api10read__path(img, fs, path) {
  if (fs.$tag === 0) {
    const _Ntfs = fs;
    const _vol = _Ntfs._0;
    let mft;
    let _try_err;
    _L: {
      _L$2: {
        const _bind = _M0MP47wwt17336moonfs3src4ntfs3Mft4open(img, _vol);
        if (_bind.$tag === 1) {
          const _ok = _bind;
          mft = _ok._0;
        } else {
          const _err = _bind;
          _try_err = _err._0;
          break _L$2;
        }
        break _L;
      }
      return new _M0DTPB6ResultGzsE3Err(_M0FP47wwt17336moonfs3src4ntfs15describe__error(_try_err));
    }
    const _bind = _M0FP47wwt17336moonfs3web3api13ntfs__resolve(img, _vol, mft, path);
    let number;
    if (_bind === undefined) {
      return new _M0DTPB6ResultGzsE3Err(`路径不存在：${path}`);
    } else {
      const _Some = _bind;
      number = _Some;
    }
    let body;
    let _try_err$2;
    _L$2: {
      _L$3: {
        const _bind$2 = _M0FP47wwt17336moonfs3src4ntfs10read__file(img, _vol, mft, number);
        if (_bind$2.$tag === 1) {
          const _ok = _bind$2;
          body = _ok._0;
        } else {
          const _err = _bind$2;
          _try_err$2 = _err._0;
          break _L$3;
        }
        break _L$2;
      }
      return new _M0DTPB6ResultGzsE3Err(_M0FP47wwt17336moonfs3src4ntfs15describe__error(_try_err$2));
    }
    return new _M0DTPB6ResultGzsE2Ok(body);
  } else {
    const _Ext4 = fs;
    const _sb = _Ext4._0;
    let inode;
    let _try_err;
    _L: {
      _L$2: {
        const _bind = _M0FP47wwt17336moonfs3web3api13ext4__resolve(img, _sb, path);
        if (_bind.$tag === 1) {
          const _ok = _bind;
          inode = _ok._0;
        } else {
          const _err = _bind;
          _try_err = _err._0;
          break _L$2;
        }
        break _L;
      }
      return new _M0DTPB6ResultGzsE3Err(`路径不存在：${path}`);
    }
    let body;
    let _try_err$2;
    _L$2: {
      _L$3: {
        const _bind = _M0FP47wwt17336moonfs3src4ext417read__inode__data(img, _sb, inode);
        if (_bind.$tag === 1) {
          const _ok = _bind;
          body = _ok._0;
        } else {
          const _err = _bind;
          _try_err$2 = _err._0;
          break _L$3;
        }
        break _L$2;
      }
      return new _M0DTPB6ResultGzsE3Err(_M0FP47wwt17336moonfs3src4ext415describe__error(_try_err$2));
    }
    return new _M0DTPB6ResultGzsE2Ok(body);
  }
}
function _M0FP47wwt17336moonfs3web3api4read(data, volume, path, max) {
  let img;
  let _try_err;
  _L: {
    _L$2: {
      const _bind = _M0MP47wwt17336moonfs3src5block5Image19from__bytes_2einner(data, 512);
      if (_bind.$tag === 1) {
        const _ok = _bind;
        img = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L$2;
      }
      break _L;
    }
    return _M0FP47wwt17336moonfs3web3api9err__json("镜像不合法");
  }
  const found = _M0FP47wwt17336moonfs3web3api13find__volumes(img);
  const _bind = _M0FP47wwt17336moonfs3web3api3nth(found, volume);
  let f;
  if (_bind === undefined) {
    return _M0FP47wwt17336moonfs3web3api9err__json("卷序号越界");
  } else {
    const _Some = _bind;
    f = _Some;
  }
  const cap = max <= 0 ? 4096 : max > 65536 ? 65536 : max;
  const _bind$2 = _M0FP47wwt17336moonfs3web3api10read__path(img, f.fs, path);
  let body;
  if (_bind$2.$tag === 1) {
    const _Ok = _bind$2;
    body = _Ok._0;
  } else {
    const _Err = _bind$2;
    const _msg = _Err._0;
    return _M0FP47wwt17336moonfs3web3api9err__json(_msg);
  }
  const total = body.length;
  const shown = total > cap ? cap : total;
  let head;
  let _try_err$2;
  _L$2: {
    _L$3: {
      const _bind$3 = _M0FP47wwt17336moonfs3src5binio5slice(body, 0, shown);
      if (_bind$3.$tag === 1) {
        const _ok = _bind$3;
        head = _ok._0;
      } else {
        const _err = _bind$3;
        _try_err$2 = _err._0;
        break _L$3;
      }
      break _L$2;
    }
    head = body;
  }
  const payload = _M0FP47wwt17336moonfs3web3api11looks__text(head) ? { _0: "text", _1: _M0FP47wwt17336moonfs3web3api5quote(_M0FPC28encoding4utf821decode__lossy_2einner(new _M0TPC15bytes9BytesView(head, 0, head.length), false)) } : { _0: "binary", _1: _M0FP47wwt17336moonfs3web3api5quote(_M0FP47wwt17336moonfs3web3api3hex(head)) };
  return `{\"ok\":true,\"size\":${_M0MPC13int3Int18to__string_2einner(total, 10)},\"shown\":${_M0MPC13int3Int18to__string_2einner(shown, 10)},\"kind\":\"${payload._0}\",\"data\":${payload._1}}`;
}
(() => {
  _M0FP47wwt17336moonfs3web3api16expose__describe(_M0FP47wwt17336moonfs3web3api8describe);
  _M0FP47wwt17336moonfs3web3api12expose__list(_M0FP47wwt17336moonfs3web3api4list);
  _M0FP47wwt17336moonfs3web3api12expose__read(_M0FP47wwt17336moonfs3web3api4read);
})();
