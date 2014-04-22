var expect = require('expect.js');
var heroin = require('..');

describe('heroin', function () {
  it('is a function', function () {
    expect(heroin).to.be.a('function');
  });

  it('injects into a function', function () {
    function add(a, b) { return a + b; }
    var values = {
      a: 10,
      b: 22
    };
    var adder = heroin(add, values);
    expect(adder).to.be.a('function');
    expect(adder()).to.equal(32);
  });

  it('changes dependencies', function () {
    function add(a, b) { return a + b; }
    var values = {
      a: 10,
      b: 22
    };
    var adder = heroin(add, values);
    values.a = 100;
    values.b = 2;
    expect(adder()).to.equal(102);
  });

  it('2 injections into a function', function () {
    function add(a, b) { return a + b; }
    var values = {
      a: 10,
      b: 22
    };
    var adder = heroin(add, values);
    var runtimeValues = {
      b: 500
    };
    expect(adder(runtimeValues)).to.equal(510);
  });

  it('injects into a method', function () {
    var foo = {
      getName: function (name) {
        return name;
      }
    };
    var dependencies = {
      name: 'foo'
    };

    heroin(foo, 'getName', dependencies);
    expect(foo.getName).to.be.a('function');
    expect(foo.getName()).to.equal('foo');
  });

  it('does not care about arguments order', function () {
    var foo = {
      minus: function (b, a) {
        return a - b;
      }
    };
    var dependencies = {
      a: 100,
      b: 10
    };

    heroin(foo, 'minus', dependencies);
    expect(foo.minus()).to.equal(90);
  });

  it('injects at runtime', function () {
    var foo = {
      minus: function (b, a) {
        return a - b;
      }
    };
    var dependencies = {
      a: 100,
      b: 10
    };

    heroin(foo, 'minus');
    expect(foo.minus(dependencies)).to.equal(90);
  });

  it('combines deps', function () {
    var foo = {
      minus: function (b, a) {
        return a - b;
      }
    };
    var staticDependencies = {
      b: 10
    };
    var runtimeDependencies = {
      a: 100
    };

    heroin(foo, 'minus', staticDependencies);
    expect(foo.minus(runtimeDependencies)).to.equal(90);
  });

  it('leaves the dependency object unchanged', function () {
    var foo = {
      minus: function (b, a) {
        return a - b;
      }
    };
    var staticDependencies = {
      b: 10
    };
    var runtimeDependencies = {
      a: 100
    };

    heroin(foo, 'minus', staticDependencies);
    foo.minus(runtimeDependencies);
    expect(runtimeDependencies.b).to.be(undefined);
  });
});

describe('QUnit example', function () {
  var modules = [];
  var QUnit = {
    module: function (name, config) {
      modules.push({
        config: config,
        tests: []
      });
    },
    test: function (fn) {
      var m = modules[modules.length - 1];
      expect(m).not.to.be(undefined);
      expect(m.config).to.be.an('object');
      m.tests.push(heroin(fn, m.config));
    }
  };

  QUnit.module('example', {
    a: 10,
    b: 20
  });

  QUnit.test(function (b) {
    console.assert(b === 20, 'b value is injected');
  });

  QUnit.test(function (a, b) {
    console.assert(a === 10, 'qunit test has first argument "a"');
    console.assert(b === 20, 'qunit test has second argument "b"');
  });

  function runQunit() {
    var counter = 0;
    modules.forEach(function (m) {
      expect(m.config).to.be.an('object');
      expect(m.tests).to.be.an('array');
      m.tests.forEach(function (t) {
        expect(t).to.be.a('function');
        t();
        counter += 1;
      });
    });

    return counter;
  }

  it('runs qunit tests and injects module config arguments', function () {
    expect(modules.length).to.equal(1);
    var testsRun = runQunit();
    expect(testsRun).to.equal(2);
  });
});
