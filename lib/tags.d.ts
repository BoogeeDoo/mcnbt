import * as TAGByte from './tags/byte.d';
import * as TAGByteArray from './tags/byte_array.d';
import * as TAGCompound from './tags/compound.d';
import * as TAGDouble from './tags/double.d';
import * as TAGFloat from './tags/float.d';
import * as TAGInt from './tags/int.d';
import * as TAGIntArray from './tags/int_array.d';
import * as TAGList from './tags/list.d';
import * as TAGLong from './tags/long.d';
import * as TAGShort from './tags/short.d';
import * as TAGString from './tags/string.d';

export = {
  TAGByte: TAGByte,
  TAGShort: TAGShort,
  TAGInt: TAGInt,
  TAGLong: TAGLong,
  TAGFloat: TAGFloat,
  TAGDouble: TAGDouble,
  TAGByteArray: TAGByteArray,
  TAGString: TAGString,
  TAGList: TAGList,
  TAGCompound: TAGCompound,
  TAGIntArray: TAGIntArray,

  // Class id -> Class
  "1": TAGByte,
  "2": TAGShort,
  "3": TAGInt,
  "4": TAGLong,
  "5": TAGFloat,
  "6": TAGDouble,
  "7": TAGByteArray,
  "8": TAGString,
  "9": TAGList,
  "10": TAGCompound,
  "11": TAGIntArray,

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
