/**
 * XadillaX created at 2015-07-31 17:38:12 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");
var bignum = require("bignum");

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

TAGLong.prototype.calcBufferLength = BaseTag._returnSize(8);

TAGLong.prototype.writeBuffer = function(buff, offset) {
    this.value.toBuffer({ endian: "big", size: 8 }).copy(buff, offset);
    return 8;
};

var _longBound = {
    min: bignum("-9223372036854775808"),
    max: bignum("9223372036854775807")
};

TAGLong.prototype.setValue = function(value) {
    var temp = -1;
    if(typeof value === "string") {
        temp = bignum(value);
    } else if(value instanceof bignum) {
        temp = value;
    } else if(typeof value === "number" && !isNaN(value)) {
        temp = bignum(value);
    }

    if(-1 === temp) {
        throw new Error("Wrong type to set TAG_Long's value.");
    }

    if(temp.lt(_longBound.min) || temp.gt(_longBound.max)) {
        throw new Error("Value of TAG_Long should between " +
                        "-9223372036854775808 and 9223372036854775807");
    }

    this.value = temp;
};

module.exports = TAGLong;
