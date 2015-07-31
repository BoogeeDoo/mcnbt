/**
 * XadillaX created at 2015-07-31 17:53:32 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

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

TAGIntArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length * 4;
};

TAGIntArray.prototype.setValue = function(array) {
    if(!util.isArray(array)) {
        throw new Error("Value of TAG_Int_Array should be an array.");
    }

    var newArray = [];
    for(var i = 0; i < array.length; i++) {
        newArray.push(parseInt(array[i]));
        if(newArray[i] < -2147483648 || newArray[i] > 2147483647 || isNaN(newArray[i])) {
            throw new Error("Each element in TAG_Int_Array should between " + 
                            "-2147483648 and 2147483647.");
        }
    }

    this.value = newArray;
};

TAGIntArray.prototype.shift = function() {
    return this.value.shift();
};

TAGIntArray.prototype.unshift = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    return this.value.unshift(value);
};

TAGIntArray.prototype.push = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    return this.value.push(value);
};

TAGIntArray.prototype.pop = function() {
    return this.value.pop();
};

TAGIntArray.prototype.insert = function(value, pos) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

TAGIntArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeInt32BE(this.value[i], offset + 4 + i * 4);
    }

    return 4 + this.value.length * 4;
};

module.exports = TAGIntArray;
