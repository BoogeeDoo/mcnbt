/**
 * XadillaX created at 2015-07-31 17:40:33 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGFloat = function() {
    BaseTag.call(this);
    this.type = "TAG_Float";
};

util.inherits(TAGFloat, BaseTag);

TAGFloat.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readFloatBE(offset);
    return 4;
};

TAGFloat.prototype.calcBufferLength = BaseTag._returnSize(4);

TAGFloat.prototype.writeBuffer = function(buff, offset) {
    buff.writeFloatBE(this.value, offset);
    return 4;
};

TAGFloat.prototype.setValue = function(value) {
    value = parseFloat(value);
    if(value < -3.4e+38 || value > 3.4e+38 || isNaN(value)) {
        throw new Error("Value of TAG_Float should between -3.4E+38 and 3.4E+38.");
    }
    this.value = value;
};

module.exports = TAGFloat;
