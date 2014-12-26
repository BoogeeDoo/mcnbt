/**
 * XadillaX created at 2014-12-24 15:18:45
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */
var BaseTag = require("./base");
var util = require("util");
var bignum = require("bignum");

var _returnSize = function(size) {
    return function() { return size; };
};

var TAGByte = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte";
};

util.inherits(TAGByte, BaseTag);

TAGByte.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt8(offset);
    return 1;
};

TAGByte.prototype.calcBufferLength = _returnSize(1);

TAGByte.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt8(this.value, offset);
    return 1;
};

TAGByte.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Value of TAG_Byte should between -128 and 127.");
    }
    this.value = value;
};

var TAGShort = function() {
    BaseTag.call(this);
    this.type = "TAG_Short";
};

util.inherits(TAGShort, BaseTag);

TAGShort.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt16BE(offset);
    return 2;
};

TAGShort.prototype.calcBufferLength = _returnSize(2);

TAGShort.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt16BE(this.value, offset);
    return 2;
};

TAGShort.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -32768 || value > 32767 || isNaN(value)) {
        throw new Error("Value of TAG_Short should between -32768 and 32767.");
    }
    this.value = value;
};

var TAGInt = function() {
    BaseTag.call(this);
    this.type = "TAG_Int";
};

util.inherits(TAGInt, BaseTag);

TAGInt.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readInt32BE(offset);
    return 4;
};

TAGInt.prototype.calcBufferLength = _returnSize(4);

TAGInt.prototype.writeBuffer = function(buff, offset) {
    buff.writeInt32BE(this.value, offset);
    return 4;
};

TAGInt.prototype.setValue = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Value of TAG_Int should between -2147483648 and 2147483647.");
    }
    this.value = value;
};

var TAGLong = function() {
    BaseTag.call(this);
    this.type = "TAG_Long";
};

util.inherits(TAGLong, BaseTag);

TAGLong.prototype._readBodyFromBuffer = function(buff, offset) {
    var sliced = buff.slice(offset, offset + 8);
    this.value = bignum.fromBuffer(sliced, { size: 8 });
    return 8;
};

TAGLong.prototype.calcBufferLength = _returnSize(8);

TAGLong.prototype.writeBuffer = function(buff, offset) {
    this.value.toBuffer({ endian: "big", size: 8 }).copy(buff, offset);
    return 8;
};

var _longBound = {
    min: bignum("-9223372036854775808"),
    max: bignum("9223372036854775807")
};

TAGLong.prototype.setValue = function(value) {
    var temp = -1;
    if(typeof value === "string") {
        temp = bignum(value);
    } else if(value instanceof bignum) {
        temp = value;
    } else if(typeof value === "number" && !isNaN(value)) {
        temp = bignum(value);
    }

    if(-1 === temp) {
        throw new Error("Wrong type to set TAG_Long's value.");
    }

    if(temp.lt(_longBound.min) || temp.gt(_longBound.max)) {
        throw new Error("Value of TAG_Long should between " +
                        "-9223372036854775808 and 9223372036854775807");
    }

    this.value = temp;
};

var TAGFloat = function() {
    BaseTag.call(this);
    this.type = "TAG_Float";
};

util.inherits(TAGFloat, BaseTag);

TAGFloat.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readFloatBE(offset);
    return 4;
};

TAGFloat.prototype.calcBufferLength = _returnSize(4);

TAGFloat.prototype.writeBuffer = function(buff, offset) {
    buff.writeFloatBE(this.value, offset);
    return 4;
};

TAGFloat.prototype.setValue = function(value) {
    value = parseFloat(value);
    if(value < -3.4e+38 || value > 3.4e+38 || isNaN(value)) {
        throw new Error("Value of TAG_Float should between -3.4E+38 and 3.4E+38.");
    }
    this.value = value;
};

var TAGDouble = function() {
    BaseTag.call(this);
    this.type = "TAG_Double";
};

util.inherits(TAGDouble, BaseTag);

TAGDouble.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = buff.readDoubleBE(offset);
    return 8;
};

TAGDouble.prototype.calcBufferLength = _returnSize(8);

