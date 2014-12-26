/**
 * XadillaX created at 2014-12-24 14:56:33
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var Bignum = require("bignum");
var util = require("util");
var TAG_TYPE_OFFSET = 1;
var _tagIds;

/**
 * generate tag ids table (id -> prototype)
 * @return {Object} the map table
 */
function _generateTagIds() {
    if(!_tagIds) {
        _tagIds = require("./tags");
    }

    return _tagIds;
}

/**
 * Base Tag Class
 * @constructor
 */
var BaseTag = function() {
    this.type  = "";
    this.id    = "";
    this.value = undefined;
};

/**
 * read body information from buffer (private & to be inherited)
 * @param {Buffer} buff the binary buffer data
 * @param {Number} offset offset in buffer
 * @return {Number} the whole body byte length
 */
BaseTag.prototype._readBodyFromBuffer = function(buff, offset) {
    // To be inherited.
    var _ = buff;
    _ = offset;
    return 0;
};

/**
 * read name information from buffer (private)
 * @param {Buffer} buff the binary buffer data
 * @param {Number} offset offset in buffer
 * @return {Number} the whole name column byte length
 */
BaseTag.prototype._readNameFromBuffer = function(buff, offset) {
    var nameLength = buff.readUInt16BE(offset);
    var name = buff.toString("utf8", offset + 2, offset + 2 + nameLength);
    this.id = name;

    return nameLength + 2;
};

/**
 * read tag(s) from buffer
 * @param {Buffer} buff the binary buffer data
 * @param {Number} offset offset in buffer
 * @return {Number} parsed length in buffer
 */
BaseTag.prototype.readFromBuffer = function(buff, offset) {
    var nameLength = this._readNameFromBuffer(buff, offset + TAG_TYPE_OFFSET);
    var bodyLength = this._readBodyFromBuffer(buff, offset + TAG_TYPE_OFFSET + 
                                              nameLength);
    return TAG_TYPE_OFFSET + nameLength + bodyLength;
};

/**
 * get tag type
 * @return {String} tag type
 */
BaseTag.prototype.getType = function() {
    return this.type;
};

/**
 * get name
 * @return {String} tag name
 */
BaseTag.prototype.getName = function() {
    return this.id;
};

/**
 * get name
 * @return {String} tag name
 */
BaseTag.prototype.getId = BaseTag.prototype.getName;

/**
 * get value
 * @return {Mixed} the tag value
 */
BaseTag.prototype.getValue = function() {
    return this.value;
};

/**
 * get this tag's list / object length
 * @return {Number} length
 */
BaseTag.prototype.count = function() {
    if(undefined === this.value || null === this.value) return 0;
    if(typeof this.value !== "object") return 0;
    if(util.isArray(this.value)) return this.value.length;
    return Object.keys(this.value).length;
};

/**
 * select a child tag at index
 * @param {Number} index the child tag index
 * @return {Tag} the tag matches `index`
 */
BaseTag.prototype.selectAt = function(index) {
    if(this.value === undefined || this.value === null) return null;
    if(!util.isArray(this.value)) return null;
    if(index < 0 || index >= this.value.length) return null;
    return this.value[index];
};

/**
 * select a child tag
 * @param {String} tagName child tag name
 * @return {Tag} the tag matches `tagName`
 */
BaseTag.prototype.select = function(tagName) {
    if(!this.value || !Object.keys(this.value).length) return null;
    if(undefined === this.value[tagName] ||
       !this.value.hasOwnProperty(tagName)) {
        return null;
    }

    return this.value[tagName];
};

/**
 * get type id
 * @return {Number} tag type id
 */
BaseTag.prototype.getTypeId = function() {
    return _generateTagIds()[this.getType()];
};

BaseTag.prototype.get = BaseTag.prototype.select;
BaseTag.prototype.getAt = BaseTag.prototype.selectAt;

/**
 * inspect
 * @return {String}
 */
BaseTag.prototype.inspect = function() {
    return "<NBTTag " + this.getType() + ">";
};

/**
 * toString
 * @return {String}
 */
BaseTag.prototype.toString = function() {
    return JSON.stringify(this.toJSON(), true, 2);
};

/**
 * toJSON
 * @return {Object} json object
 */
BaseTag.prototype.toJSON = function() {
    var val = this.value;

    if(typeof val === "number") {
        return val;
    }

    if(typeof val === "string") {
        return val;
    }

    if(val instanceof Bignum) {
        return val;
    }

    if(this.type === "TAG_Int_Array" || this.type === "TAG_Byte_Array") {
        return val;
    }

    if(this.type === "TAG_List") {
        var _val = [];
        for(var i = 0; i < val.length; i++) {
            _val.push(val[i].toJSON());
        }
        return _val;
    }

    var _val = {};
    for(var key in val) {
        if(!val.hasOwnProperty(key)) continue;
        _val[key] = val[key].toJSON();
    }

    return _val;
};

/**
 * toBuffer
 * @return {Buffer} buffer data
 */
BaseTag.prototype.writeBuffer = function(buff, offset) {
    // ... to be inherited
    var _ = buff;
    _ = offset;
    return null;
};

/**
 * calculate buffer length
 * @return {Number} buffer length
 */
BaseTag.prototype.calcBufferLength = function() {
    // ... to be inherited
};

/**
 * set value
 * @param {Mixed} value the value to set
 */
BaseTag.prototype.setValue = function(value) {
    // ... to be inherited
    var _ = value;
    --_;
};

/**
 * get next tag
 * @param {Buffer} buff the buffer data
 * @param {Number} offset offset in buffer
 * @return {Number} length this tag used in buffer
 */
BaseTag.getNextTag = function(buff, offset) {
    // all the comments in this function are refered
    // to http://minecraft.gamepedia.com/NBT_Format
    var TAG_IDS = _generateTagIds();

    // The first byte in a tag is the tag type (ID)
    var tagType = buff.readUInt8(offset);
    if(tagType < 0) {
        throw new Error("Unknown tag type - " + tagType + ".");
    }

    var Tag = TAG_IDS[tagType];
    if(null === Tag || undefined === Tag) {
        throw new Error("Tag type " + tagType + " is not supported by this module yet.");
    }

    var tag = new Tag();
    return {
        length : tag.readFromBuffer(buff, offset),
        tag    : tag
    };
};

module.exports = BaseTag;

