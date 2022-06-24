'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGShort class
 */
class TAGShort extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Short';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = buff.readInt16BE(offset);
    return 2;
  }

  /**
   * Write body to buffer
   * @param {Bvffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    buff.writeInt16BE(this.value);
  }

  /**
   * Set the value of this tag
   * @param {number} value The value to set
   */
  setValue(value) {
    value = parseInt(value);
    if (value < -32768 || value > 32767 || isNaN(value)) {
      throw new Error('Value of TAG_Short should between -32768 and 32767.');
    }
    this.value = value;
  }
}

/**
 * Calculate buffer length
 * @return {number} The length of the buffer
 */
TAGShort.prototype.calcBufferLength = BaseTag._returnSize(2);

module.exports = TAGShort;
