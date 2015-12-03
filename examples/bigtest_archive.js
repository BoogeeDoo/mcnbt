/**
 * XadillaX created at 2015-12-03 16:56:53 With ♥
 *
 * Copyright (c) 2015 XadillaX' Gensokyo, all rights
 * reserved.
 */
"use strict";

var NBT = require("../nbt");
var fs = require("fs");

var nbt = new NBT();
nbt.loadFromZlibCompressedFile(__dirname + "/../test/files/bigtest.nbt", function(err) {
    if(err) return console.error(err, err.stack);

    console.log(nbt);
    console.log(JSON.stringify(nbt.toJSON()));
    console.log(nbt.select("Level"));
    console.log(nbt.select("Level").toString());

    var list = nbt.select("Level").select("listTest (compound)");
    console.log(list.getType());
    console.log(list.getTypeId());
    console.log(list.toString());

    var item = list.select(1);
    console.log(item.toString());
    console.log(item.count());

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

    fs.readFile(__dirname + "/../test/files/bigtest.nbt", function(err, data) {
        if(err) return console.error(err, err.stack);
        nbt.writeToCompressedBuffer(function(err, buff) {
            console.log("Compressed ReBuffer:", buff);
            console.log("Compressed OrBuffer:", data);

            for(var i = 0; i < data.length; i++) {
                if(data[i] !== buff[i]) {
                    console.log("Not same at compressed " + i + ": " + buff[i] + " vs. " + data[i]);
                }
            }

            console.log("+---+---+---+---+---+---+---+---+---+---+\n" +
                        "|ID1|ID2|CM |FLG|     MTIME     |XFL|OS | (more-->)\n" +
                        "+---+---+---+---+---+---+---+---+---+---+");
            console.log("9 in Compressed Buffer is OS code, ignore theirs difference.");
        });
    });

    nbt.writeToCompressedFile("/tmp/bigtemp.txt", function(err) {
        console.log("...", err);
    });
});
