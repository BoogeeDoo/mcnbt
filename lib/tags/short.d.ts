import * as BaseTag from '../base_tag.d';

export = class TAGShort extends BaseTag {
  getType(): 'TAG_Short';

  getValue(): number;
  setValue(value: number): void;
}
