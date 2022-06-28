'use strict';

const BaseTag = require('../base_tag');

/**
 * The TAGString class
 */
class TAGString extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_String';
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    const len = buff.readUInt16BE(offset);
    const nextOffset = offset + 2;
    this.value = buff.toString('utf8', nextOffset, nextOffset + len);
    return 2 + len;
  }

  /**
   * Calculate buffer length
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    return 2 + Buffer.byteLength(this.value, 'utf8');
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   * @param {number} offset The offset to start writing to
   */
  writeBuffer(buff) {
    const strBuff = Buffer.from(this.value, 'utf8');

    buff.writeBuffer(strBuff);
  }

  /**
   * Set the value of this tag
   * @param {string} value The value to set
   */
  setValue(value) {
    if (typeof value !== 'string') value = value.toString();
    if (Buffer.byteLength(value, 'utf8') > 65536) {
      throw new Error(
        'Value of TAG_String\'s length should greater than 65536.');
    }
    this.value = value;
  }
}

module.exports = TAGString;
