'use strict';

/**
 * Defines useful functions for pathname manipulations
 *
 * @exports path-util
 * @author Ossama Edbali [ossedb@gmail.com]
 * @version 0.3.0
 * @license MIT
 */
var x = module.exports;

var pathUtils = require('./utils');
var assert = require('./assert');

/**
 * Canonicalizes the given path.
 *
 * @example
 * pathUtil.canonicalize('\node\site\..\css\style.css');
 * // => /node/css/style.css
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.canonicalize = function (path) {

  assert.string(path);

  if (path === '') {
    return '';
  }

  path = x.normalize(path);

  var pathArr = x.split(path);
  var root = pathArr[0];
  var pathWR = pathArr[1];
  var parts = pathWR.split('/');
  var canonicalParts = [];

  parts.forEach(function (part) {
    if (part === '.' || part === '') {
      return;
    }

    if (part === '..' && canonicalParts.length > 0 && canonicalParts[canonicalParts.length - 1] !== '..') {
      canonicalParts.pop();
      return;
    }

    if (part !== '..' || root === '') {
      canonicalParts.push(part);
    }
  });

  return root + canonicalParts.join('/');

};

/**
 * Returns the longest common base path of an array of paths.
 *
 * @example
 * pathUtil.commonPath(['/base/path/sub', '/base/path']);
 * // => '/base/path'
 * @param  {Array} paths An array of paths
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.commonPath = function (paths) {

  assert.allString(paths);

  // Return logic
  var ret = function (commonPath, scheme) {
    var test = commonPath === ''
            || commonPath.length === 3 && commonPath[1] === ':';

    if ((/^(.*):\/\/\/$|^(.*):\/\/\w{1}:\/$/).test(scheme + commonPath)) {
      return scheme + commonPath;
    }

    return test ? commonPath : scheme + (commonPath === '/' ? '/' : commonPath.slice(0, -1));
  };

  var commonPath = '';
  var dirs = [];
  var scheme;

  paths.forEach(function (path) {
    var pos = path.indexOf('://');

    // Get scheme
    if (pos !== -1) {
      scheme = path.substring(0, pos + 3);
      path = path.substring(pos + 3);
    } else {
      scheme = '';
    }

    dirs.push(path.split(/[/\\\\.]/));
  });

  for (var j = 0, len1 = dirs[0].length; j < len1; j++) {
    var s = dirs[0][j];
    for (var i = 1, len2 = paths.length; i < len2; i++) {
      if (s !== dirs[i][j]) {
        return ret(commonPath, scheme);
      }
    }
    commonPath += s + '/';
  }

  return ret(commonPath, scheme);

};

/**
 * Adds a directory ending if not present
 *
 * @example
 * pathUtil.ensureDirectoryEnding('/user/john');
 * // => '/user/john/'
 * @param  {String} path
 * @return {String}
 */
x.ensureDirectoryEnding = function (path) {

  if (path === '') {
    return '/';
  }

  var segments = x.normalize(path).split('/');

  if (segments[segments.length - 1] !== '') {
    segments[segments.length] = '';
    return segments.join('/');
  }

  return x.normalize(path);

};

