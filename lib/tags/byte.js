/**
 * XadillaX created at 2015-07-31 17:31:49 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGByte = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte";
};

util.inherits(TAGByte, BaseTag);

TAGByte.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt8(offset);
    return 1;
};

TAGByte.prototype.calcBufferLength = BaseTag._returnSize(1);

TAGByte.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt8(this.value, offset);
    return 1;
};

TAGByte.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Value of TAG_Byte should between -128 and 127.");
    }
    this.value = value;
};

module.exports = TAGByte;
