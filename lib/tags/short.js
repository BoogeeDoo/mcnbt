/**
 * XadillaX created at 2015-07-31 17:35:46 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGShort = function() {
    BaseTag.call(this);
    this.type = "TAG_Short";
};

util.inherits(TAGShort, BaseTag);

TAGShort.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt16BE(offset);
    return 2;
};

TAGShort.prototype.calcBufferLength = BaseTag._returnSize(2);

TAGShort.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt16BE(this.value, offset);
    return 2;
};

TAGShort.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -32768 || value > 32767 || isNaN(value)) {
        throw new Error("Value of TAG_Short should between -32768 and 32767.");
    }
    this.value = value;
};

module.exports = TAGShort;