/**
 * Returns the longest path prefix.
 *
 * @example
 * pathUtil.commonPrefix(['foo', 'foobar']);
 * // => 'foo'
 * @param  {Array} paths The paths from which to find the prefix
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.commonPrefix = function (paths) {

  assert.allString(paths);

  paths.sort();
  var s1 = paths[0];
  var s2 = paths[paths.length - 1];

  for (var i = 0, len = s1.length; i < len; i++) {
    if (s1[i] !== s2[i]) {
      return s1.substring(0, i);
    }
  }

  return s1;

};

/**
 * Returns the path represented by `uri`.
 *
 * @example
 * pathUtil.fromUri('file:///node/site');
 * // => '/node/site'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.fromUri = function (uri) {

  assert.string(uri);

  var path = x.canonicalize(uri);
  var pos = path.indexOf('://');

  // Get scheme
  if (pos !== -1) {
    path = path.substring(pos + 3);
  }

  return path;

};

/**
 * Return the directory name of `path`.
 *
 * @example
 * pathUtil.getDirectory('/node/site/style.css');
 * // => '/node/site'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.getDirectory = function (path) {

  assert.string(path);

  if (path === '') {
    return path;
  }

  path = x.canonicalize(path);

  var pos = path.indexOf('://');
  var scheme;

  // Get scheme
  if (pos !== -1) {
    scheme = path.substring(0, pos + 3);
    path = path.substring(pos + 3);
  } else {
    scheme = '';
  }

  pos = path.lastIndexOf('/');

  if (pos !== -1) {
    // Unix root directory
    if (pos === 0) {
      return scheme + '/';
    }

    // Windows root "C:/"
    if (pos === 2 && pathUtils.allAlpha(path[0]) && path[1] === ':') {
      return scheme + path.substring(0, 3);
    }

    return scheme + path.substring(0, pos);
  }

  return '';

};

/**
 * Returns the file extension of a given path.
 *
 * @example
 * pathUtil.getExtension('/node/site.css');
 * // => 'css'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.getExtension = function (path) {

  assert.string(path);

  if (path === '') {
    return '';
  }

  var pos = path.lastIndexOf('.');
  return pos !== -1 ? path.substring(pos + 1) : '';

};

/**
 * Returns the filename of a given path.
 *
 * @example
 * pathUtil.getFilename('/node/site/style.css')
 * // => 'style.css'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.getFilename = function (path) {

  assert.string(path);

  if (path === '') {
    return '';
  }

  return pathUtils.basename(path);

};

/**
 * Returns the root of a given path.
 *
 * @example
 * pathUtil.getRoot('/js/main.js');
 * // => '/'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.getRoot = function (path) {

  assert.string(path);

  if (path === '') {
    return '';
  }

  var pos = path.indexOf('://');
  var scheme;

  // Get scheme
  if (pos !== -1) {
    scheme = path.substring(0, pos + 3);
    path = path.substring(pos + 3);
  } else {
    scheme = '';
  }

  if (path[0] === '/' || path[0] === '\\') {
    return scheme + '/';
  }

  var len = path.length;

  // Windows root
  if (len > 1 && pathUtils.allAlpha(path[0]) && path[1] === ':') {
    // Special case: "C:"
    if (len === 2) {
      return scheme + path + '/';
    }

    // Normal case: "C:/ or "C:\"
    if (path[2] === '/' || path[2] === '\\') {
      return scheme + path[0] + path[1] + '/';
    }
  }

  return '';

};

/**
 * Returns the segment in a given position `idx`.
 *
 * @example
 * pathUtil.getSegment('/node/site/main.js', 2);
 * // => 'site'
 * @param  {String} path
 * @param  {Number} idx
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.getSegment = function (path, idx) {

  assert.string(path);

  if (path === '') {
    throw new Error('Empty path');
  }

  var pos = path.indexOf('://');

  // Get scheme
  if (pos !== -1) {
    path = path.substring(pos + 3);
  }

  var segments = x.canonicalize(path).split('/');

  if (idx < 0 || idx >= segments.length) {
    throw new Error('Index out of bounds');
  }

  return segments[idx];

};

/**
 * Returns the number of segments in a given path.
 *
 * @example
 * pathUtil.getSegmentCount('test/hello');
 * // => 2
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {Number}
 */
x.getSegmentCount = function (path) {

  assert.string(path);

  if (path === '') {
    throw new Error('Empty path');
  }

  var pos = path.indexOf('://');

  // Get scheme
  if (pos !== -1) {
    path = path.substring(pos + 3);
  }

  var segments = x.canonicalize(path).split('/');
  var allEmpty = true;

  // Check if all segments are empty
  for (var i = 0, len = segments.length; i < len && allEmpty; i++) {
    if (segments[i] !== '') {
      allEmpty = false;
    }
  }

  return allEmpty ? 0 : segments.length;

};

x.hasDirectoryEnding = function (path) {
  if (path === '') {
    return false;
  }

  var segments = x.normalize(path).split('/');
  var last = segments[segments.length - 1];
  return last === '';
};

/**
 * Returns true if a given path has an extension, false otherwise.
 *
 * @example
 * pathUtil.hasExtension('/node/site');
 * // => false
 * @param  {String}        path
 * @param  {Array|String}  extensions Check if the actual extension is in `extensions`
 * @throws {InvalidArgumentException}
 * @return {Boolean}
 */
x.hasExtension = function (path, extensions) {

  assert.string(path);

  if (path === '') {
    return false;
  }

  var exts = typeof extensions === 'undefined' ? [] : (!Array.isArray(extensions) ? [extensions] : extensions);
  var actualExt = x.getExtension(path);

  if (exts.length === 0) {
    return actualExt !== '';
  }

  exts = exts.map(function (ext) {
    return pathUtils.trimLeft(ext, '.');
  });

  return exts.indexOf(actualExt) !== -1;

};

/**
 * Returns true if a given path is absolute, false otherwise.
 *
 * @example
 * pathUtil.isAbsolute('C:/css/style.css');
 * // => true
 * @param  {String}  path
 * @throws {InvalidArgumentException}
 * @return {Boolean}
 */
