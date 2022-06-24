'use strict';

const defaultPoolSize = 64 * 1024;
if (Buffer.poolSize < defaultPoolSize) {
  Buffer.poolSize = defaultPoolSize;
}

class Bvffer {
  constructor(buffByteLength) {
    /**
     * Buffer store data
     */
    this.buffer = Buffer.allocUnsafe(buffByteLength);
    /**
     * data length in buffer
     */
    this.dataByteLength = 0;
  }

  get dataLength() {
    return this.dataByteLength;
  }

  get buff() {
    return this.buffer;
  }

  /**
   * write buffer data to buffer
   * @param {Buffer} value data to write
   */
  writeBuffer(value) {
    this.writeUInt16BE(value.length);

    value.copy(this.buffer, this.dataByteLength);
    this.dataByteLength += value.length;
  }

  /**
   * @param {number} value value
   */
  writeUInt8(value) {
    this.buff[this.dataByteLength] = value;
    this.dataByteLength += 1;
  }

  /**
   * @param {number} value value
   */
  writeInt8(value) {
    this.buff[this.dataByteLength] = value;
    this.dataByteLength += 1;
  }

  /**
   * @param {number} value value
   */
  writeUInt16BE(value) {
    this.buffer.writeUInt16BE(value, this.dataByteLength);
    this.dataByteLength += 2;
  }

  /**
   * @param {number} value value
   */
  writeInt16BE(value) {
    this.buffer.writeInt16BE(value, this.dataByteLength);
    this.dataByteLength += 2;
  }

  /**
   * @param {number} value value
   */
  writeUInt32BE(value) {
    this.buffer.writeUInt32BE(value, this.dataByteLength);
    this.dataByteLength += 4;
  }

  /**
   * @param {number} value value
   */
  writeInt32BE(value) {
    this.buffer.writeInt32BE(value, this.dataByteLength);
    this.dataByteLength += 4;
  }

  /**
   * @param {number} value value
   */
  writeDoubleBE(value) {
    this.buffer.writeDoubleBE(value, this.dataByteLength);
    this.dataByteLength += 8;
  }

  /**
   * @param {number} value value
   */
  writeFloatBE(value) {
    this.buffer.writeFloatBE(value, this.dataByteLength);
    this.dataByteLength += 4;
  }
}

exports.Bvffer = Bvffer;
