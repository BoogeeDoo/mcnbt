import BaseTag from '../base_tag.d';

/**
 * The TAGFloat class
 */
declare class TAGFloat extends BaseTag {
  getValue(): number;
  setValue(value: number): void;
}

export = TAGFloat;
