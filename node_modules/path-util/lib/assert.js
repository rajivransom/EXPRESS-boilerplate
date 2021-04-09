'use strict';

// Defines assertion functions used in path-util
var a = module.exports;

function InvalidArgumentException(message) {
  this.message = message;
}

a.array = function (o) {
  if (toString.call(o) !== '[object Array]') {
    throw new InvalidArgumentException('The input is not an array.');
  }
};

a.string = function (o) {
  if (toString.call(o) !== '[object String]') {
    throw new InvalidArgumentException('The input is not a string.');
  }
};

a.allString = function (arr) {
  a.array(arr);

  arr.forEach(function (val) {
    a.string(val);
  });
};
