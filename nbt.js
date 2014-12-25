/**
 * XadillaX created at 2014-12-24 14:48:57
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var Tag = require("./tags/base");
var fs = require("fs");
var zlib = require("zlib");

/**
 * NBT Class
 * @constructor
 * @refer http://minecraft.gamepedia.com/NBT_Format
 */
var NBT = function() {
    this.root = {};
};

/**
 * load NBT structure from buffer
 * @param {Buffer} buff NBT buffer data
 * @param {Function} callback callback function
 */
NBT.prototype.loadFromBuffer = function(buff, callback) {
    try {
        var offset = 0;
        while(offset < buff.length) {
            var wrapper = Tag.getNextTag(buff, offset);
            var tag = wrapper.tag;
            var len = wrapper.length;

            this.root[tag.id] = tag;
            offset += len;
        }
    } catch(e) {
        return callback(e);
    }

    callback();
};

/**
 * select a tag
 * @param {String} tagName the tag name in root
 * @return {Tag} the tag which matches `tagName`
 */
NBT.prototype.select = function(tagName) {
    if(!this.root || !Object.keys(this.root).length) return null;
    if(undefined === this.root[tagName]) return null;

    return this.root[tagName];
};

NBT.prototype.get = NBT.prototype.select;

/**
 * get root object's length
 * @return {Number} root length
 */
NBT.prototype.count = function() {
    if(!this.root) return null;
    return Object.keys(this.root).length;
};

/**
 * get root's keys
 * @return {Number} root's keys
 */
NBT.prototype.keys = function() {
    if(!this.root) return [];
    return Object.keys(this.root);
};

/**
 * inspect
 * @return {String}
 */
NBT.prototype.inspect = function() {
    return "<NBT " + JSON.stringify(this.keys()) + ">";
};

/**
 * toString
 * @return {String}
 */
NBT.prototype.toString = function() {
    return JSON.stringify(this.toJSON(), true, 2);
};

/**
 * load NBT structure from file
 * @param {String} filename NBT filename
 * @param {Function} callback callback function
 */
NBT.prototype.loadFromFile = function(filename, callback) {
    var self = this;
    fs.readFile(filename, function(err, buff) {
        if(err) {
            return callback(err);
        }

        self.loadFromBuffer(buff, callback);
    });
};

NBT.prototype.loadFromZlibCompressedFile = function(filename, callback) {
    var self = this;
    fs.readFile(filename, function(err, buff) {
        if(err) {
            return callback(err);
        }

        zlib.unzip(buff, function(err, buff) {
            if(err) {
                return callback(err);
            }

            self.loadFromBuffer(buff, callback);
        });
    });
};

/**
 * toJSON
 * @return {Object} a JSON object
 */
NBT.prototype.toJSON = function() {
    var res = {};
    for(var key in this.root) {
        if(!this.root.hasOwnProperty(key)) continue;
        res[key] = this.root[key].toJSON();
    }

    return res;
};

module.exports = NBT;

