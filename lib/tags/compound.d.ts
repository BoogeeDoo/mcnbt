import * as BaseTag from '../base_tag.d';

export = class TAGCompound extends BaseTag {
  getType(): 'TAG_Compound';

  getValue(): { [key: string]: BaseTag; };
  setValue(value: { [key: string]: BaseTag; }): void;

  setByName(name: string, value: BaseTag, replace?: boolean): void;
  deleteByName(name: string): void;
  clean(): void;

  getNames(): string[];
}
