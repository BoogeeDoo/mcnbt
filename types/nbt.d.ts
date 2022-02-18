import BaseTag from './lib/base_tag.d';

/**
 * The NBT class
 * @see http://minecraft.gamepedia.com/NBT_Format
 */
declare class NBT {
  root: {};
  /**
   * Load from buffer
   * @param {Buffer} buff The buffer to load from
   * @param {(err?: Error) => void} callback The callback to call when done
   */
  loadFromBuffer(buff: Buffer, callback: (err?: Error) => void): void;
  _buff: Buffer;
  /**
   * Load from compressed buffer
   * @param {Buffer} buff The buffer to load from
   * @param {(err?: Error) => void} callback The callback to call when done
   */
  loadFromZlibCompressedBuffer(buff: Buffer, callback: (err?: Error) => void): void;
  /**
   * Write to compressed buffer
   * @param {(err?: Error, buff?: Buffer) => void} callback The callback to
   *                                                        call when done
   * @param {'gzip'|'deflate'} [method='gzip'] The compression method to use
   */
  writeToCompressedBuffer(callback: (err?: Error, buff?: Buffer) => void, method?: 'gzip' | 'deflate'): void;
  /**
   * Write to buffer
   * @return {Buffer} The buffer
   */
  writeToBuffer(): Buffer;
  /**
   * Select a tag
   * @param {string} tagName the tag name in root
   * @return {BaseTag|null} The tag which matches `tagName`
   */
  select(tagName: string): BaseTag | null;
  /**
   * Alias for `select()`
   * @param {string} tagName the tag name in root
   * @return {BaseTag|null} The tag which matches `tagName`
   */
  get(tagName: string): BaseTag | null;
  /**
   * Get root object's length
   * @return {number} root length
   */
  count(): number;
  /**
   * Get root's keys
   * @return {string[]} root's keys
   */
  keys(): string[];
  /**
   * Inspect
   * @return {string} Inspect string
   */
  inspect(): string;
  /**
   * toString
   * @return {string} String
   */
  toString(): string;
  /**
   * Load NBT structure from file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  loadFromFile(filename: string, callback: (err?: Error) => void): void;
  /**
   * Load NBT structure from zlib compressed file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  loadFromZlibCompressedFile(filename: string, callback: (err?: Error) => void): void;
  /**
   * Write NBT structure to file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   */
  writeToFile(filename: string, callback: (err?: Error) => void): void;
  /**
   * Write NBT structure to zlib compressed file
   * @param {string} filename NBT filename
   * @param {(err?: Error) => void} callback callback function
   * @param {'gzip'|'deflate'} [method='gzip'] The compression method to use
   */
  writeToCompressedFile(filename: string, callback: (err?: Error) => void, method?: 'gzip' | 'deflate'): void;
  /**
   * Calculate buffer length
   * @return {number} buffer length
   */
  calcBufferLength(): number;
  /**
   * toJSON
   * @return {Object} JSON object
   */
  toJSON(): any;
}

declare namespace NBT {
  const Tags: {
    TAGByte: typeof import('./lib/tags/byte');
    TAGShort: typeof import('./lib/tags/short');
    TAGInt: typeof import('./lib/tags/int');
    TAGLong: typeof import('./lib/tags/long');
    TAGFloat: typeof import('./lib/tags/float');
    TAGDouble: typeof import('./lib/tags/double');
    TAGByteArray: typeof import('./lib/tags/byte_array');
    TAGString: typeof import('./lib/tags/string');
    TAGList: typeof import('./lib/tags/list');
    TAGCompound: typeof import('./lib/tags/compound');
    TAGIntArray: typeof import('./lib/tags/int_array');
    1: typeof import('./lib/tags/byte');
    2: typeof import('./lib/tags/short');
    3: typeof import('./lib/tags/int');
    4: typeof import('./lib/tags/long');
    5: typeof import('./lib/tags/float');
    6: typeof import('./lib/tags/double');
    7: typeof import('./lib/tags/byte_array');
    8: typeof import('./lib/tags/string');
    9: typeof import('./lib/tags/list');
    10: typeof import('./lib/tags/compound');
    11: typeof import('./lib/tags/int_array');
    TAG_Byte: number;
    TAG_Short: number;
    TAG_Int: number;
    TAG_Long: number;
    TAG_Float: number;
    TAG_Double: number;
    TAG_Byte_Array: number;
    TAG_String: number;
    TAG_List: number;
    TAG_Compound: number;
    TAG_Int_Array: number;
  };
}

export = NBT;