x.isAbsolute = function (path) {

  assert.string(path);

  if (path === '') {
    return false;
  }

  var pos = path.indexOf('://');

  // Get rid off scheme
  if (pos !== -1) {
    path = path.substring(pos + 3);
  }

  if (path[0] === '/' || path[0] === '\\') {
    return true;
  }

  // Windows root
  if (path.length > 1 && pathUtils.allAlpha(path[0]) && path[1] === ':') {
    // Special case: "C:"
    if (path.length === 2) {
      return true;
    }
    // Normal case: "C:/ or "C:\"
    if (path[2] === '/' || path[2] === '\\') {
      return true;
    }
  }

  return false;

};

/**
 * Returns true if the first argument is a base of the second argument, false otherwise.
 *
 * @example
 * pathUtil.isBasePath('/base/path', '/base/path/sub');
 * // => true
 * @param  {String}  basePath
 * @param  {String}  ofPath
 * @throws {InvalidArgumentException}
 * @return {Boolean}
 */
x.isBasePath = function (basePath, ofPath) {

  assert.string(basePath);
  assert.string(ofPath);

  basePath = x.canonicalize(basePath);
  ofPath = x.canonicalize(ofPath) + '/';

  return ofPath.indexOf(pathUtils.trimRight(basePath, '/') + '/') === 0;

};

/**
 * Returns true if a given path is on the local machine, false otherwise.
 *
 * @example
 * pathUtil.isLocal('http://example.com/bg.jpg');
 * // => false
 * @param  {String}  path
 * @throws {InvalidArgumentException}
 * @return {Boolean}
 */
x.isLocal = function (path) {
  assert.string(path);
  return path !== '' && path.indexOf('://') === -1;
};

/**
 * Returns true if a given path is relative, false otherwise.
 *
 * @example
 * pathUtil.isRelative('node/site/style.css');
 * // => true
 * @param  {String}  path
 * @throws {InvalidArgumentException}
 * @return {Boolean}
 */
x.isRelative = function (path) {
  assert.string(path);
  return !x.isAbsolute(path);
};

/**
 * Iterate through the components/segments of a given path
 *
 * @param  {String}   path
 * @param  {Function} fn
 */
x.iter = function (path, fn) {

  assert.string(path);

  var pos = path.indexOf('://');

  // Throw scheme
  if (pos !== -1) {
    path = path.substring(pos + 3);
  }

  var segments = x.canonicalize(path).split('/');

  segments.forEach(fn, null);

};

/**
 * Joins a given array of paths.
 *
 * @example
 * pathUtil.join(['/path/to/test/', '/subdir']);
 * // => '/path/to/test/subdir'
 * @param  {Array} paths
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.join = function (paths) {

  assert.allString(paths);

  var finalPath = null;
  var wasScheme = false;

  paths.forEach(function (path) {
    if (path === '') {
      return;
    }

    if (finalPath === null) {
      finalPath = path;
      wasScheme = path.indexOf('://') !== -1;
      return;
    }

    if (['/', '\\'].indexOf(finalPath.slice(-1)) === -1) {
      finalPath += '/';
    }

    finalPath += wasScheme ? path : pathUtils.trimLeft(path, '/');
    wasScheme = false;
  });

  if (finalPath === null) {
    return '';
  }

  return x.canonicalize(finalPath);

};

/**
 * Normalizes a path. i.e. converts back-slashes to forward-slashes
 *
 * @example
 * pathUtil.normalize('C:\\user\\docs\\Letter.txt');
 * // => 'C:/user/docs/Letter.txt'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.normalize = function (path) {
  assert.string(path);
  return path.replace(/\\/g, '/');
};

/**
 * Removes the directory ending ('\' or '/')
 *
 * @example
 * pathUtil.removeDirectoryEnding('/user/oss/');
 * // => '/user/oss'
 * @param  {String} path
 * @return {String}
 */
x.removeDirectoryEnding = function (path) {

  if (path === '') {
    return '';
  }

  var segments = x.normalize(path).split('/');

  if (segments[segments.length - 1] === '') {
    segments.pop();
    return segments.join('/');
  }

  return x.normalize(path);

};

/**
 * Replaces the actual path extension with a given extension.
 *
 * @example
 * pathUtil.replaceExtension('/node/site/style.css', 'sass');
 * // => '/node/site/style.sass'
 * @param  {String} path
 * @param  {String} extension
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.replaceExtension = function (path, extension) {

  assert.string(path);
  assert.string(extension);

  if (path === '') {
    return '';
  }

  var actualExt = x.getExtension(path);
  extension = pathUtils.trimLeft(extension, '.');

  // No extension for paths
  if (path.slice(-1) === '/') {
    return path;
  }

  // No actual extension in path
  if (actualExt === '') {
    return path + (path.slice(-1) === '.' ? '' : '.') + extension;
  }

  return path.slice(0, -actualExt.length) + extension;

};

/**
 * Splits a given path into root (1) and the rest (2)
 *
 * @example
 * pathUtil.split('C:/node');
 * // => ['C:/', 'node']
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {Array}
 */
