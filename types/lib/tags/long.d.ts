import BaseTag from '../base_tag.d';
import Long from 'long';

declare class TAGLong extends BaseTag {
  getValue(): Long;
  setValue(value: string | Long | number): void;
}

export = TAGLong;
