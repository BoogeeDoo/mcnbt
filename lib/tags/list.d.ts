import * as BaseTag from '../base_tag.d';

export = class TAGList extends BaseTag {
  childType: 'TAG_End';

  getType(): 'TAG_List';

  getValue(): BaseTag[];
  setValue(value: BaseTag[]): void;

  unshift(value: BaseTag): number;
  shift(): BaseTag;
  push(value: BaseTag): number;
  pop(): BaseTag;
  insert(value: BaseTag, pos: number): void;

  clean(): void;
}