x.split = function (path) {

  assert.string(path);

  if (path === '') {
    return ['', ''];
  }

  var pos = path.indexOf('://');
  var root;

  if (pos !== -1) {
    root = path.substring(0, pos + 3);
    path = path.substring(pos + 3);
  } else {
    root = '';
  }

  var length = path.length;

  if (path[0] === '/') {
    root += '/';
    path = length > 1 ? path.substring(1) : '';
  } else if (length > 1 && pathUtils.allAlpha(path[0]) && path[1] === ':') {
    if (length === 2) {
      // Windows special case: "C:"
      root += path + '/';
      path = '';
    } else if (path[2] === '/') {
      // Windows normal case: "C:/"..
      root += path.substring(0, 3);
      path = length > 3 ? path.substring(3) : '';
    }
  }

  return [root, path];

};

/**
 * Turns a relative path into an absolute path.
 *
 * @example
 * pathUtil.toAbsolute('css/../style.css', '/node/site');
 * // => '/node/site/style.css'
 * @param  {String} path
 * @param  {String} basePath
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.toAbsolute = function (path, basePath) {

  assert.string(path);
  assert.string(basePath);

  if (!x.isAbsolute(basePath)) {
    throw new Error('The given base path is not an absolute path.');
  }

  if (x.isAbsolute(path)) {
    return x.canonicalize(path);
  }

  var pos = basePath.indexOf('://');
  var scheme;

  if (pos !== -1) {
    scheme = basePath.substring(0, pos + 3);
    basePath = basePath.substring(pos + 3);
  } else {
    scheme = '';
  }

  return scheme + x.canonicalize(pathUtils.trimRight(basePath, '/\\\\') + '/' + path);

};

/**
 * Turns a path into a relative path.
 *
 * @example
 * pathUtil.toRelative('/node/site/../css/style.css', '/node/site');
 * // => '../css/style.css'
 * @param  {String} path
 * @param  {String} basePath
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.toRelative = function (path, basePath) {

  assert.string(path);
  assert.string(basePath);

  path = x.canonicalize(path);
  basePath = x.canonicalize(basePath);

  var pathParts = x.split(path);
  var basePathParts = x.split(basePath);
  var root = pathParts[0];
  var relativePath = pathParts[1];
  var baseRoot = basePathParts[0];
  var relativeBasePath = basePathParts[1];

  // If the base path is given as absolute path and the path is already
  // relative, consider it to be relative to the given absolute path
  // already
  if (root === '' && baseRoot !== '') {
    // If base path is already in its root
    if (relativeBasePath === '') {
      relativePath = pathUtils.trimLeft(relativePath, './\\\\');
    }
    return relativePath;
  }

  // Fail if the passed path is absolute and the base path is not
  if (root !== '' && baseRoot === '') {
    throw new Error('You should provide an absolute base path');
  }

  // Fail if the roots of the two paths are different
  if (baseRoot && root !== baseRoot) {
    throw new Error('The paths cannot be made relative because they belong to different roots.');
  }

  if (relativeBasePath === '') {
    return relativePath;
  }

  // Build a "../../" prefix with as many "../" parts as necessary
  var parts = relativePath.split('/');
  var baseParts = relativeBasePath.split('/');
  var dotDotPrefix = '';
  var match = true;

  baseParts.forEach(function (basePart, i) {
    if (match && basePart === parts[i]) {
      parts[i] = null;
      return;
    }

    match = false;
    dotDotPrefix += '../';
  });

  // Remove falsy values from "parts"
  parts = parts.filter(function (part) {
    return part !== null && part !== undefined;
  });

  return pathUtils.trimRight(dotDotPrefix + parts.join('/'), '/');

};

/**
 * Returns the URI that represents `path`.
 *
 * @example
 * pathUtil.toUri('/node/site');
 * // => 'file:///node/site'
 * @param  {String} path
 * @throws {InvalidArgumentException}
 * @return {String}
 */
x.toUri = function (path) {

  assert.string(path);

  path = x.canonicalize(path);
  var pos = path.indexOf('://');

  if (path === '' || pos !== -1) {
    return path;
  }

  var fileScheme = 'file://';
  if (path[0] !== '/' && !(path.length > 1 && pathUtils.allAlpha(path[0]) && path[1] === ':')) {
    path = '/' + path;
  }

  return fileScheme + path;

};
