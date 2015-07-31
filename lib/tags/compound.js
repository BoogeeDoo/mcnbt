/**
 * XadillaX created at 2015-07-31 17:51:19 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");

var TAGCompound = function() {
    BaseTag.call(this);
    this.type = "TAG_Compound";
};

util.inherits(TAGCompound, BaseTag);

TAGCompound.prototype._getNextTag = function(buff, offset) {
    var tagType = buff.readUInt8(offset);
    if(tagType < 0) {
        throw new Error("Unknown tag type - " + tagType + ".");
    }

    if(tagType === 0) {
        return -1;
    }

    var Tags = require("../tags");
    var Tag = Tags[tagType];
    if(null === Tag || undefined === Tag) {
        throw new Error("Tag type " + tagType + " is not supported by this module yet.");
    }

    var tag = new Tag();
    var len = tag.readFromBuffer(buff, offset);
    this.value[tag.id] = tag;
    return len;
};

TAGCompound.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = {};

    var nextOffset = offset;
    while(true) {
        var len = this._getNextTag(buff, nextOffset);
        if(len === -1) break;
        nextOffset += len;
    }

    return nextOffset - offset + 1;
};

TAGCompound.prototype.calcBufferLength = function() {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        // child type id for 1 byte, child name length for 2 bytes and child
        // name for (child name length) byte(s).
        len += 1;
        len += 2;
        len += Buffer.byteLength(this.value[key].id, "utf8");

        // add the child body's length
        len += this.value[key].calcBufferLength();
    }

    // TAG_End
    len += 1;

    return len;
};

TAGCompound.prototype.writeBuffer = function(buff, offset) {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        var object = this.value[key];
        buff.writeUInt8(object.getTypeId(), offset + len);
        
        var nameBuff = new Buffer(object.id, "utf8");
        nameBuff.copy(buff, offset + len + 1 + 2);
        buff.writeUInt16BE(nameBuff.length, offset + len + 1);

        len += object.writeBuffer(buff, offset + len + 1 + 2 + nameBuff.length);
        len += (1 + 2 + nameBuff.length);
    }

    buff.writeUInt8(0, offset + len);
    len += 1;
    return len;
};

TAGCompound.prototype.setValue = function(value) {
    if(typeof value !== "object") {
        throw new Error("Invalid TAG_Compound value.");
    }

    var res = {};
    for(var key in value) {
        if(!value.hasOwnProperty(key)) continue;
        var object = value[key];
        if(!(object instanceof BaseTag)) {
            throw new Error("Invalid TAG_Compound element in key \"" + key + "\".");
        }

        res[key] = value;
    }

    this.value = res;
};

TAGCompound.prototype.setByName = function(name, value, replace) {
    if(this.value[name] !== undefined && !replace) {
        throw new Error("Existing TAG_Compound value's name.");
    }

    if(typeof value !== "object") {
        throw new Error("Invalid TAG_Compound value.");
    }

    if(!(value instanceof BaseTag)) {
        throw new Error("Invalid TAG_Compound element.");
    }

    this.value[name] = value;
};

TAGCompound.prototype.getNames = function() {
    return Object.keys(this.value);
};

TAGCompound.prototype.deleteByName = function(name) {
    delete this.value[name];
};

TAGCompound.prototype.clean = function() {
    this.value = {};
};

module.exports = TAGCompound;
