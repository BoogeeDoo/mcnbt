/**
 * XadillaX created at 2015-07-31 17:38:12 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");
var Long = require("long");

var TAGLong = function() {
    BaseTag.call(this);
    this.type = "TAG_Long";
};

util.inherits(TAGLong, BaseTag);

TAGLong.prototype._readBodyFromBuffer = function(buff, offset) {
    var sliced = buff.slice(offset, offset + 8);
    this.value = Long.fromBytesBE(sliced, true);
    return 8;
};

TAGLong.prototype.calcBufferLength = BaseTag._returnSize(8);

TAGLong.prototype.writeBuffer = function(buff, offset) {
    var bytes = this.value.toBytesBE();
    for(var i = 0, j = offset; i < 8; i++, j++) {
        buff.writeUInt8(bytes[i], j);
    }
    return 8;
};

var _longBound = {
    min: Long.fromString("-9223372036854775808"),
    max: Long.fromString("9223372036854775807")
};

TAGLong.prototype.toJSON = function() {
    return this.value.toString();
};

TAGLong.prototype.setValue = function(value) {
    var temp = -1;
    if(typeof value === "string") {
        temp = new Long(value);
    } else if(value instanceof Long) {
        temp = Long.fromString(value.toString());
    } else if(typeof value === "number" && !isNaN(value)) {
        temp = Long.fromNumber(value);
    }

    if(-1 === temp) {
        throw new Error("Wrong type to set TAG_Long's value.");
    }

    if(temp.lessThan(_longBound.min) || temp.greaterThan(_longBound.max)) {
        throw new Error("Value of TAG_Long should between " +
                        "-9223372036854775808 and 9223372036854775807");
    }

    this.value = temp;
};

module.exports = TAGLong;
