var expect = require('expect.js');
var _ = require('lodash');

function getExpectedArguments(fn) {
  expect(fn).to.be.a('function');

  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var text = fn.toString();
  expect(text).to.be.a('string');
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
    expect(obj).to.be.an('object');
    expect(methodName).to.be.a('string');
    original = obj[methodName];
  }

  if (dependencies) {
    expect(dependencies).to.be.an('object');
  }
  dependencies = dependencies || {};

  expect(original).to.be.a('function');

  var expected = getExpectedArguments(original);
  expect(expected).to.be.an('array');
  // console.log('expected', expected);

  var proxy = function (runTimeDependencies) {
    runTimeDependencies = _.clone(runTimeDependencies) || {};
    var deps = _.extend(dependencies, runTimeDependencies);
    // console.log('deps', deps);
    var parameters = expected.map(function (name) {
      return deps[name];
    });
    // console.log('parameters', parameters);
    return original.apply(obj, parameters);
  };

  if (typeof obj !== 'function') {
    obj[methodName] = proxy;
  }
  return proxy;
}

module.exports = heroin;
