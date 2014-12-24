/**
 * XadillaX created at 2014-12-24 14:48:57
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var Tag = require("./tags/base");

function _toJSON(obj) {
    var val = obj.value;

    if(typeof val === "number") {
        return val;
    }

    if(typeof val === "string") {
        return val;
    }

    if(obj.type === "TAG_Int_Array" || obj.type === "TAG_Byte_Array") {
        return val;
    }

    if(obj.type === "TAG_List") {
        var _val = [];
        for(var i = 0; i < val.length; i++) {
            _val.push(_toJSON(val[i]));
        }
        return _val;
    }

    var _val = {};
    for(var key in val) {
        if(!val.hasOwnProperty(key)) continue;
        _val[key] = _toJSON(val[key]);
    }

    return _val;
}

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
 * toJSON
 * @return {Object} a JSON object
 */
NBT.prototype.toJSON = function() {
    var res = {};
    for(var key in this.root) {
        if(!this.root.hasOwnProperty(key)) continue;
        res[key] = _toJSON(this.root[key]);
    }

    return res;
};

module.exports = NBT;

