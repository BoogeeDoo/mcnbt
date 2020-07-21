import * as BaseTag from '../base_tag.d';

export = class TAGFloat extends BaseTag {
  getType(): 'TAG_Float';

  getValue(): number;
  setValue(value: number): void;
}
