/**
 * The Bvffer class
 */
declare class Bvffer {
  constructor(buffByteLength: number);

  get dataLength(): number;

  get buff(): Buffer;

  writeBuffer(value): void;

  writeUInt8(value): void;

  writeInt8(value): void;

  writeUInt16BE(value): void;

  writeInt16BE(value): void;

  writeUInt32BE(value): void;

  writeInt32BE(value): void;

  writeFloatBE(value): void;

  writeDoubleBE(value): void;
}

export = Bvffer;
