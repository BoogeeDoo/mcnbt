# MCNBT

[![npm](https://img.shields.io/npm/v/mcnbt)](https://www.npmjs.com/package/mcnbt)
[![Downloads](https://img.shields.io/npm/dm/mcnbt)](https://www.npmjs.com/package/mcnbt)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/BoogeeDoo/mcnbt/Node.js%20CI)](https://github.com/BoogeeDoo/mcnbt/actions/workflows/node.js.yml)
[![Coveralls](https://img.shields.io/coveralls/github/BoogeeDoo/mcnbt)](https://coveralls.io/github/BoogeeDoo/mcnbt)
[![License](https://img.shields.io/npm/l/mcnbt)](https://github.com/BoogeeDoo/mcnbt/blob/master/LICENSE)
[![Dependencies](https://img.shields.io/librariesio/release/npm/mcnbt)](https://libraries.io/npm/mcnbt)

Yet another Minecraft NBT format file / buffer parser for Node.js.

## Installation

```shell
$ npm install --save mcnbt
```

## Usage

First require this package into your code:

```javascript
const NBT = require('mcnbt');
```

### Load & Parse NBT

There're several function for you to parse an NBT structure after you instantiating
an object:

+ `loadFromBuffer(buff, callback)`
+ `loadFromZlibCompressedBuffer(buff, callback)`
+ `loadFromFile(filename, callback)`
+ `loadFromZlibCompressedFile(filename, callback)`

All those functions's callback should be written like:

```javascript
function(err) {
  //... Your code here
}
```

For an example:

```javascript
var nbt = new NBT();
nbt.loadFromZlibCompressedFile('level.dat', function(err) {
  if(err) return console.error(err);
  console.log(nbt);
});
```

### Write Back To NBT

Two methods for you to write NBT:

+ `writeToCompressedBuffer(callback, [method])`
+ `writeToBuffer()`: returns the buffer (sync)
+ `writeToCompressedFile(filename, callback, [method])`
+ `writeToFile(filename, callback)`

> `method` is an optional parameter that indicates the zlib algorithm. The default
> value is `'gzip'`.

### Get Tag(s)

After parsing your NBT, you can get the root tag(s).

+ `keys()`: get the root tag-key(s) into an array
+ `count()`: root tag(s) count
+ `select(tagname)`: this function will returns you a instance of tag which named `tagname`

> The tag(s) are instance(s) of `BaseTag`. There're 10 subclasses of `BaseTag`.

## Tag Class

All the tag classes's parent class is `BaseTag`.

`BaseTag` and all of the tags have functions below:

+ `getType()`: get this tag's type name. eg. `'TAG_Compound'`
+ `getId()`: alias of `getType`
+ `getTypeId()`: get this tag's type id. eg. `'TAG_Compound'`'s id is `10`
+ `getName()`: get this tag's name
+ `getValue()`: get this tag's content
+ `setValue(value)`: set this tag's value
+ `count()`: get this tag's children count / length (if any)
+ `selectAt(idx)`: get this tag's children / char at `idx` (if any)
+ `select(tagname)`: get this tag's children by `tagname` (if any)
+ `getAt(idx)`: alias of `selectAt`
+ `get(tagname)`: alias of `select`
+ `toJSON()`: convert this tag and all of its children into a JSON object

### TAGByte

The value's type is byte (number in js).

No extra method.

### TAGShort

The value's type is short (number in js).

No extra method.

### TAGInt

The value's type is integer (number in js).

No extra method.

### TAGLong

The value's type is long long ([bignum](https://github.com/justmoon/node-bignum)
in js).

No extra method.

### TAGFloat

The value's type is float (number in js).

No extra method.

### TAGDouble

The value's type is double (nbumer in js).

No extra method.

### TAGByteArray

The value's type is array of byte (array of number in js).

There're 5 extra methods:

+ `shift()`
+ `unshift(value)`
+ `pop()`
+ `push(value)`
+ `insert(value, position)`

### TAGString

The value's type is string.

No extra method.

### TAGList

The value's type is array of any `Tag` instances (array of `Tag` instances in js).

There're 6 extra methods:

+ `shift()`
+ `unshift(value)`
+ `pop()`
+ `push(value)`
+ `insert(value, position)`
+ `clean()`

### TAGCompound

The value's type is object contains any `Tag` instances.

There're 4 extra methods:

+ `setByName(name, value, [replace])`: set `name` child into a certain `Tag` instance.
  if `replace` equals to `false`, it won't replace an exsiting child. `replace` defaults to `false`
+ `getNames()`: get children's names
+ `deleteByName(name)`: delete a child tag by tag name
+ `clean()`: clean all children

### TAGIntArray

The value's type is array of integer (array of number in js).

There're 5 extra methods:

+ `shift()`
+ `unshift(value)`
+ `pop()`
+ `push(value)`
+ `insert(value, position)`

## Example

You may refer to `test/test.js`:

```javascript
var NBT = require('../nbt');
var nbt = new NBT();
nbt.loadFromZlibCompressedFile('./level.dat', function(err) {
  if(err) return console.error(err);
  var gameRules = nbt.select('').select('Data').select('GameRules');
  console.log(gameRules.getType());
  console.log(gameRules.getTypeId());
  console.log(gameRules.toString());
});
```

## Contribute

You're welcome to pull requests!

「雖然我覺得不怎麼可能有人會關注我」
