/**
 * XadillaX created at 2015-07-31 17:37:18 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGInt = function() {
    BaseTag.call(this);
    this.type = "TAG_Int";
};

util.inherits(TAGInt, BaseTag);

TAGInt.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt32BE(offset);
    return 4;
};

TAGInt.prototype.calcBufferLength = BaseTag._returnSize(4);

TAGInt.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt32BE(this.value, offset);
    return 4;
};

TAGInt.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Value of TAG_Int should between -2147483648 and 2147483647.");
    }
    this.value = value;
};

module.exports = TAGInt;
