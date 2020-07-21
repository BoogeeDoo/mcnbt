export type JSONObject = { [key: string]: any; };

export = class BaseTag {
  readFromBuffer(buff: Buffer, offset: number): number;
  writeBuffer(buff: Buffer, offset: number): number;
  calcBufferLength(): number;

  getType(): string;
  getName(): string;
  getId(): string;
  getValue(): any;
  setValue(value: any): void;

  getNextTag(buff: Buffer, offset: number): { length: number, tag: BaseTag };

  count(): number;

  selectAt(idx: number): BaseTag|undefined;
  getAt(idx: number): BaseTag|undefined;
  select(name: string): BaseTag|undefined;
  get(name: string): BaseTag|undefined;

  getTypeId(): number;

  inspect(): string;
  toString(): string;
  toJSON(): JSONObject;
}
