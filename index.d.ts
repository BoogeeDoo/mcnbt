export * from './tags.d';

type Callback<T> = (err: undefined|Error, ret?: T) => void;

interface TagsType {
  TAGByte: new () => TAGByte,
  TAGShort: new () => TAGShort,
  TAGInt: new () => TAGInt,
  TAGLong: new () => TAGLong,
  TAGFloat: new () => TAGFloat,
  TAGDouble: new () => TAGDouble,
  TAGByteArray: new () => TAGByteArray,
  TAGString: new () => TAGString,
  TAGList: new () => TAGList,
  TAGCompound: new () => TAGCompound,
  TAGIntArray: new () => TAGIntArray,

  "1": new () => AGByte,
  "2": new () => AGShort,
  "3": new () => AGInt,
  "4": new () => AGLong,
  "5": new () => AGFloat,
  "6": new () => AGDouble,
  "7": new () => AGByteArray,
  "8": new () => AGString,
  "9": new () => AGList,
  "10": new () =>TAGCompound,
  "11": new () =>TAGIntArray,

  TAG_Byte: number,
  TAG_Short: number,
  TAG_Int: number,
  TAG_Long: number,
  TAG_Float: number,
  TAG_Double: number,
  TAG_Byte_Array: number,
  TAG_String: number,
  TAG_List: number,
  TAG_Compound: number,
  TAG_Int_Array: number,
}

export = class NBT {
  loadFromBuffer(buff: Buffer, callback: Callback<void>): void;
  loadFromZlibCompressedBuffer(buff: Buffer, callback: Callback<void>): void;

  writeToCompressedBuffer(callback: Callback<void>, method?: string): void;
  writeToBuffer(): Buffer;

  static Tags: TagsType;
}
