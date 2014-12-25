/**
 * XadillaX created at 2014-12-24 15:18:45
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var BaseTag = require("./base");
var util = require("util");
var bignum = require("bignum");

var TAGByte = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte";
};

util.inherits(TAGByte, BaseTag);

TAGByte.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt8(offset);
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

var TAGInt = function() {
    BaseTag.call(this);
    this.type = "TAG_Int";
};

util.inherits(TAGInt, BaseTag);

TAGInt.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt32BE(offset);
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

var TAGFloat = function() {
    BaseTag.call(this);
    this.type = "TAG_Float";
};

util.inherits(TAGFloat, BaseTag);

TAGFloat.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readFloatBE(offset);
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
        throw new Error("Tag type " + typeId + " is not supported yet in " +
                        "list.");
    } else if(0 === typeId) {
        this.value = [];
        return 1 + 4;
    }

    this.value = [];
    var nextOffset = offset + 1 + 4;
    for(var i = 0; i < len; i++) {
        var element = new Tag();
        var elementLength = element._readBodyFromBuffer(buff, nextOffset);
        nextOffset += elementLength;

        this.value.push(element);
    }

    return nextOffset - offset;
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
        throw new Error("Tag type " + tagType + " is not supported by this " +
                        "module yet.");
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

module.exports = {
    TAGByte      : TAGByte,
    TAGShort     : TAGShort,
    TAGInt       : TAGInt,
    TAGLong      : TAGLong,
    TAGFloat     : TAGFloat,
    TAGDouble    : TAGDouble,
    TAGByteArray : TAGByteArray,
    TAGString    : TAGString,
    TAGList      : TAGList,
    TAGCompound  : TAGCompound,
    TAGIntArray  : TAGIntArray,

    "1"          : TAGByte,
    "2"          : TAGShort,
    "3"          : TAGInt,
    "4"          : TAGLong,
    "5"          : TAGFloat,
    "6"          : TAGDouble,
    "7"          : TAGByteArray,
    "8"          : TAGString,
    "9"          : TAGList,
    "10"         : TAGCompound,
    "11"         : TAGIntArray
};

