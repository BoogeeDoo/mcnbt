/**
 * XadillaX created at 2015-07-31 17:44:01 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

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

TAGByteArray.prototype.setValue = function(array) {
    if(!util.isArray(array)) {
        throw new Error("Value of TAG_Byte_Array should be an array.");
    }

    var newArray = [];
    for(var i = 0; i < array.length; i++) {
        newArray.push(parseInt(array[i]));
        if(newArray[i] < -128 || newArray[i] > 127 || isNaN(newArray[i])) {
            throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
        }
    }

    this.value = newArray;
};

TAGByteArray.prototype.shift = function() {
    return this.value.shift();
};

TAGByteArray.prototype.unshift = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    return this.value.unshift(value);
};

TAGByteArray.prototype.push = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    return this.value.push(value);
};

TAGByteArray.prototype.pop = function() {
    return this.value.pop();
};

TAGByteArray.prototype.insert = function(value, pos) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

module.exports = TAGByteArray;