TAGDouble.prototype.writeBuffer = function(buff, offset) {
    buff.writeDoubleBE(this.value, offset);
    return 8;
};

TAGDouble.prototype.setValue = function(value) {
    value = parseFloat(value);
    if(isNaN(value)) {
        throw new Error("Bad value for TAG_Double.");
    }
    this.value = value;
};

var TAGByteArray = function() {
    BaseTag.call(this);
    this.type = "TAG_Byte_Array";
};

util.inherits(TAGByteArray, BaseTag);

TAGByteArray.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt32BE(offset);
    var nextOffset = offset + 4;
    var endOffset  = nextOffset + len;
    this.value     = [];

    for(var i = nextOffset; i < endOffset; i++) {
        this.value.push(buff.readInt8(i));
    }

    return 4 + len;
};

TAGByteArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length;
};

TAGByteArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeInt8(this.value[i], offset + 4 + i);
    }

    return 4 + this.value.length;
};

TAGByteArray.prototype.setValue = function(array) {
    if(!util.isArray(array)) {
        throw new Error("Value of TAG_Byte_Array should be an array.");
    }

    var newArray = [];
    for(var i = 0; i < array.length; i++) {
        newArray.push(parseInt(array[i]));
        if(newArray[i] < -128 || newArray[i] > 127 || isNaN(newArray[i])) {
            throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
        }
    }

    this.value = newArray;
};

TAGByteArray.prototype.shift = function() {
    return this.value.shift();
};

TAGByteArray.prototype.unshift = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    return this.value.unshift(value);
};

TAGByteArray.prototype.push = function(value) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    return this.value.push(value);
};

TAGByteArray.prototype.pop = function() {
    return this.value.pop();
};

TAGByteArray.prototype.insert = function(value, pos) {
    value = parseInt(value);
    if(value < -128 || value > 127 || isNaN(value)) {
        throw new Error("Each element in TAG_Byte_Array should between -128 and 127.");
    }
    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

var TAGString = function() {
    BaseTag.call(this);
    this.type = "TAG_String";
};

util.inherits(TAGString, BaseTag);

TAGString.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt16BE(offset);
    var nextOffset = offset + 2;
    this.value     = buff.toString("utf8", nextOffset, nextOffset + len);
    return 2 + len;
};

TAGString.prototype.calcBufferLength = function() {
    return 2 + Buffer.byteLength(this.value, "utf8");
};

TAGString.prototype.writeBuffer = function(buff, offset) {
    var strBuff = new Buffer(this.value, "utf8");

    strBuff.copy(buff, offset + 2);
    buff.writeUInt16BE(strBuff.length, offset);

    return 2 + strBuff.length;
};

TAGString.prototype.setValue = function(value) {
    if(typeof value !== "string") value = value.toString();
    if(value.length > 65536) {
        throw new Error("Value of TAG_String's length should greater than 65536.");
    }
    this.value = value;
};

var TAGList = function() {
    BaseTag.call(this);
    this.type = "TAG_List";
    this.childType = "TAG_End";
};

util.inherits(TAGList, BaseTag);

TAGList.prototype._readBodyFromBuffer = function(buff, offset) {
    var typeId = buff.readUInt8(offset);
    var len = buff.readUInt32BE(offset + 1);

    var Tag = module.exports[typeId];
    if((null === Tag || undefined === Tag) && 0 !== typeId) {
        throw new Error("Tag type " + typeId + " is not supported yet in list.");
    }

    if(0 !== typeId) {
        for(var key in module.exports) {
            if(!module.exports.hasOwnProperty(key)) continue;
            if(module.exports[key] === typeId) {
                this.childType = key;
            }
        }
    }

    this.value = [];
    var nextOffset = offset + 1 + 4;
    for(var i = 0; i < len; i++) {
        var element = (typeId === 0) ? undefined : new Tag();
        var elementLength = (typeId === 0) ? 0 : element._readBodyFromBuffer(buff, nextOffset);
        nextOffset += elementLength;

        this.value.push(element);
    }

    return nextOffset - offset;
};

TAGList.prototype.calcBufferLength = function() {
    return this.value.reduce(function(sum, child) {
        return sum + child.calcBufferLength();
    }, 1 + 4);
};

