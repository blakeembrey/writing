---
title: Wrapping JavaScript Functions
date: 2014-01-13 23:00
author: Blake Embrey
template: article.jade
---

In the modern age of web applications and development, it seems we are constantly adding side effects to every part of our applications - everything from analytics to event triggering. Unfortunately in a lot of cases, we tend to cram this functionality into function with the useful stuff. As programmers, this causes numerous issues down the line - especially when it comes to refactoring and code comprehensibility.

A simple way to keep this functionality apart from the core code is create a helpful utility function to manage it for you. And to keep our code readability, we shouldn't allow anything advanced that can break our understanding of the original function. That means we don't want to be able to alter the original function, but we can still trigger any side effects we need to inline with the original function.

```javascript
var before = function (before, fn) {
  return function () {
    before.apply(this, arguments);
    return fn.apply(this, arguments);
  };
};
```

To use the function, we can pass any function in as the first argument and the original function we want to wrap as the second argument. For example, we could do `before(logger, add)`. Even without seeing the `logger` or `add` functions, we can imagine what each do. And because we are passing all the arguments to the side effect function, we can do stuff with the information.

One thing I find myself doing is checking what arguments were passed to a certain function. To do this now, we can `before(console.log.bind(console), fn)`. Now, let's implement the reverse functionality.

```javascript
var after = function (fn, after) {
  return function () {
    var result = fn.apply(this, arguments);
    after.call(this, result);
    return result;
  };
};
```

This is extremely similar to the first example. The main difference is that the first function passed in is the side effect, but now we have the side effect running after our wrapped function. Adapting the previous example, we can now do `after(add, logger)` and the logger will execute after the result is computed with the same arguments.

One cool thing we could actually do, is to run argument validation in the `before` function. Consider this.

```javascript
var validAdd = before(function () {
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] !== 'number') {
      throw new TypeError('Expected a number');
    }
  }
}, add);
```

We can also put these two functions together and create a new utility. This one allows us to pass both a function before and after our core functionality. E.g. `around(logger, add, logger)`.

```javascript
var around = function (under, fn, over) {
  return before(under, after(fn, over));
};
```

## Allow unlimited before and after functions

We can also adapt the functions to accept a variable number of arguments as the `before` and `after` functions. However, we can't do this to the `around` utility since we wouldn't know which argument is the core function.

```javascript
var __slice = Array.prototype.slice;

var before = function (/* ...before, fn */) {
  var fn     = arguments[arguments.length - 1];
  var before = __slice.call(arguments, -1);

  return function () {
    for (var i = 0; i < before.length; i++) {
      before[i].apply(this, arguments);
    }

    return fn.apply(this, arguments);
  };
};

var after = function (fn /*, ...after */) {
  var after = __slice.call(arguments, 1);

  return function () {
    var result = fn.apply(this, arguments);

    for (var i = 0; i < after.length; i++) {
      after.call(this, result);
    }

    return result;
  };
};
```

## Advanced wrapping utility

So far we've seen some function wrapping utilities that are purely for side effects. They have no capability to alter the main function arguments or change the function result. For something more advanced than trigger side-effects, we might to want to use something a little different.

```javascript
var __slice = Array.prototype.slice;

var wrap = function (fn, wrap) {
  return function () {
    return wrap.apply(this, [fn].concat(__slice.call(arguments)));
  };
};
```

This is actually pretty similar the `wrap` function used in Prototype.js. It allows us to call a custom wrapper function with the original function and all the arguments. But, how do we even use this?

```javascript
var addAndMultiplyBy2 = wrap(add, function (originalFn, a, b) {
  return 2 * originalFn(a, b);
});
```
