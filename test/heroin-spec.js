var expect = require('expect.js');
var heroin = require('..');

describe('heroin', function () {
  it('is a function', function () {
    expect(heroin).to.be.a('function');
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
});
