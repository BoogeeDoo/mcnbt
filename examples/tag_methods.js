/**
 * XadillaX created at 2014-12-30 16:17:32
 *
 * Copyright (c) 2015 XadillaX' Gensokyo, all rights
 * reserved
 */
var nbt = require("../lib/tags");
var BaseTag = require("../lib/base_tag");

// Base
console.log("BaseTag:");
for(var key in BaseTag.prototype) {
    if(typeof(BaseTag.prototype[key]) === "function") {
        console.log("  " + (key[0] === "_" ? "- " : "+ ") + key);
    }
}

// Each other's
for(var i = 1; i <= 11; i++) {
    var tag = new nbt[i]();
    console.log(tag.getType() + ":");

    for(var key in tag) {
        if(undefined === BaseTag.prototype[key] &&
           typeof(tag[key]) === "function") {
            console.log("  " + (key[0] === "_" ? "- " : "+ ") + key);
        }
    }
}
