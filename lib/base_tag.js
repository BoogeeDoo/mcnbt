'use strict';

const Long = require('long');

const TAG_TYPE_OFFSET = 1;
let _tagIds;

/**
 * generate tag ids table (id -> prototype)
 * @return {Object} the map table
 */
function _generateTagIds() {
  if (!_tagIds) {
    _tagIds = require('./tags');
  }

  return _tagIds;
}

/**
 * The BaseTag class
 */
class BaseTag {
  /**
   * constructor
   */
  constructor() {
    this.type = '';
    this.id = '';
    this.value = undefined;
  }

  /**
   * Read body information from buffer (private & to be inherited)
   * @param {Buffer} buff the buffer to read from
   * @param {number} offset the offset to start reading from
   * @return {number} the number of bytes read
   */
  _readBodyFromBuffer(buff, offset) { // eslint-disable-line no-unused-vars
    // To be inherited.
    return 0;
  }

  /**
   * Read name information from buffer (private)
   * @param {Buffer} buff the binary buffer data
   * @param {number} offset offset in buffer
   * @return {number} the whole name column byte length
   */
  _readNameFromBuffer(buff, offset) {
    const nameLength = buff.readUInt16BE(offset);
    const name = buff.toString('utf8', offset + 2, offset + 2 + nameLength);
    this.id = name;
    return nameLength + 2;
  }

  /**
   * Read tag(s) from buffer
   * @param {Buffer} buff the binary buffer data
   * @param {number} offset offset in buffer
   * @return {number} parsed length in buffer
   */
  readFromBuffer(buff, offset) {
    const nameLength = this._readNameFromBuffer(buff, offset + TAG_TYPE_OFFSET);
    const bodyLength = this._readBodyFromBuffer(
      buff, offset + TAG_TYPE_OFFSET + nameLength);
    return TAG_TYPE_OFFSET + nameLength + bodyLength;
  }

  /**
   * Get tag type
   * @return {string} tag type
   */
  getType() {
    return this.type;
  }

  /**
   * Get name
   * @return {string} tag name
   */
  getName() {
    return this.id;
  }

  /**
   * Alias for getName()
   * @return {string} tag name
   */
  getId() {
    return this.id;
  }

  /**
   * Get value
   * @return {any} tag value
   */
  getValue() {
    return this.value;
  }

  /**
   * Get this tag's list / object length
   * @return {number} length
   */
  count() {
    if (this.value === undefined || this.value === null) return 0;
    if (typeof this.value !== 'object') return 0;
    if (Array.isArray(this.value)) return this.value.length;
    return Object.keys(this.value).length;
  }

  /**
   * Select a child tag at index
   * @param {number} index the child tag index
   * @return {BaseTag | number} the tag matches `index`
   */
  selectAt(index) {
    if (this.value === undefined || this.value === null) return null;
    if (!Array.isArray(this.value)) return null;
    if (index < 0 || index >= this.value.length) return null;
    return this.value[index];
  }

  /**
   * Select a child tag
   * @param {string} tagName child tag name
   * @return {BaseTag} the tag matches `tagName`
   */
  select(tagName) {
    if (!this.value || !Object.keys(this.value).length) return null;
    if (undefined === this.value[tagName] ||
       !this.value.hasOwnProperty(tagName)) {
      return null;
    }

    return this.value[tagName];
  }

  /**
   * Get type id
   * @return {number} tag type id
   */
  getTypeId() {
    return _generateTagIds()[this.getType()];
  }

  /**
   * Alias for select()
   * @param {string} tagName child tag name
   * @return {BaseTag} the tag matches `tagName`
   */
  get(tagName) {
    return this.select(tagName);
  }

  /**
   * Alias for selectAt()
   * @param {number} index the child tag index
   * @return {BaseTag | number} the tag matches `index`
   */
  getAt(index) {
    return this.selectAt(index);
  }

  /**
   * Inspect
   * @return {string} string representation
   */
  inspect() {
    return `<NBTTag ${this.getType()}>`;
  }

  /**
   * toString
   * @return {string} string representation
   */
  toString() {
    return JSON.stringify(this.toJSON(), true, 2);
  }

  /**
   * toJSON
   * @return {Object} json representation
   */
  toJSON() {
    const val = this.value;

    if (typeof val === 'number') {
      return val;
    }

    if (typeof val === 'string') {
      return val;
    }

    if (val instanceof Long) {
      return val;
    }

    if (this.type === 'TAG_Int_Array' || this.type === 'TAG_Byte_Array') {
      return val;
    }

    if (this.type === 'TAG_List') {
      const _val = [];
      for (let i = 0; i < val.length; i++) {
        _val.push(val[i].toJSON());
      }
      return _val;
    }

    const _val = {};
    for (const key in val) {
      if (!val.hasOwnProperty(key)) continue;
      _val[key] = val[key].toJSON();
    }

    return _val;
  }

  /**
   * Write body to buffer (to be inherited)
   * @param {Buffer} buff The buffer to write to
   * @param {number} offset The offset to start writing to
   * @return {number} The number of bytes written
   */
  writeBuffer(buff, offset) { // eslint-disable-line no-unused-vars
    // To be inherited.
    return 0;
  }

  /**
   * Calculate buffer length (to be inherited)
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    // To be inherited.
    return 0;
  }

  /**
   * Set the value of this tag
   * @param {any} value The value to set
   */
  setValue(value) { // eslint-disable-line no-unused-vars
    throw new Error('This method should be implemented in child class.');
  }

  /**
   * Get next tag
   * @param {Buffer} buff the buffer data
   * @param {number} offset offset in buffer
   * @return {{ length: number, tag: BaseTag }} The next tag information
   */
  static getNextTag(buff, offset) {
    // all the comments in this function are refered
    // to http://minecraft.gamepedia.com/NBT_Format
    const TAG_IDS = _generateTagIds();

    // The first byte in a tag is the tag type (ID)
    const tagType = buff.readUInt8(offset);
    if (tagType < 0) {
      throw new TypeError(`Unknown tag type - ${tagType}.`);
    }

    const Tag = TAG_IDS[tagType];
    if (Tag === null || undefined === Tag) {
      throw new TypeError(
        `Tag type ${tagType} is not supported by this module yet.`);
    }

    const tag = new Tag();
    return {
      length: tag.readFromBuffer(buff, offset),
      tag,
    };
  }

  /**
   * Generate a function that always returns `size`
   * @param {number} size the size to return
   * @return {() => number} the function
   */
  static _returnSize(size) {
    return () => size;
  }
}

module.exports = BaseTag;
