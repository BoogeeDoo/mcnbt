'use strict';

const fs = require('fs');
const path = require('path');

const NBT = require('../nbt');

const nbt = new NBT();

nbt.loadFromZlibCompressedFile(
  path.join(__dirname, '/../test/files/bigtest.nbt'), err => {
    if (err) return console.error(err, err.stack);

    console.log(nbt);
    console.log(JSON.stringify(nbt.toJSON()));
    console.log(nbt.select('Level'));
    console.log(nbt.select('Level').toString());

    const list = nbt.select('Level').select('listTest (compound)');
    console.log(list.getType());
    console.log(list.getTypeId());
    console.log(list.toString());

    const item = list.select(1);
    console.log(item.toString());
    console.log(item.count());

    console.log('==================');
    console.log('Buffer length: ' + nbt.calcBufferLength());

    const rebuff = nbt.writeToBuffer();
    const orbuff = nbt._buff;
    console.log('ReBuffer:', rebuff);
    console.log('OrBuffer:', orbuff);

    for (let i = 0; i < rebuff.length; i++) {
      if (rebuff[i] !== orbuff[i]) {
        console.log(`Not same at ${i}: ${rebuff[i]} vs. ${orbuff[i]}`);
      }
    }

    // eslint-disable-next-line node/prefer-promises/fs
    fs.readFile(
      path.join(__dirname, '/../test/files/bigtest.nbt'), (err, data) => {
        if (err) return console.error(err, err.stack);
        nbt.writeToCompressedBuffer(function(err, buff) {
          console.log('Compressed ReBuffer:', buff);
          console.log('Compressed OrBuffer:', data);

          for (let i = 0; i < data.length; i++) {
            if (data[i] !== buff[i]) {
              console.log(
                `Not same at compressed ${i}: ${buff[i]} vs. ${data[i]}`);
            }
          }

          console.log(
            '+---+---+---+---+---+---+---+---+---+---+\n' +
            '|ID1|ID2|CM |FLG|     MTIME     |XFL|OS | (more-->)\n' +
            '+---+---+---+---+---+---+---+---+---+---+');
          console.log(
            '9 in Compressed Buffer is OS code, ignore theirs difference.');
        });
      });

    nbt.writeToCompressedFile('/tmp/bigtemp.txt', function(err) {
      console.log('...', err);
    });
  });
