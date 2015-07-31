/**
 * XadillaX created at 2015-07-31 17:50:24 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGList = function() {
    BaseTag.call(this);
    this.type = "TAG_List";
    this.childType = "TAG_End";
};

util.inherits(TAGList, BaseTag);

TAGList.prototype._readBodyFromBuffer = function(buff, offset) {
    var typeId = buff.readUInt8(offset);
    var len = buff.readUInt32BE(offset + 1);

    var Tag = module.exports[typeId];
    if((null === Tag || undefined === Tag) && 0 !== typeId) {
        throw new Error("Tag type " + typeId + " is not supported yet in list.");
    }

    if(0 !== typeId) {
        for(var key in module.exports) {
            if(!module.exports.hasOwnProperty(key)) continue;
            if(module.exports[key] === typeId) {
                this.childType = key;
            }
        }
    }

    this.value = [];
    var nextOffset = offset + 1 + 4;
    for(var i = 0; i < len; i++) {
        var element = (typeId === 0) ? undefined : new Tag();
        var elementLength = (typeId === 0) ? 0 : element._readBodyFromBuffer(buff, nextOffset);
        nextOffset += elementLength;

        this.value.push(element);
    }

    return nextOffset - offset;
};

TAGList.prototype.calcBufferLength = function() {
    return this.value.reduce(function(sum, child) {
        return sum + child.calcBufferLength();
    }, 1 + 4);
};

TAGList.prototype.setValue = function(value) {
    if(!util.isArray(value)) {
        throw new Error("Value of TAG_List should be an array.");
    }

    if(value.length === 0) {
        this.value = value;
        return;
    }

    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value[0].type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    var array = [];
    for(var i = 0; i < value.length; i++) {
        if(!(value[i] instanceof TagType)) {
            throw new Error("Inconsistent TAG_List element type at position " + i + ".");
        }

        array.push(value[i]);
    }

    this.childType = typeName;
    this.value = array;
};

TAGList.prototype.shift = function() {
    return this.value.shift();
};

TAGList.prototype.unshift = function(value) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    this.childType = typeName;
    return this.value.unshift(value);
};

TAGList.prototype.push = function(value) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    this.childType = typeName;
    return this.value.push(value);
};

TAGList.prototype.pop = function() {
    return this.value.pop();
};

TAGList.prototype.insert = function(value, pos) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

TAGList.prototype.clean = function() {
    this.value = [];
};

TAGList.prototype.writeBuffer = function(buff, offset) {
    // no element
    if(!this.value.length) {
        buff.writeUInt8(0, offset);
        buff.writeUInt32BE(0, offset + 1);
        return 1 + 4;
    }

    buff.writeUInt8(this.value[0].getTypeId(), offset);
    buff.writeUInt32BE(this.value.length, offset + 1);
    var len = 0;
    var baseOffset = offset + 1 + 4;
    for(var i = 0; i < this.value.length; i++) {
        len += this.value[i].writeBuffer(buff, baseOffset + len);
    }

    return len + 1 + 4;
};

module.exports = TAGList;
