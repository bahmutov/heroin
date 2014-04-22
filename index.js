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
  expect(obj).to.be.an('object');
  expect(methodName).to.be.a('string');
  if (dependencies) {
    expect(dependencies).to.be.an('object');
  }

  var original = obj[methodName];
  expect(original).to.be.a('function');

  var expected = getExpectedArguments(original);
  expect(expected).to.be.an('array');
  // console.log('expected', expected);

  obj[methodName] = function (runTimeDependencies) {
    runTimeDependencies = _.clone(runTimeDependencies) || {};
    var deps = _.extend(runTimeDependencies, dependencies);
    // console.log('deps', deps);
    var parameters = expected.map(function (name) {
      return deps[name];
    });
    // console.log('parameters', parameters);
    return original.apply(obj, parameters);
  };
}

module.exports = heroin;
