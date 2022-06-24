'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGByte class
 */
class TAGByte extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Byte';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = buff.readInt8(offset);
    return 1;
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   * @param {number} offset The offset to start writing to
   */
  writeBuffer(buff) {
    buff.writeInt8(this.value);
  }

  /**
   * Set the value of this tag
   * @param {number} value The value to set
   */
  setValue(value) {
    value = parseInt(value);
    if (value < -128 || value > 127 || isNaN(value)) {
      throw new RangeError('Value of TAG_Byte should between -128 and 127.');
    }
    this.value = value;
  }
}

/**
 * Calculate buffer length
 * @return {number} The length of the buffer
 */
TAGByte.prototype.calcBufferLength = BaseTag._returnSize(1);

module.exports = TAGByte;
