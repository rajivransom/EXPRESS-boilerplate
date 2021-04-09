'use strict';

// Defines some utility functions used in path-util
// Reference: phpjs

var u = module.exports;

u.basename = function (path, suffix) {

  var b = path;
  var lastChar = b.charAt(b.length - 1);

  if (lastChar === '/' || lastChar === '\\') {
    b = b.slice(0, -1);
  }

  b = b.replace(/^.*[\/\\]/g, '');

  if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
    b = b.substr(0, b.length - suffix.length);
  }

  return b;

};

u.allAlpha = function (str) {
  return str.match(/^([a-z])+$/i) !== null;
};

u.trimLeft = function (str, charlist) {

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');

  var re = new RegExp('^[' + charlist + ']+', 'g');
  return (str + '').replace(re, '');

};

u.trimRight = function (str, charlist) {

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');

  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '').replace(re, '');

};
