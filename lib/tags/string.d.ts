import * as BaseTag from '../base_tag.d';

export = class TAGString extends BaseTag {
  getType(): 'TAG_String';

  getValue(): string;
  setValue(value: string): void;
}
