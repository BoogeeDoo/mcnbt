/**
 * XadillaX created at 2014-12-24 14:48:57
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var Tag = require("./lib/base_tag");
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
        this._buff = buff;
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
 * load from compressed buffer
 * @param {Buffer} buff compressed buffer
 * @param {Function} callback callback function
 */
NBT.prototype.loadFromZlibCompressedBuffer = function(buff, callback) {
    var self = this;
    zlib.unzip(buff, function(err, buff) {
        if(err) {
            return callback(err);
        }

        self.loadFromBuffer(buff, callback);
    });
};

/**
 * write to compressed buffer
 * @param {Function} callback callback function
 * @param {String} [method] compress method (gzip|deflate)
 */
NBT.prototype.writeToCompressedBuffer = function(callback, method) {
    method = method || "gzip";
    try {
        var _buff = this.writeToBuffer();
        zlib[method](_buff, callback);
    } catch(e) {
        return callback(e);
    }
};

/**
 * write to buffer
 * @return {Buffer} the result buffer data
 */
NBT.prototype.writeToBuffer = function() {
    var buffLength = this.calcBufferLength();
    var buff = new Buffer(buffLength);

    var len = 0;
    for(var key in this.root) {
        if(!this.root.hasOwnProperty(key)) continue;

        var object = this.root[key];
        buff.writeUInt8(object.getTypeId(), len);
        
        var nameBuff = new Buffer(object.id, "utf8");
        nameBuff.copy(buff, len + 1 + 2);
        buff.writeUInt16BE(nameBuff.length, len + 1);

        len += object.writeBuffer(buff, len + 1 + 2 + nameBuff.length);
        len += (1 + 2 + nameBuff.length);
    }

    return buff;
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

/**
 * load NBT structure from zlib compressed file
 * @param {String} filename file's name
 * @param {Function} callback callback function
 */
NBT.prototype.loadFromZlibCompressedFile = function(filename, callback) {
    var self = this;
    fs.readFile(filename, function(err, buff) {
        if(err) {
            return callback(err);
        }

        self.loadFromZlibCompressedBuffer(buff, callback);
    });
};

/**
 * write to file
 * @param {String} filename file's name
 * @param {Function} callback callback function
 */
NBT.prototype.writeToFile = function(filename, callback) {
    try {
        fs.writeFile(filename, this.writeToBuffer(), callback);
    } catch(e) {
        return callback(e);
    }
};

/**
 * write to compressed file
 * @param {String} filename file's name
 * @param {Function} callback callback function
 * @param {String} [method] compress method (gzip|deflate)
 */
NBT.prototype.writeToCompressedFile = function(filename, callback, method) {
    this.writeToCompressedBuffer(function(err, buff) {
        if(err) return callback(err);
        fs.writeFile(filename, buff, callback);
    }, method);
};

/**
 * calculate buffer length
 * @return {Number} precalculated buffer length
 */
NBT.prototype.calcBufferLength = function() {
    var len = 0;
    for(var key in this.root) {
        if(!this.root.hasOwnProperty(key)) continue;

        // child type id for 1 byte, child name length for 2 bytes and child
        // name for (child name length) byte(s).
        len += 1;
        len += 2;
        len += Buffer.byteLength(this.root[key].id, "utf8");
        
        // add the child body's length
        len += this.root[key].calcBufferLength();
    }

    return len;
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

