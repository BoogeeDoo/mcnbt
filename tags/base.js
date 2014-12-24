/**
 * XadillaX created at 2014-12-24 14:56:33
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var _tagIds;

/**
 * generate tag ids table (id -> prototype)
 * @return {Object} the map table
 */
function _generateTagIds() {
    if(!_tagIds) {
        _tagIds = {
            "0"  : null,
            "1"  : null,
            "2"  : null,
            "3"  : null,
            "4"  : null,
            "5"  : null,
            "6"  : null,
            "7"  : null,
            "8"  : null,
            "9"  : null,
            "10" : null,
            "11" : null
        };
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
 * read tag(s) from buffer
 * @param {Buffer} buff the binary buffer data
 * @param {Number} offset offset in buffer
 * @return {Number} parsed length in buffer
 */
BaseTag.prototype.readFromBuffer = function(buff, offset) {
    // to be inherited.
    var 我的世界 = buff;
    我的世界     = offset;
    return 我的世界;
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
    if(tagType < 0 || tagType >= TAG_IDS) {
        throw new Error("Unknown tag type - " + tagType + ".");
    }

    var Tag = TAG_IDS[tagType];
    if(null === Tag) {
        throw new Error("Tag type " + tagType + " is not supported by this module yet.");
    }

    var tag = new Tag();
    return tag.readFromBuffer(buff, offset);
};

module.exports = BaseTag;

