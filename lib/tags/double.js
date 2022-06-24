'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGDouble class
 */
class TAGDouble extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_Double';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    this.value = buff.readDoubleBE(offset);
    return 8;
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    buff.writeDoubleBE(this.value);
  }

  /**
   * Set the value of this tag
   * @param {number} value The value to set
   */
  setValue(value) {
    value = parseFloat(value);
    if (isNaN(value)) {
      throw new Error('Bad value for TAG_Double.');
    }
    this.value = value;
  }
}

/**
 * Calculate buffer length
 * @return {number} The length of the buffer
 */
TAGDouble.prototype.calcBufferLength = BaseTag._returnSize(8);

module.exports = TAGDouble;
