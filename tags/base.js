/**
 * XadillaX created at 2014-12-24 14:56:33
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
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
    var bodyLength = this._readBodyFromBuffer(buff, offset + TAG_TYPE_OFFSET + nameLength);
    return TAG_TYPE_OFFSET + nameLength + bodyLength;
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

