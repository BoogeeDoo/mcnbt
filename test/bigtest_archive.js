'use strict';

const fs = require('fs');
const util = require('util');

const Long = require('long');
const should = require('should');

const NBT = require('../nbt');

describe('Real bugtest archive test', function() {
  const archive = new NBT();
  const stdData = require('./files/bigtest.nbt.json');

  beforeEach(function(done) {
    archive.loadFromZlibCompressedFile(
      __dirname + '/files/bigtest.nbt',
      err => {
        should.ifError(err);
        done();
      });
  });

  describe('#NBT::toJSON()', function() {
    it('should get correct content', function() {
      archive.toJSON().should.be.eql(stdData);
    });
  });

  describe('#NBT::toString()', function() {
    it('should get correct content', function() {
      JSON.parse(archive.toString()).should.be.eql(stdData);
    });
  });

  describe('#NBT::select()', function() {
    function genSelect(prefix, sel) {
      if (sel === 'Level') prefix = 'Level';
      else prefix += '|' + sel;

      const result = eval( // eslint-disable-line no-eval
        '(function() { return stdData' + prefix.split('|').map(function(i) {
          return '[\'' + i + '\']';
        }).join('') + '})()');

      const name = 'it should select \'' + prefix + '\'';
      it(name, function() {
        const node = eval( // eslint-disable-line no-eval
          '(function() { return archive' + prefix.split('|').map(function(i) {
            return '.select(\'' + i + '\')';
          }).join('') + '})();');
        const json = node.toJSON !== undefined ? node.toJSON() : node;
        json.should.be.eql(result);

        if (typeof node === 'number') {
          return;
        } else if (typeof result === 'object' && !util.isArray(result)) {
          node.getType().should.be.eql('TAG_Compound');
        } else if (typeof result === 'string') {
          if (Long.fromString(result).toString() === result) {
            node.getType().should.match(/^TAG_(String|Long)$/);
          } else {
            node.getType().should.be.eql('TAG_String');
          }
        } else if (typeof result === 'number' && result < 256) {
          node.getType().should.match(/^TAG_(Int|Byte|Double|Float|Short)$/);
        } else if (typeof result === 'number' && result < 65536) {
          node.getType().should.match(/^TAG_(Int|Byte|Double|Float|Short)$/);
        } else if (typeof result === 'number') {
          node.getType().should.match(/^TAG_(Int|Double|Float)$/);
        }
      });

      if (typeof result !== 'object') return;

      for (const key in result) {
        if (!result.hasOwnProperty(key)) continue;
        genSelect(prefix, key);
      }
    }

    genSelect('', 'Level');
  });

  describe('#NBT::calcBufferLength()', function() {
    it('should calculate correct buffer length', function() {
      archive.calcBufferLength(1051);
    });
  });

  describe('#NBT::writeToBuffer()', function() {
    it('should write correct buffer content', function() {
      archive._buff.should.be.eql(archive.writeToBuffer());
    });
  });

  describe('#NBT::writeToCompressed(File|Buffer)', function() {
    const origBuff = fs.readFileSync(__dirname + '/files/bigtest.nbt');

    it('#NBT::writeToCompressedBuffer()', function(done) {
      archive.writeToCompressedBuffer(function(err, buff) {
        should.ifError(err);

        /**
         * +---+---+---+---+---+---+---+---+---+---+
         * |ID1|ID2|CM |FLG|     MTIME     |XFL|OS | (more-->)
         * +---+---+---+---+---+---+---+---+---+---+
         *
         * 9 in Compressed Buffer is OS code, ignore theirs difference.
         */
        buff[9] = 0;

        buff.should.be.eql(origBuff);
        done();
      });
    });

    it('#NBT::writeToCompressedFile()', function(done) {
      archive.writeToCompressedFile('/tmp/bigtesttemp.txt', function(err) {
        should.ifError(err);

        const file = fs.readFileSync('/tmp/bigtesttemp.txt');
        file[9] = 0;
        file.should.be.eql(origBuff);
        done();
      });
    });
  });
});
