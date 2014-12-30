# MCNBT

Yet another Minecraft NBT format file / buffer parser for Node.js.

## Installation

```shell
$ npm install --save mcnbt
```

## Usage

First require this package into your code:

```javascript
var NBT = require("mcnbt");
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
nbt.loadFromZlibCompressedFile("level.dat", function(err) {
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
> value is `"gzip"`.

