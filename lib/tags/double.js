/**
 * XadillaX created at 2015-07-31 17:42:26 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGDouble = function() {
    BaseTag.call(this);
    this.type = "TAG_Double";
};

util.inherits(TAGDouble, BaseTag);

TAGDouble.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readDoubleBE(offset);
    return 8;
};

TAGDouble.prototype.calcBufferLength = BaseTag._returnSize(8);

TAGDouble.prototype.writeBuffer = function(buff, offset) {
    buff.writeDoubleBE(this.value, offset);
    return 8;
};

TAGDouble.prototype.setValue = function(value) {
    value = parseFloat(value);
    if(isNaN(value)) {
        throw new Error("Bad value for TAG_Double.");
    }
    this.value = value;
};

module.exports = TAGDouble;
