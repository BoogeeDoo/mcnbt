import Long from 'long';

import * as BaseTag from '../base_tag.d';

export = class TAGLong extends BaseTag {
  getType(): 'TAG_Long';

  getValue(): Long;
  setValue(value: Long): void;
}
