/**
 * The BaseTag class
 */
declare class BaseTag {
  /**
   * Generate a function that always returns `size`
   * @param {number} size the size to return
   * @return {() => number} the function
   */
  static _returnSize(size: number): () => number;
  type: string;
  id: string;
  value: any;
  /**
   * Read body information from buffer (private & to be inherited)
   * @param {Buffer} buff the buffer to read from
   * @param {number} offset the offset to start reading from
   * @return {number} the number of bytes read
   */
  _readBodyFromBuffer(buff: Buffer, offset: number): number;
  /**
   * Read name information from buffer (private)
   * @param {Buffer} buff the binary buffer data
   * @param {number} offset offset in buffer
   * @return {number} the whole name column byte length
   */
  _readNameFromBuffer(buff: Buffer, offset: number): number;
  /**
   * Read tag(s) from buffer
   * @param {Buffer} buff the binary buffer data
   * @param {number} offset offset in buffer
   * @return {number} parsed length in buffer
   */
  readFromBuffer(buff: Buffer, offset: number): number;
  /**
   * Get tag type
   * @return {string} tag type
   */
  getType(): string;
  /**
   * Get name
   * @return {string} tag name
   */
  getName(): string;
  /**
   * Alias for getName()
   * @return {string} tag name
   */
  getId(): string;
  /**
   * Get value
   * @return {any} tag value
   */
  getValue(): any;
  /**
   * Get this tag's list / object length
   * @return {number} length
   */
  count(): number;
  /**
   * Select a child tag at index
   * @param {number} index the child tag index
   * @return {BaseTag | number} the tag matches `index`
   */
  selectAt(index: number): BaseTag | number;
  /**
   * Select a child tag
   * @param {string} tagName child tag name
   * @return {BaseTag} the tag matches `tagName`
   */
  select(tagName: string): BaseTag;
  /**
   * Get type id
   * @return {number} tag type id
   */
  getTypeId(): number;
  /**
   * Alias for select()
   * @param {string} tagName child tag name
   * @return {BaseTag} the tag matches `tagName`
   */
  get(tagName: string): BaseTag;
  /**
   * Alias for selectAt()
   * @param {number} index the child tag index
   * @return {BaseTag | number} the tag matches `index`
   */
  getAt(index: number): BaseTag | number;
  /**
   * Inspect
   * @return {string} string representation
   */
  inspect(): string;
  /**
   * toString
   * @return {string} string representation
   */
  toString(): string;
  /**
   * toJSON
   * @return {Object} json representation
   */
  toJSON(): any;
  /**
   * Write body to buffer (to be inherited)
   * @param {Buffer} buff The buffer to write to
   * @param {number} offset The offset to start writing to
   * @return {number} The number of bytes written
   */
  writeBuffer(buff: Buffer, offset: number): number;
  /**
   * Calculate buffer length (to be inherited)
   * @return {number} The length of the buffer
   */
  calcBufferLength(): number;
  /**
   * Set the value of this tag
   * @param {any} value The value to set
   */
  setValue(value: any): void;
  /**
   * Get next tag
   * @param {Buffer} buff the buffer data
   * @param {number} offset offset in buffer
   * @return {{ length: number, tag: BaseTag }} The next tag information
   */
  static getNextTag(buff: Buffer, offset: number): {
    length: number;
    tag: BaseTag;
  };
}

export = BaseTag;