TAGList.prototype.setValue = function(value) {
    if(!util.isArray(value)) {
        throw new Error("Value of TAG_List should be an array.");
    }

    if(value.length === 0) {
        this.value = value;
        return;
    }

    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value[0].type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    var array = [];
    for(var i = 0; i < value.length; i++) {
        if(!(value[i] instanceof TagType)) {
            throw new Error("Inconsistent TAG_List element type at position " + i + ".");
        }

        array.push(value[i]);
    }

    this.childType = typeName;
    this.value = array;
};

TAGList.prototype.shift = function() {
    return this.value.shift();
};

TAGList.prototype.unshift = function(value) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    this.childType = typeName;
    return this.value.unshift(value);
};

TAGList.prototype.push = function(value) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    this.childType = typeName;
    return this.value.push(value);
};

TAGList.prototype.pop = function() {
    return this.value.pop();
};

TAGList.prototype.insert = function(value, pos) {
    var typeName = this.childType;
    var typeId = this.childType === "TAG_End" ? 0 : module.exports[typeName];
    if(!typeId) {
        typeName = value.type;
        typeId = module.exports[typeName];
        if(!typeId) {
            throw new Error("Invalid TAG_List element.");
        }
    }

    var TagType = module.exports[typeId];
    if(!(value instanceof TagType)) {
        throw new Error("Element does not TAG_List's current type.");
    }

    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

TAGList.prototype.clean = function() {
    this.value = [];
};

TAGList.prototype.writeBuffer = function(buff, offset) {
    // no element
    if(!this.value.length) {
        buff.writeUInt8(0, offset);
        buff.writeUInt32BE(0, offset + 1);
        return 1 + 4;
    }

    buff.writeUInt8(this.value[0].getTypeId(), offset);
    buff.writeUInt32BE(this.value.length, offset + 1);
    var len = 0;
    var baseOffset = offset + 1 + 4;
    for(var i = 0; i < this.value.length; i++) {
        len += this.value[i].writeBuffer(buff, baseOffset + len);
    }

    return len + 1 + 4;
};

var TAGCompound = function() {
    BaseTag.call(this);
    this.type = "TAG_Compound";
};

util.inherits(TAGCompound, BaseTag);

TAGCompound.prototype._getNextTag = function(buff, offset) {
    var tagType = buff.readUInt8(offset);
    if(tagType < 0) {
        throw new Error("Unknown tag type - " + tagType + ".");
    }

    if(tagType === 0) {
        return -1;
    }

    var Tag = module.exports[tagType];
    if(null === Tag || undefined === Tag) {
        throw new Error("Tag type " + tagType + " is not supported by this module yet.");
    }

    var tag = new Tag();
    var len = tag.readFromBuffer(buff, offset);
    this.value[tag.id] = tag;
    return len;
};

TAGCompound.prototype._readBodyFromBuffer = function(buff, offset) {
    this.value = {};

    var nextOffset = offset;
    while(true) {
        var len = this._getNextTag(buff, nextOffset);
        if(len === -1) break;
        nextOffset += len;
    }

    return nextOffset - offset + 1;
};

TAGCompound.prototype.calcBufferLength = function() {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        // child type id for 1 byte, child name length for 2 bytes and child
        // name for (child name length) byte(s).
        len += 1;
        len += 2;
        len += Buffer.byteLength(this.value[key].id, "utf8");

        // add the child body's length
        len += this.value[key].calcBufferLength();
    }

    // TAG_End
    len += 1;

    return len;
};

TAGCompound.prototype.writeBuffer = function(buff, offset) {
    var len = 0;
    for(var key in this.value) {
        if(!this.value.hasOwnProperty(key)) continue;

        var object = this.value[key];
        buff.writeUInt8(object.getTypeId(), offset + len);
        
        var nameBuff = new Buffer(object.id, "utf8");
        nameBuff.copy(buff, offset + len + 1 + 2);
        buff.writeUInt16BE(nameBuff.length, offset + len + 1);

        len += object.writeBuffer(buff, offset + len + 1 + 2 + nameBuff.length);
        len += (1 + 2 + nameBuff.length);
    }

    buff.writeUInt8(0, offset + len);
    len += 1;
    return len;
};

