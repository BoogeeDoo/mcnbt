'use strict';

const BaseTag = require('../base_tag');
const Long = require('long');

const LONG_BOUND = {
  MIN: Long.fromString('-9223372036854775808'),
  MAX: Long.fromString('9223372036854775807'),
};

class TAGLong extends BaseTag {
  constructor() {
    super();
    this.type = 'TAG_Long';
  }

  _readBodyFromBuffer(buff, offset) {
    const sliced = buff.slice(offset, offset + 8);
    this.value = Long.fromBytesBE(sliced, true);
    return 8;
  }

  writeBuffer(buff) {
    const bytes = this.value.toBytesBE();
    for (let i = 0; i < 8; i++) {
      buff.writeUInt8(bytes[i]);
    }
  }

  toJSON() {
    return this.value.toString();
  }

  setValue(value) {
    let temp = -1;
    if (typeof value === 'string') {
      temp = new Long(value);
    } else if (value instanceof Long) {
      temp = Long.fromString(value.toString());
    } else if (typeof value === 'number' && !isNaN(value)) {
      temp = Long.fromNumber(value);
    }

    if (temp === -1) {
      throw new Error('Wrong type to set TAG_Long\'s value.');
    }

    if (temp.lessThan(LONG_BOUND.MIN) || temp.greaterThan(LONG_BOUND.MAX)) {
      throw new RangeError(
        'Value of TAG_Long should between -9223372036854775808 and ' +
        '9223372036854775807');
    }

    this.value = temp;
  }
}

TAGLong.prototype.calcBufferLength = BaseTag._returnSize(8);

module.exports = TAGLong;
