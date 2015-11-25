# heroin

> Strong and addictive dependency injection for JavaScript

[![NPM][heroin-icon] ][heroin-url]

[![Build status][heroin-ci-image] ][heroin-ci-url]
[![dependencies][heroin-dependencies-image] ][heroin-dependencies-url]
[![devdependencies][heroin-devdependencies-image] ][heroin-devdependencies-url]
[![manpm](https://img.shields.io/badge/manpm-compatible-3399ff.svg)](https://github.com/bahmutov/manpm)

*Heroin* decouples functions and methods from their arguments, making
dynamic substitution a breeze.

## API

### heroin(fn, values) - inject into function

```js
function add(a, b) { return a + b; }
var values = {
  a: 10,
  b: 22
};
var adder = heroin(add, values);
adder(); // 32
```

When injecting into a function, returns a new proxy function that can be called.
The `heroin(add, values)` figures out that function `add` requires two arguments:
`a` and `b` and looks them up in the passed `values` object.

You can keep changing the values (dependencies) in the dependency object,
calling the proxy function without any additional work. Same code as above,
continued

```js
...
adder(); // 32
values.a = 100;
values.b = 2;
adder(); // 102
```

### heroin(obj, 'methodName', values) - inject into method

Heroin is better when injecting into a method, because you do not need to keep
separate proxy function - it replaces the original method.

```js
var foo = {
  getName: function (name) {
    return name;
  }
};
var dependencies = {
  name: 'foo'
};

heroin(foo, 'getName', dependencies);
foo.getName(); // 'foo'
```

## partial dependency injection

If the provided dependency object does not have own property for some argument name,
it remains a free argument to the returned function. For example

```js
function add(a, b, c) { return a + b + c; }
var values = {
  a: 10,
  c: 100
};
var adder = heroin(add, values);
// adder = function(a = 10, b, c = 100) ...
adder(4); // 114
```

This is useful if you plan to inject some common environment variables into the function,
while leaving the rest call-specific:

```js
QUnit.module('add', {
  setup: function () {
    this.log = function (value) { console.log(value); }
  }
})l
QUnit.test(function (log, assert) {
  // log is injected by module setup,
  // assert is an argument from QUnit framework
});
```

Read more about partial dependency injection in my blog post
[Partial Dependency Injection](http://bahmutov.calepin.co/partial-dependency-injection.html)

## 2 injection points - removed

I have removed the runtime dependency injection, instead allowing partial dependency injection.
For historical purposes, here is what 2 injection points had:

    Heroin can inject dependencies during the proxy creation (when you call `heroin` on a function),
    and during the function execution (when you call the proxy function)

        function add(a, b) { return a + b; }
        var values = {
          a: 10,
          b: 22
        };
        var adder = heroin(add, values);
        var runtimeValues = {
          b: 500
        };
        adder(runtimeValues); // 510

## Details

### Argument order does not matter

Let's inject `name` and `message`, while leaving `log` a free argument

```js
getName: function (log, name, message) {
  log(name + ': ' + message);
}
var dependencies = {
  name: 'foo',
  message: 'hello'
};
heroin(foo, 'getName', dependencies);
foo.getName(console.log); // prints 'foo hello'
```

Or we could list arguments in different order, the result is the same
`getName: function (name, message, log) {`

## Why?

I was inspired by the simplicity of the reflection in JavaScript shown
by [@iammerrick](https://twitter.com/iammerrick)
in [JavaScript Dependency Injection](http://merrickchristensen.com/articles/javascript-dependency-injection.html).
Still I felt there was too much extra code to be useful: both Merrick's and AngularJs
dependency injection requires an external executor function to actually call the function.

*Heroin* removes the external controller, instead directing parameters from dependency object
into the appropriate named arguments. Simple.

**Currently heroin is not minification safe**

### QUnit example

One thing that always bothered me about using
[QUnit](http://api.qunitjs.com/module/) is the inability to have module specific
state without a separate closure where all variables are accessible to every unit test

```js
(function () {
  var a = 10, b = 20;
  QUnit.module('example');
  QUnit.test(function () {
    // use a and b
  });
}());
```

I always wanted to have the ability to store test data in the module config
and be able to explicitly inject into each unit test only the data it needs:

```js
QUnit.module('example', {
  a: 10,
  b: 20
});
QUnit.test(function (a, b, assert) {
  assert(a === 10, 'qunit test has first argument "a"');
  assert(b === 20, 'qunit test has second argument "b"');
});
```

Let me show how easy it is to achieve the second goal using *heroin*. First, let's
see the minimal QUnit runtime implementation that can collect and execute unit tests
without any injection

```js
// test collection
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
    m.tests.push(fn); // 1
  }
};
// test execution
function runQunit() {
  modules.forEach(function (m) {
    m.tests.forEach(function (t) {
      t(console.assert);
    });
  });
}
```

All we do is collecting test functions and then running them in `runQunit`.
Now let's add dynamic dependency injection. This requires single line change
in line `// 1`

```js
m.tests.push(heroin(fn, m.config));
```

By doing this we are injecting module `config` object into each unit tests
during the collection, making unit tests like `QUnit.test(function (a, b) { ...`
possible.

I implemented a qunit plugin [qunit-inject](https://github.com/bahmutov/qunit-inject)
to make production grade dependency injection for this wonderful testing framework.

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/heroin/issues) on Github

## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[heroin-icon]: https://nodei.co/npm/heroin.png?downloads=true
[heroin-url]: https://npmjs.org/package/heroin
[heroin-ci-image]: https://travis-ci.org/bahmutov/heroin.png?branch=master
[heroin-ci-url]: https://travis-ci.org/bahmutov/heroin
[heroin-coverage-image]: https://coveralls.io/repos/bahmutov/heroin/badge.png
[heroin-coverage-url]: https://coveralls.io/r/bahmutov/heroin
[heroin-dependencies-image]: https://david-dm.org/bahmutov/heroin.png
[heroin-dependencies-url]: https://david-dm.org/bahmutov/heroin
[heroin-devdependencies-image]: https://david-dm.org/bahmutov/heroin/dev-status.png
[heroin-devdependencies-url]: https://david-dm.org/bahmutov/heroin#info=devDependencies
