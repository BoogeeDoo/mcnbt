'use strict';

const fs = require('fs');
const zlib = require('zlib');

const Tag = require('./lib/base_tag');
const { Bvffer } = require('./lib/bvffer');

/**
 * The NBT class
 * @see http://minecraft.gamepedia.com/NBT_Format
 */
class NBT {
  constructor() {
    this.root = {};
  }

  /**
   * Load from buffer
   * @param {Buffer} buff The buffer to load from
   * @param {(err?: Error) => void} callback The callback to call when done
   */
  loadFromBuffer(buff, callback) {
    try {
      this._buff = buff;
      let offset = 0;
      while (offset < buff.length) {
        const wrapper = Tag.getNextTag(buff, offset);
        const tag = wrapper.tag;
        const len = wrapper.length;

        this.root[tag.id] = tag;
        offset += len;
      }
    } catch (e) {
      return callback(e);
    }

    callback();
  }

  /**
   * Load from compressed buffer
   * @param {Buffer} buff The buffer to load from
   * @param {(err?: Error) => void} callback The callback to call when done
   */
  loadFromZlibCompressedBuffer(buff, callback) {
    zlib.unzip(buff, (err, buff) => {
      if (err) {
        return callback(err);
      }
      this.loadFromBuffer(buff, callback);
    });
  }

  /**
   * Write to compressed buffer
   * @param {(err?: Error, buff?: Buffer) => void} callback The callback to
   *                                                        call when done
   * @param {'gzip'|'deflate'} [method='gzip'] The compression method to use
   */
  writeToCompressedBuffer(callback, method = 'gzip') {
    try {
      const _buff = this.writeToBuffer();
      zlib[method](_buff, callback);
    } catch (e) {
      return callback(e);
    }
  }

  /**
   * Write to buffer
   * @return {Buffer} The buffer
   */
  writeToBuffer() {
    const buff = new Bvffer(this.calcBufferLength());
    for (const key in this.root) {
      if (!this.root.hasOwnProperty(key)) continue;

      const object = this.root[key];
      buff.writeUInt8(object.getTypeId());

      const nameBuff = Buffer.from(object.id, 'utf8');
      buff.writeBuffer(nameBuff);

      object.writeBuffer(buff);
    }

    return buff.buff;
  }

  /**
   * Select a tag
   * @param {string} tagName the tag name in root
   * @return {BaseTag|null} The tag which matches `tagName`
   */
  select(tagName) {
    if (!this.root || !Object.keys(this.root).length) return null;
    if (undefined === this.root[tagName]) return null;
    return this.root[tagName];
  }

  /**
   * Alias for `select()`
   * @param {string} tagName the tag name in root
   * @return {BaseTag|null} The tag which matches `tagName`
   */
  get(tagName) {
    return this.select(tagName);
  }

  /**
   * Get root object's length
   * @return {number} root length
   */
  count() {
    if (!this.root) return null;
    return Object.keys(this.root).length;
  }

  /**
   * Get root's keys
   * @return {string[]} root's keys
   */
  keys() {
    if (!this.root) return null;
    return Object.keys(this.root);
  }

  /**
   * Inspect
   * @return {string} Inspect string
   */
  inspect() {
    return `<NBT ${JSON.stringify(this.keys())} >`;
  }

  /**
   * toString
   * @return {string} String
   */
  toString() {
    return JSON.stringify(this.toJSON(), true, 2);
  }

  /**
   * Load NBT structure from file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  loadFromFile(filename, callback) {
    // eslint-disable-next-line node/prefer-promises/fs
    fs.readFile(filename, (err, buff) => {
      if (err) {
        return callback(err);
      }
      this.loadFromBuffer(buff, callback);
    });
  }

  /**
   * Load NBT structure from zlib compressed file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  loadFromZlibCompressedFile(filename, callback) {
    // eslint-disable-next-line node/prefer-promises/fs
    fs.readFile(filename, (err, buff) => {
      if (err) {
        return callback(err);
      }
      this.loadFromZlibCompressedBuffer(buff, callback);
    });
  }

  /**
   * Write NBT structure to file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  writeToFile(filename, callback) {
    try {
      // eslint-disable-next-line node/prefer-promises/fs
      fs.writeFile(filename, this.writeToBuffer(), callback);
    } catch (e) {
      return callback(e);
    }
  }

  /**
   * Write NBT structure to zlib compressed file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   * @param {'gzip'|'deflate'} [method='gzip'] The compression method to use
   */
  writeToCompressedFile(filename, callback, method = 'gzip') {
    this.writeToCompressedBuffer((err, buff) => {
      if (err) return callback(err);

      // eslint-disable-next-line node/prefer-promises/fs
      fs.writeFile(filename, buff, callback);
    }, method);
  }

  /**
   * Calculate buffer length
   * @return {number} buffer length
   */
  calcBufferLength() {
    let len = 0;

    for (const key in this.root) {
      if (!this.root.hasOwnProperty(key)) continue;

      // child type id for 1 byte, child name length for 2 bytes and child
      // name for (child name length) byte(s).
      len += 3;
      len += Buffer.byteLength(this.root[key].id, 'utf8');

      // add the child body's length
      len += this.root[key].calcBufferLength();
    }

    return len;
  }

  /**
   * toJSON
   * @return {Object} JSON object
   */
  toJSON() {
    const res = {};
    for (const key in this.root) {
      if (!this.root.hasOwnProperty(key)) continue;
      res[key] = this.root[key].toJSON();
    }

    return res;
  }
}

NBT.Tags = require('./lib/tags');

module.exports = NBT;
