'use strict';

const TAGByte = require('./tags/byte');
const TAGShort = require('./tags/short');
const TAGInt = require('./tags/int');
const TAGLong = require('./tags/long');
const TAGFloat = require('./tags/float');
const TAGDouble = require('./tags/double');
const TAGByteArray = require('./tags/byte_array');
const TAGString = require('./tags/string');
const TAGList = require('./tags/list');
const TAGCompound = require('./tags/compound');
const TAGIntArray = require('./tags/int_array');

module.exports = {
  // Class name -> Class
  TAGByte,
  TAGShort,
  TAGInt,
  TAGLong,
  TAGFloat,
  TAGDouble,
  TAGByteArray,
  TAGString,
  TAGList,
  TAGCompound,
  TAGIntArray,

  // Class id -> Class
  1: TAGByte,
  2: TAGShort,
  3: TAGInt,
  4: TAGLong,
  5: TAGFloat,
  6: TAGDouble,
  7: TAGByteArray,
  8: TAGString,
  9: TAGList,
  10: TAGCompound,
  11: TAGIntArray,

  // Tag name -> Class id
  TAG_Byte: 1,
  TAG_Short: 2,
  TAG_Int: 3,
  TAG_Long: 4,
  TAG_Float: 5,
  TAG_Double: 6,
  TAG_Byte_Array: 7,
  TAG_String: 8,
  TAG_List: 9,
  TAG_Compound: 10,
  TAG_Int_Array: 11,
};
