import BaseTag from '../base_tag.d';

/**
 * The TAGInt class
 */
declare class TAGInt extends BaseTag {
  getValue(): number;
  setValue(value: number): void;
}

export = TAGInt;
