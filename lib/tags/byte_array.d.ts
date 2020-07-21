import BaseTag from '../base_tag.d';

export default class TAGByteArray extends BaseTag {
  getType(): 'TAG_Byte_Array';

  getValue(): number[];
  setValue(value: number[]): void;

  unshift(value: number): number;
  shift(): number;
  push(value: number): number;
  pop(): number;
  insert(value: number, pos: number): void;
}
