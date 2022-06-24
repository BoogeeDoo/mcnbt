'use strict';

const BaseTag = require('../base_tag');

let Tags;
function getTags() {
  if (Tags) {
    return Tags;
  }

  Tags = require('../tags');
  return Tags;
}

/**
 * The TAGCompound class
 */
class TAGCompound extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Compound';
  }

  /**
   * Get next tag from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _getNextTag(buff, offset) {
    const tagType = buff.readUInt8(offset);
    if (tagType < 0) {
      throw new Error('Unknown tag type - ' + tagType + '.');
    }

    if (tagType === 0) {
      return -1;
    }

    const Tags = getTags();
    const Tag = Tags[tagType];
    if (Tag === null || Tag === undefined) {
      throw new Error(
        `Tag type ${tagType} is not supported by this module yet.`);
    }

    const tag = new Tag();
    const len = tag.readFromBuffer(buff, offset);
    this.value[tag.id] = tag;
    return len;
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = {};

    let nextOffset = offset;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const len = this._getNextTag(buff, nextOffset);
      if (len === -1) break;
      nextOffset += len;
    }

    return nextOffset - offset + 1;
  }

  /**
   * Calculate buffer length
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    let len = 0;
    for (const key in this.value) {
      if (!this.value.hasOwnProperty(key)) continue;

      // child type id for 1 byte, child name length for 2 bytes and child
      // name for (child name length) byte(s).
      len += 3;
      len += Buffer.byteLength(this.value[key].id, 'utf8');

      // add the child body's length
      len += this.value[key].calcBufferLength();
    }

    // TAG_End
    len += 1;

    return len;
  }

  /**
   * Write body to buffer
   * @param {Bvffer} buff The buffer to write to
   * @param {number} offset The offset to start writing to
   */
  writeBuffer(buff) {
    for (const key in this.value) {
      if (!this.value.hasOwnProperty(key)) continue;

      const object = this.value[key];
      buff.writeUInt8(object.getTypeId());

      const nameBuff = Buffer.from(object.id, 'utf8');
      buff.writeBuffer(nameBuff);

      object.writeBuffer(buff);
    }

    buff.writeUInt8(0);
  }

  /**
   * Set the value of the tag
   * @param {{ [key: string]: BaseTag }} value The value to set
   */
  setValue(value) {
    if (typeof value !== 'object') {
      throw new Error('Invalid TAG_Compound value.');
    }

    const res = {};
    for (const key in value) {
      if (!value.hasOwnProperty(key)) continue;
      const object = value[key];
      if (!(object instanceof BaseTag)) {
        throw new Error(
          `Invalid TAG_Compound element in key '${key}'.`);
      }

      res[key] = value[key];
      res[key].id = key;
    }

    this.value = res;
  }

  /**
   * Set a single tag value by name
   * @param {string} name The name of the tag
   * @param {BaseTag} value The value to set
   * @param {Boolean} [replace=false] Replace the tag if it already exists
   */
  setByName(name, value, replace = false) {
    if (this.value[name] !== undefined && !replace) {
      throw new Error('Existing TAG_Compound values name.');
    }

    if (typeof value !== 'object') {
      throw new Error('Invalid TAG_Compound value.');
    }

    if (!(value instanceof BaseTag)) {
      throw new Error('Invalid TAG_Compound element.');
    }

    this.value[name] = value;
    value.id = name;
  }

  /**
   * Get tags names
   */
  getNames() {
    return Object.keys(this.value);
  }

  /**
   * Delete a tag by name
   * @param {string} name The name of the tag to delete
   */
  deleteByName(name) {
    delete this.value[name];
  }

  /**
   * Clean all tags
   */
  clean() {
    this.value = {};
  }
}

module.exports = TAGCompound;
