import BaseTag from '../base_tag.d';

/**
 * The TAGIntArray class
 */
declare class TAGIntArray extends BaseTag {
  /**
   * Shift the array
   * @return {number} The value shifted
   */
  shift(): number;
  /**
   * Unshift the array
   * @param {number} value The value to unshift
   * @return {number} The new length of the array
   */
  unshift(value: number): number;
  /**
   * Pop the array
   * @return {number} The value popped
   */
  pop(): number;
  /**
   * Push the array
   * @param {number} value The value to push
   * @return {number} The new length of the array
   */
  push(value: number): number;
  /**
   * Insert the array
   * @param {number} value The value to insert
   * @param {number} pos The position to insert
   */
  insert(value: number, pos: number): void;

  getValue(): number[];
}

export = TAGIntArray;
