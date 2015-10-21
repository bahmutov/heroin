;(function initHeroin() {
  'use strict';

  function getExpectedArguments(fn) {
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var text = fn.toString();
    var args = text.match(FN_ARGS)[1].split(',');
    args = args.map(function (name) {
      return name.trim();
    });
    return args;
  }

  function heroin(obj, methodName, dependencies) {
    var original;

    if (typeof obj === 'function') {
      original = obj;
      dependencies = methodName;
    } else {
      original = obj[methodName];
    }

    dependencies = dependencies || {};

    var expected = getExpectedArguments(original);

    var proxy = function () {
      var runtimeArgs = Array.prototype.slice.call(arguments, 0);
      var parameters = expected.map(function (name) {
        if (dependencies.hasOwnProperty(name)) {
          return dependencies[name];
        } else {
          return runtimeArgs.shift();
        }
      });
      // console.log('parameters', parameters);
      return original.apply(obj, parameters);
    };

    if (typeof obj !== 'function') {
      obj[methodName] = proxy;
    }
    return proxy;
  }

  if (typeof module === 'object') {
    module.exports = heroin;
  }
  if (typeof window === 'object') {
    /* global window: true */
    window.heroin = heroin;
  }
}());
