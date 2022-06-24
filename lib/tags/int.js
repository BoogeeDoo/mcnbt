'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGInt class
 */
class TAGInt extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Int';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = buff.readInt32BE(offset);
    return 4;
  }

  /**
   * Write body to buffer
   * @param {Bvffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    buff.writeInt32BE(this.value);
  }

  /**
   * Set the value of this tag
   * @param {number} value The value to set
   */
  setValue(value) {
    value = parseInt(value);
    if (value < -2147483648 || value > 2147483647 || isNaN(value)) {
      throw new RangeError(
        'Value of TAG_Int should between -2147483648 and 2147483647.');
    }
    this.value = value;
  }
}

/**
 * Calculate buffer length
 * @return {number} The length of the buffer
 */
TAGInt.prototype.calcBufferLength = BaseTag._returnSize(4);

module.exports = TAGInt;
