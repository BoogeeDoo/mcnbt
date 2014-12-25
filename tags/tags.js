/**
 * XadillaX created at 2014-12-24 15:18:45
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var BaseTag = require("./base");
var util = require("util");
var bignum = require("bignum");

var _returnSize = function(size) {
    return function() { return size; };
};

var TAGByte = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte";
};

util.inherits(TAGByte, BaseTag);

TAGByte.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt8(offset);
    return 1;
};

TAGByte.prototype.calcBufferLength = _returnSize(1);

TAGByte.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt8(this.value, offset);
    return 1;
};

var TAGShort = function() {
    BaseTag.call(this);
    this.type = "TAG_Short";
};

util.inherits(TAGShort, BaseTag);

TAGShort.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt16BE(offset);
    return 2;
};

TAGShort.prototype.calcBufferLength = _returnSize(2);

TAGShort.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt16BE(this.value, offset);
    return 2;
};

var TAGInt = function() {
    BaseTag.call(this);
    this.type = "TAG_Int";
};

util.inherits(TAGInt, BaseTag);

TAGInt.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt32BE(offset);
    return 4;
};

TAGInt.prototype.calcBufferLength = _returnSize(4);

TAGInt.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt32BE(this.value, offset);
    return 4;
};

var TAGLong = function() {
    BaseTag.call(this);
    this.type = "TAG_Long";
};

util.inherits(TAGLong, BaseTag);

TAGLong.prototype._readBodyFromBuffer = function(buff, offset) {
    var sliced = buff.slice(offset, offset + 8);
    this.value = bignum.fromBuffer(sliced, { size: 8 });
    return 8;
};

TAGLong.prototype.calcBufferLength = _returnSize(8);

TAGLong.prototype.writeBuffer = function(buff, offset) {
    this.value.toBuffer({ endian: "big", size: 8 }).copy(buff, offset);
    return 8;
};

var TAGFloat = function() {
    BaseTag.call(this);
    this.type = "TAG_Float";
};

util.inherits(TAGFloat, BaseTag);

TAGFloat.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readFloatBE(offset);
    return 4;
};

TAGFloat.prototype.calcBufferLength = _returnSize(4);

TAGFloat.prototype.writeBuffer = function(buff, offset) {
    buff.writeFloatBE(this.value, offset);
    return 4;
};

var TAGDouble = function() {
    BaseTag.call(this);
    this.type = "TAG_Double";
};

util.inherits(TAGDouble, BaseTag);

TAGDouble.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readDoubleBE(offset);
    return 8;
};

TAGDouble.prototype.calcBufferLength = _returnSize(8);

TAGDouble.prototype.writeBuffer = function(buff, offset) {
    buff.writeDoubleBE(this.value, offset);
    return 8;
};

var TAGByteArray = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte_Array";
};

util.inherits(TAGByteArray, BaseTag);

TAGByteArray.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt32BE(offset);
    var nextOffset = offset + 4;
    var endOffset  = nextOffset + len;
    this.value     = [];

    for(var i = nextOffset; i < endOffset; i++) {
        this.value.push(buff.readInt8(i));
    }

    return 4 + len;
};

TAGByteArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length;
};

TAGByteArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeInt8(this.value[i], offset + 4 + i);
    }

    return 4 + this.value.length;
};

var TAGString = function() {
    BaseTag.call(this);
    this.type = "TAG_String";
};

util.inherits(TAGString, BaseTag);

TAGString.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt16BE(offset);
    var nextOffset = offset + 2;
    this.value     = buff.toString("utf8", nextOffset, nextOffset + len);
    return 2 + len;
};

TAGString.prototype.calcBufferLength = function() {
    return 2 + Buffer.byteLength(this.value, "utf8");
};

TAGString.prototype.writeBuffer = function(buff, offset) {
    var strBuff = new Buffer(this.value, "utf8");

    strBuff.copy(buff, offset + 2);
    buff.writeUInt16BE(strBuff.length, offset);

    return 2 + strBuff.length;
};

var TAGList = function() {
    BaseTag.call(this);
    this.type = "TAG_List";
};

util.inherits(TAGList, BaseTag);

TAGList.prototype._readBodyFromBuffer = function(buff, offset) {
    var typeId = buff.readUInt8(offset);
    var len = buff.readUInt32BE(offset + 1);

    var Tag = module.exports[typeId];
    if((null === Tag || undefined === Tag) && 0 !== typeId) {
        throw new Error("Tag type " + typeId + " is not supported yet in list.");
    }

    this.value = [];
    var nextOffset = offset + 1 + 4;
    for(var i = 0; i < len; i++) {
        var element = (typeId === 0) ? undefined : new Tag();
        var elementLength = (typeId === 0) ? 0 : element._readBodyFromBuffer(buff, nextOffset);
        nextOffset += elementLength;

        this.value.push(element);
    }

    return nextOffset - offset;
};

TAGList.prototype.calcBufferLength = function() {
    return this.value.reduce(function(sum, child) {
        return sum + child.calcBufferLength();
    }, 1 + 4);
};

TAGList.prototype.writeBuffer = function(buff, offset) {
    // no element
    if(!this.value.length) {
        buff.writeUInt8(0, offset);
        buff.writeUInt32BE(0, offset + 1);
        return 1 + 4;
    }

    buff.writeUInt8(this.value[0].getTypeId(), offset);
    buff.writeUInt32BE(this.value.length, offset + 1);
    var len = 0;
    var baseOffset = offset + 1 + 4;
    for(var i = 0; i < this.value.length; i++) {
        len += this.value[i].writeBuffer(buff, baseOffset + len);
    }

    return len + 1 + 4;
};

var TAGCompound = function() {
    BaseTag.call(this);
    this.type = "TAG_Compound";
};

util.inherits(TAGCompound, BaseTag);

TAGCompound.prototype._getNextTag = function(buff, offset) {
    var tagType = buff.readUInt8(offset);
    if(tagType < 0) {
        throw new Error("Unknown tag type - " + tagType + ".");
    }

    if(tagType === 0) {
        return -1;
    }

    var Tag = module.exports[tagType];
    if(null === Tag || undefined === Tag) {
        throw new Error("Tag type " + tagType + " is not supported by this module yet.");
    }

    var tag = new Tag();
    var len = tag.readFromBuffer(buff, offset);
    this.value[tag.id] = tag;
    return len;
};

TAGCompound.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = {};

    var nextOffset = offset;
    while(true) {
        var len = this._getNextTag(buff, nextOffset);
        if(len === -1) break;
        nextOffset += len;
    }

    return nextOffset - offset + 1;
};

TAGCompound.prototype.calcBufferLength = function() {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        // child type id for 1 byte, child name length for 2 bytes and child
        // name for (child name length) byte(s).
        len += 1;
        len += 2;
        len += Buffer.byteLength(this.value[key].id, "utf8");

        // add the child body's length
        len += this.value[key].calcBufferLength();
    }

    // TAG_End
    len += 1;

    return len;
};

TAGCompound.prototype.writeBuffer = function(buff, offset) {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        var object = this.value[key];
        buff.writeUInt8(object.getTypeId(), offset + len);
        
        var nameBuff = new Buffer(object.id, "utf8");
        nameBuff.copy(buff, offset + len + 1 + 2);
        buff.writeUInt16BE(nameBuff.length, offset + len + 1);

        len += object.writeBuffer(buff, offset + len + 1 + 2 + nameBuff.length);
        len += (1 + 2 + nameBuff.length);
    }

    buff.writeUInt8(0, offset + len);
    len += 1;
    return len;
};

var TAGIntArray = function() {
    BaseTag.call(this);
    this.type = "TAG_Int_Array";
};

util.inherits(TAGIntArray, BaseTag);

TAGIntArray.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt32BE(offset);
    var nextOffset = offset + 4;
    var endOffset  = nextOffset + len * 4;
    this.value     = [];

    for(var i = nextOffset; i < endOffset; i += 4) {
        this.value.push(buff.readInt32BE(i));
    }

    return 4 + len * 4;
};

TAGIntArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length * 4;
};

TAGIntArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeInt32BE(this.value[i], offset + 4 + i * 4);
    }

    return 4 + this.value.length * 4;
};

module.exports = {
    // Class name -> Class
    TAGByte        : TAGByte,
    TAGShort       : TAGShort,
    TAGInt         : TAGInt,
    TAGLong        : TAGLong,
    TAGFloat       : TAGFloat,
    TAGDouble      : TAGDouble,
    TAGByteArray   : TAGByteArray,
    TAGString      : TAGString,
    TAGList        : TAGList,
    TAGCompound    : TAGCompound,
    TAGIntArray    : TAGIntArray,

    // Class id -> Class
    "1"            : TAGByte,
    "2"            : TAGShort,
    "3"            : TAGInt,
    "4"            : TAGLong,
    "5"            : TAGFloat,
    "6"            : TAGDouble,
    "7"            : TAGByteArray,
    "8"            : TAGString,
    "9"            : TAGList,
    "10"           : TAGCompound,
    "11"           : TAGIntArray,

    // Tag name -> Class id
    TAG_Byte       : 1,
    TAG_Short      : 2,
    TAG_Int        : 3,
    TAG_Long       : 4,
    TAG_Float      : 5,
    TAG_Double     : 6,
    TAG_Byte_Array : 7,
    TAG_String     : 8,
    TAG_List       : 9,
    TAG_Compound   : 10,
    TAG_Int_Array  : 11
};

