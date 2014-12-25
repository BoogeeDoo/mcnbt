/**
 * XadillaX created at 2014-12-25 16:18:24
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var NBT = require("../nbt");

var nbt = new NBT();
nbt.loadFromZlibCompressedFile("./level.dat", function(err) {
    if(err) return console.error(err);

    console.log(nbt);
    console.log(nbt.toString());
    console.log(nbt.select(""));
    console.log(nbt.select("").toString());

    var gameRules = nbt.select("").select("Data").select("GameRules");
    console.log(gameRules.getType());
    console.log(gameRules.getTypeId());
    console.log(gameRules.toString());
});

