import * as BaseTag from '../base_tag.d';

export = class TAGIntArray extends BaseTag {
  getType(): 'TAG_Int_Array';

  getValue(): number[];
  setValue(value: number[]): void;

  unshift(value: number): number;
  shift(): number;
  push(value: number): number;
  pop(): number;
  insert(value: number, pos: number): void;
}
