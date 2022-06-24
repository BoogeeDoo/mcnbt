'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGIntArray class
 */
class TAGIntArray extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Int_Array';
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
    const endOffset = nextOffset + len * 4;
    this.value = [];

    for (let i = nextOffset; i < endOffset; i += 4) {
      this.value.push(buff.readInt32BE(i));
    }

    return 4 + len * 4;
  }

  /**
   * Calculate buffer length
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    return 4 + this.value.length * 4;
  }

  /**
   * Set the whole array
   * @param {Number[]} array The array to set
   */
  setValue(array) {
    if (!Array.isArray(array)) {
      throw new TypeError('Value of TAG_Int_Array should be an array.');
    }

    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(parseInt(array[i]));
      if (newArray[i] < -2147483648 ||
          newArray[i] > 2147483647 ||
          isNaN(newArray[i])) {
        throw new RangeError(
          'Each element in TAG_Int_Array should between -2147483648 and' +
          ' 2147483647.');
      }
    }

    this.value = newArray;
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
    if (value < -2147483648 || value > 2147483647 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Int_Array should between -2147483648 and' +
        ' 2147483647.');
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
    if (value < -2147483648 || value > 2147483647 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Int_Array should between -2147483648 and' +
        ' 2147483647.');
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
    if (value < -2147483648 || value > 2147483647 || isNaN(value)) {
      throw new RangeError(
        'Each element in TAG_Int_Array should between -2147483648 and' +
        ' 2147483647.');
    }

    if (pos < 0) pos = 0;
    if (pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for (let i = this.value.length - 1; i >= pos; i--) {
      this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    buff.writeUInt32BE(this.value.length);

    for (let i = 0; i < this.value.length; i++) {
      buff.writeInt32BE(this.value[i]);
    }
  }
}

module.exports = TAGIntArray;
