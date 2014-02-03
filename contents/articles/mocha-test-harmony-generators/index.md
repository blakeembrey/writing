---
title: Enabling Generators in Mocha
date: 2014-02-03 12:30
author: Blake Embrey
template: article.jade
---

For the last week, I've been working on a new project that uses node 0.11 and generators. Aside from the numerous benefits with generators in the application, I also integrated generators into my test suite. By using [mocha](http://visionmedia.github.io/mocha/) and [co](https://github.com/visionmedia/co), you can also enable support for generator functions in your test suite.

```javascript
var co       = require('co');
var mocha    = require('mocha');
var Runnable = mocha.Runnable;
var run      = Runnable.prototype.run;

/**
 * Override the Mocha function runner and enable generator support with co.
 *
 * @param {Function} fn
 */
Runnable.prototype.run = function (fn) {
  if (this.fn.constructor.name === 'GeneratorFunction') {
    this.fn   = co(this.fn);
    this.sync = !(this.async = true);
  }

  return run.call(this, fn);
};
```

Save the snippet of code above into a JavaScript file and pass the filename to `mocha.opts`.

```
mocha --harmony-generators --require test/support/co-mocha
```

Writing tests using generators has made testing even more enjoyable, so I decided to release the [code on Github](https://github.com/blakeembrey/co-mocha) with some accompanying tests and test coverage.
