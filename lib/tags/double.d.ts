import * as BaseTag from '../base_tag.d';

export = class TAGDouble extends BaseTag {
  getType(): 'TAG_Double';

  getValue(): number;
  setValue(value: number): void;
}
