# heroin

> Strong and addictive dependency injection for JavaScript

[![NPM][heroin-icon] ][heroin-url]

[![Build status][heroin-ci-image] ][heroin-ci-url]
[![Coverage Status][heroin-coverage-image]][heroin-coverage-url]
[![dependencies][heroin-dependencies-image] ][heroin-dependencies-url]
[![devdependencies][heroin-devdependencies-image] ][heroin-devdependencies-url]

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

### Order does not matter

```js
getName: function (name, message) {
  return name + ': ' + message;
}
var dependencies = {
  name: 'foo',
  message: 'hello'
};
heroin(foo, 'getName', dependencies);
foo.getName(); // 'foo hello'
```

### Combined dependencies

You can inject some dependencies right away, and inject others
at the call.

```js
var dependencies = {
  name: 'foo',
  message: 'hello'
};
heroin(foo, 'getName', {
  name: 'foo'
});
foo.getName({
  message: 'hi'
}); // 'foo hi'
```

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

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
