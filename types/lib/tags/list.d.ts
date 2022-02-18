import BaseTag from '../base_tag.d';

/**
 * The TAGList class
 */
declare class TAGList extends BaseTag {
  childType: string;
  /**
   * Shift the array
   * @return {BaseTag} The value shifted
   */
  shift(): BaseTag;
  /**
   * Unshift the array
   * @param {BaseTag} value The value to unshift
   * @return {number} The new length of the array
   */
  unshift(value: BaseTag): number;
  /**
   * Pop the array
   * @return {BaseTag} The value popped
   */
  pop(): BaseTag;
  /**
   * Push the array
   * @param {BaseTag} value The value to push
   * @return {number} The new length of the array
   */
  push(value: BaseTag): number;
  /**
   * Insert the array
   * @param {BaseTag} value The value to insert
   * @param {number} pos The position to insert
   */
  insert(value: BaseTag, pos: number): void;
  /**
   * Clean the whole list
   */
  clean(): void;

  setValue(value: BaseTag[]): void;
  getValue(): BaseTag[];
}

export = TAGList;
