'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGFloat class
 */
class TAGFloat extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Float';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = buff.readFloatBE(offset);
    return 4;
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    buff.writeFloatBE(this.value);
  }

  /**
   * Set the value of this tag
   * @param {number} value The value to set
   */
  setValue(value) {
    value = parseFloat(value);
    if (value < -3.4e+38 || value > 3.4e+38 || isNaN(value)) {
      throw new RangeError(
        'Value of TAG_Float should between -3.4E+38 and 3.4E+38.');
    }
    this.value = value;
  }
}

/**
 * Calculate buffer length
 * @return {number} The length of the buffer
 */
TAGFloat.prototype.calcBufferLength = BaseTag._returnSize(4);

module.exports = TAGFloat;
