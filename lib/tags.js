/**
 * XadillaX created at 2014-12-24 15:18:45
 *
 * Copyright (c) 2015 XadillaX' Gensokyo, all rights
 * reserved
 */
var TAGByte = require("./tags/byte");
var TAGShort = require("./tags/short");
var TAGInt = require("./tags/int");
var TAGLong = require("./tags/long");
var TAGFloat = require("./tags/float");
var TAGDouble = require("./tags/double");
var TAGByteArray = require("./tags/byte_array");
var TAGString = require("./tags/string");
var TAGList = require("./tags/list");
var TAGCompound = require("./tags/compound");
var TAGIntArray = require("./tags/int_array");

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
