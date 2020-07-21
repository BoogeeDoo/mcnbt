import * as BaseTag from '../base_tag.d';

export = class TAGByte extends BaseTag {
  getType(): 'TAG_Byte';

  getValue(): number;
  setValue(value: number): void;
}