TAGCompound.prototype.setValue = function(value) {
    if(typeof value !== "object") {
        throw new Error("Invalid TAG_Compound value.");
    }

    var res = {};
    for(var key in value) {
        if(!value.hasOwnProperty(key)) continue;
        var object = value[key];
        if(!(object instanceof BaseTag)) {
            throw new Error("Invalid TAG_Compound element in key \"" + key + "\".");
        }

        res[key] = value;
    }

    this.value = res;
};

TAGCompound.prototype.setByName = function(name, value, replace) {
    if(this.value[name] !== undefined && !replace) {
        throw new Error("Existing TAG_Compound value's name.");
    }

    if(typeof value !== "object") {
        throw new Error("Invalid TAG_Compound value.");
    }

    if(!(value instanceof BaseTag)) {
        throw new Error("Invalid TAG_Compound element.");
    }

    this.value[name] = value;
};

TAGCompound.prototype.deleteByName = function(name) {
    delete this.value[name];
};

TAGCompound.prototype.clean = function() {
    this.value = {};
};

var TAGIntArray = function() {
    BaseTag.call(this);
    this.type = "TAG_Int_Array";
};

util.inherits(TAGIntArray, BaseTag);

TAGIntArray.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt32BE(offset);
    var nextOffset = offset + 4;
    var endOffset  = nextOffset + len * 4;
    this.value     = [];

    for(var i = nextOffset; i < endOffset; i += 4) {
        this.value.push(buff.readInt32BE(i));
    }

    return 4 + len * 4;
};

TAGIntArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length * 4;
};

TAGIntArray.prototype.setValue = function(array) {
    if(!util.isArray(array)) {
        throw new Error("Value of TAG_Int_Array should be an array.");
    }

    var newArray = [];
    for(var i = 0; i < array.length; i++) {
        newArray.push(parseInt(array[i]));
        if(newArray[i] < -2147483648 || newArray[i] > 2147483647 || isNaN(newArray[i])) {
            throw new Error("Each element in TAG_Int_Array should between " + 
                            "-2147483648 and 2147483647.");
        }
    }

    this.value = newArray;
};

TAGIntArray.prototype.shift = function() {
    return this.value.shift();
};

TAGIntArray.prototype.unshift = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    return this.value.unshift(value);
};

TAGIntArray.prototype.push = function(value) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    return this.value.push(value);
};

TAGIntArray.prototype.pop = function() {
    return this.value.pop();
};

TAGIntArray.prototype.insert = function(value, pos) {
    value = parseInt(value);
    if(value < -2147483648 || value > 2147483647 || isNaN(value)) {
        throw new Error("Each element in TAG_Int_Array should between " +
                        "-2147483648 and 2147483647.");
    }
    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};


TAGIntArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeInt32BE(this.value[i], offset + 4 + i * 4);
    }

    return 4 + this.value.length * 4;
};

module.exports = {
    // Class name -> Class
    TAGByte        : TAGByte,
    TAGShort       : TAGShort,
    TAGInt         : TAGInt,
    TAGLong        : TAGLong,
    TAGFloat       : TAGFloat,
    TAGDouble      : TAGDouble,
    TAGByteArray   : TAGByteArray,
    TAGString      : TAGString,
    TAGList        : TAGList,
    TAGCompound    : TAGCompound,
    TAGIntArray    : TAGIntArray,

    // Class id -> Class
    "1"            : TAGByte,
    "2"            : TAGShort,
    "3"            : TAGInt,
    "4"            : TAGLong,
    "5"            : TAGFloat,
    "6"            : TAGDouble,
    "7"            : TAGByteArray,
    "8"            : TAGString,
    "9"            : TAGList,
    "10"           : TAGCompound,
    "11"           : TAGIntArray,

    // Tag name -> Class id
    TAG_Byte       : 1,
    TAG_Short      : 2,
    TAG_Int        : 3,
    TAG_Long       : 4,
    TAG_Float      : 5,
    TAG_Double     : 6,
    TAG_Byte_Array : 7,
    TAG_String     : 8,
    TAG_List       : 9,
    TAG_Compound   : 10,
    TAG_Int_Array  : 11
};

