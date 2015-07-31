/**
 * XadillaX created at 2015-07-31 17:46:48 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

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

TAGString.prototype.setValue = function(value) {
    if(typeof value !== "string") value = value.toString();
    if(value.length > 65536) {
        throw new Error("Value of TAG_String's length should greater than 65536.");
    }
    this.value = value;
};

module.exports = TAGString;
