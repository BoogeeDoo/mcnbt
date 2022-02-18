import BaseTag from '../base_tag.d';

/**
 * The TAGCompound class
 */
declare class TAGCompound extends BaseTag {
  /**
   * Get next tag from buffer
   * @param {Buffer} buff The buffer to read from
   * @param {number} offset The offset to start reading from
   * @return {number} The number of bytes read
   */
  _getNextTag(buff: Buffer, offset: number): number;
  /**
   * Set a single tag value by name
   * @param {string} name The name of the tag
   * @param {BaseTag} value The value to set
   * @param {Boolean} [replace=false] Replace the tag if it already exists
   */
  setByName(name: string, value: BaseTag, replace?: boolean): void;
  /**
   * Get tags names
   */
  getNames(): string[];
  /**
   * Delete a tag by name
   * @param {string} name The name of the tag to delete
   */
  deleteByName(name: string): void;
  /**
   * Clean all tags
   */
  clean(): void;

  setValue(value: { [key: string]: BaseTag }): void;
  getValue(): { [key: string]: BaseTag };
}

export = TAGCompound;
