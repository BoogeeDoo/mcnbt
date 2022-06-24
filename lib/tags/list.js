'use strict';

const BaseTag = require('../base_tag');

let $tags;
function getTags() {
  if ($tags) {
    return $tags;
  }

  $tags = require('../tags');
  return $tags;
}

/**
 * The TAGList class
 */
class TAGList extends BaseTag {
  /**
   * constructor
   */
  constructor() {
    super();
    this.type = 'TAG_List';
    this.childType = 'TAG_End';
    this.$tags = getTags();
    this.value = [];
  }

  /**
   * Read body from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _readBodyFromBuffer(buff, offset) {
    const typeId = buff.readUInt8(offset);
    const len = buff.readUInt32BE(offset + 1);

    const Tag = this.$tags[typeId];
    if ((Tag === null || Tag === undefined) && typeId !== 0) {
      throw new Error(`Tag type ${typeId} is not supported yet in list.`);
    }

    if (typeId !== 0) {
      for (const key in this.$tags) {
        if (!this.$tags.hasOwnProperty(key)) continue;
        if (this.$tags[key] === typeId) {
          this.childType = key;
        }
      }
    }

    this.value = [];
    let nextOffset = offset + 1 + 4;
    for (let i = 0; i < len; i++) {
      const element = typeId === 0 ? undefined : new Tag();
      const elementLength =
        typeId === 0 ? 0 : element._readBodyFromBuffer(buff, nextOffset);
      nextOffset += elementLength;

      this.value.push(element);
    }

    return nextOffset - offset;
  }

  /**
   * Calculate buffer length
   * @return {number} The length of the buffer
   */
  calcBufferLength() {
    return this.value.reduce(
      (sum, child) => sum + child.calcBufferLength(),
      1 + 4
    );
  }

  /**
   * Set the whole array
   * @param {BaseTag[]} value The array to set
   */
  setValue(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('Value of TAG_List should be an array.');
    }

    if (value.length === 0) {
      this.value = value;
      return;
    }

    let typeName = this.childType;
    let typeId = this.childType === 'TAG_End' ? 0 : this.$tags[typeName];
    if (!typeId) {
      typeName = value[0].type;
      typeId = this.$tags[typeName];
      if (!typeId) {
        throw new Error('Invalid TAG_List element.');
      }
    }

    const TagType = this.$tags[typeId];
    const array = [];
    for (let i = 0; i < value.length; i++) {
      if (!(value[i] instanceof TagType)) {
        throw new TypeError(
          `Inconsistent TAG_List element type at position ${i}.`
        );
      }

      array.push(value[i]);
    }

    this.childType = typeName;
    this.value = array;
  }

  /**
   * Shift the array
   * @return {BaseTag} The value shifted
   */
  shift() {
    return this.value.shift();
  }

  /**
   * Unshift the array
   * @param {BaseTag} value The value to unshift
   * @return {number} The new length of the array
   */
  unshift(value) {
    let typeName = this.childType;
    let typeId = this.childType === 'TAG_End' ? 0 : this.$tags[typeName];
    if (!typeId) {
      typeName = value.type;
      typeId = this.$tags[typeName];
      if (!typeId) {
        throw new TypeError('Invalid TAG_List element.');
      }
    }

    const TagType = this.$tags[typeId];
    if (!(value instanceof TagType)) {
      throw new TypeError('Element does not TAG_List\'s current type.');
    }

    this.childType = typeName;
    return this.value.unshift(value);
  }

  /**
   * Pop the array
   * @return {BaseTag} The value popped
   */
  pop() {
    return this.value.pop();
  }

  /**
   * Push the array
   * @param {BaseTag} value The value to push
   * @return {number} The new length of the array
   */
  push(value) {
    let typeName = this.childType;
    let typeId = this.childType === 'TAG_End' ? 0 : this.$tags[typeName];
    if (!typeId) {
      typeName = value.type;
      typeId = this.$tags[typeName];
      if (!typeId) {
        throw new TypeError('Invalid TAG_List element.');
      }
    }

    const TagType = this.$tags[typeId];
    if (!(value instanceof TagType)) {
      throw new TypeError('Element does not TAG_List\'s current type.');
    }

    this.childType = typeName;
    return this.value.push(value);
  }

  /**
   * Insert the array
   * @param {BaseTag} value The value to insert
   * @param {number} pos The position to insert
   */
  insert(value, pos) {
    let typeName = this.childType;
    let typeId = this.childType === 'TAG_End' ? 0 : this.$tags[typeName];
    if (!typeId) {
      typeName = value.type;
      typeId = this.$tags[typeName];
      if (!typeId) {
        throw new TypeError('Invalid TAG_List element.');
      }
    }

    const TagType = this.$tags[typeId];
    if (!(value instanceof TagType)) {
      throw new TypeError('Element does not TAG_List\'s current type.');
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
   * Clean the whole list
   */
  clean() {
    this.value = [];
  }

  /**
   * Write body to buffer
   * @param {Buffer} buff The buffer to write to
   */
  writeBuffer(buff) {
    // no element
    if (!this.value.length) {
      buff.writeUInt8(0);
      buff.writeUInt32BE(0);
      return;
    }

    buff.writeUInt8(this.value[0].getTypeId());
    buff.writeUInt32BE(this.value.length);

    for (let i = 0; i < this.value.length; i++) {
      this.value[i].writeBuffer(buff);
    }
  }
}

module.exports = TAGList;
