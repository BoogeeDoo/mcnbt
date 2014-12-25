/**
 * XadillaX created at 2014-12-25 16:18:24
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var NBT = require("../nbt");
var fs = require("fs");

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

    console.log("==================");
    console.log("Buffer length: " + nbt.calcBufferLength());

    var rebuff = nbt.writeToBuffer();
    var orbuff = nbt._buff;
    console.log("ReBuffer:", rebuff);
    console.log("OrBuffer:", orbuff);

    for(var i = 0; i < rebuff.length; i++) {
        if(rebuff[i] !== orbuff[i]) {
            console.log("Not same at " + i + ": " + rebuff[i] + " vs. " + orbuff[i]);
        }
    }

    fs.readFile("./level.dat", function(err, data) {
        if(err) return console.error(err);
        nbt.writeToCompressedBuffer(function(err, buff) {
            console.log("Compressed ReBuffer:", buff);
            console.log("Compressed OrBuffer:", data);

            for(var i = 0; i < data.length; i++) {
                if(data[i] !== buff[i]) {
                    console.log("Not same at compressed " + i + ": " + buff[i] +
                                " vs. " + data[i]);
                }
            }
        });
    });

    nbt.writeToCompressedFile("/tmp/temp.txt", function(err) {
        console.log("...", err);
    });
});

