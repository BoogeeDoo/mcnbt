'use strict';

/**
v: 2.0.1 , r: 1b x 66,319 ops/sec ±70.40% (88 runs sampled)
v: 2.0.1 , r: 1kb x 32,589 ops/sec ±0.96% (90 runs sampled)
v: 2.0.1 , r: 2kb x 18,932 ops/sec ±0.51% (93 runs sampled)
v: 2.0.1 , r: 4kb x 10,554 ops/sec ±0.44% (94 runs sampled)
v: 2.0.1 , r: 8kb x 5,425 ops/sec ±0.56% (91 runs sampled)

v: 2.0.2 , r: 1b x 159,682 ops/sec ±0.49% (92 runs sampled)
v: 2.0.2 , r: 1kb x 35,753 ops/sec ±0.57% (90 runs sampled)
v: 2.0.2 , r: 2kb x 19,579 ops/sec ±0.67% (95 runs sampled)
v: 2.0.2 , r: 4kb x 10,397 ops/sec ±0.48% (95 runs sampled)
v: 2.0.2 , r: 8kb x 5,168 ops/sec ±0.35% (95 runs sampled)
*/

let NBT;
let version;

if (process.env.VERSION === '2.0.2') {
  NBT = require('../');
  version = '2.0.2';
} else {
  NBT = require('mcnbt');
  version = '2.0.1';
}

const Benchmark = require('benchmark');

function test(byteCount = 5) {
  const short = new NBT.Tags.TAGShort();
  short.setValue(100);
  short.id = 'short';

  const long = new NBT.Tags.TAGLong();
  long.setValue(1000);
  long.id = 'long';

  const float = new NBT.Tags.TAGFloat();
  float.setValue(1.0);
  float.id = 'float';

  const double = new NBT.Tags.TAGDouble();
  double.setValue(1.0);
  double.id = 'double';

  const byte = new NBT.Tags.TAGByte();
  byte.setValue(1);
  byte.id = 'byte';

  const string = new NBT.Tags.TAGString();
  let str = 'str';
  for (let i = 0; i < byteCount; i++) {
    str += 's';
  }
  string.setValue(str);
  string.id = 'string';

  const intArray = new NBT.Tags.TAGIntArray();
  intArray.setValue(new Array(byteCount).fill(0));
  intArray.id = 'intArray';

  const int = new NBT.Tags.TAGInt();
  int.setValue(1);
  int.id = 'int';

  const list = new NBT.Tags.TAGList();
  list.id = 'list';

  const l = [ short, short ];
  list.setValue(l);

  const resultNBT = new NBT.Tags.TAGCompound();
  resultNBT.id = 'result';
  resultNBT.setValue({
    short,
    long,
    float,
    double,
    byte,
    string,
    intArray,
    int,
    list,
  });

  const nbt = new NBT();
  nbt.root.result = resultNBT;

  return nbt.writeToBuffer().length;
}
console.log('1b:byteLength:', test(), 'b');
console.log('1kb:byteLength:', test(1024), 'b');
console.log('2kb:byteLength:', test(2048), 'b');
console.log('4kb:byteLength:', test(4096), 'b');
console.log('8kb:byteLength:', test(8192), 'b');

const suite = new Benchmark.Suite('', {});

suite
  .add('1b', () => {
    test(1);
  })
  .add('1kb', () => {
    test(1024);
  })
  .add('2kb', () => {
    test(2048);
  })
  .add('4kb', () => {
    test(4096);
  })
  .add('8kb', () => {
    test(8192);
  });

suite
  .on('cycle', event => {
    console.log('v:', version, ', r:', String(event.target));
  })
  .on('complete', () => {
    //
  })
  .run();
