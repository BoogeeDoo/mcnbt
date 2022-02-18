import BaseTag from '../base_tag.d';

/**
 * The TAGString class
 */
declare class TAGString extends BaseTag {
  setValue(value: string): void;
  getValue(): string;
}

export = TAGString;
