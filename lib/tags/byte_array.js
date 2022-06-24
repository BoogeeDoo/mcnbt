'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGByteArray class
 */
class TAGByteArray extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Byte_Array';
    this.value = [];
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    const len = buff.readUInt32BE(offset);
    const nextOffset = offset + 4;
    const endOffset = nextOffset + len;
    this.value = [];

    for (let i = nextOffset; i < endOffset; i++) {
      this.value.push(buff.readInt8(i));
    }

    return 4 + len;
  }

  /**
   * Calculate buffer length
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    return 4 + this.value.length;
  }

  /**
   * Write body to buffer
   * @param {Bvffer} buff The buffer to write to
   * @param {number} offset The offset to start writing from
   */
  writeBuffer(buff) {
    buff.writeUInt32BE(this.value.length);

    for (let i = 0; i < this.value.length; i++) {
      buff.writeInt8(this.value[i]);
    }
  }

  /**
   * Shift the array
   * @return {number} The value shifted
   */
  shift() {
    return this.value.shift();
  }

  /**
   * Unshift the array
   * @param {number} value The value to unshift
   * @return {number} The new length of the array
   */
  unshift(value) {
    value = parseInt(value);
    if (value < -128 || value > 127 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Byte_Array should between -128 and 127.');
    }
    return this.value.unshift(value);
  }

  /**
   * Pop the array
   * @return {number} The value popped
   */
  pop() {
    return this.value.pop();
  }

  /**
   * Push the array
   * @param {number} value The value to push
   * @return {number} The new length of the array
   */
  push(value) {
    value = parseInt(value);
    if (value < -128 || value > 127 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Byte_Array should between -128 and 127.');
    }
    return this.value.push(value);
  }

  /**
   * Insert the array
   * @param {number} value The value to insert
   * @param {number} pos The position to insert
   */
  insert(value, pos) {
    value = parseInt(value);
    if (value < -128 || value > 127 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Byte_Array should between -128 and 127.');
    }

    if (pos < 0) pos = 0;
    if (pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for (let i = this.value.length - 1; i >= pos; i--) {
      this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
  }
}

module.exports = TAGByteArray;
