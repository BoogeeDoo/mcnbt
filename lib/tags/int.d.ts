import * as BaseTag from '../base_tag.d';

export = class TAGInt extends BaseTag {
  getType(): 'TAG_Int';

  getValue(): number;
  setValue(value: number): void;
}
