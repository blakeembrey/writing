---
title: The JavaScript Bind Function
date: 2013-12-31 01:00
author: Blake Embrey
template: article.jade
---

The JavaScript `bind` function is a common-place utility when working with many different frameworks and libraries. It's purpose is to bind the `this` value to a static object and is useful when passing functions around as callbacks, where maintaining the correct `this` value is required. A common convention to circumvent this utility is the `var that = this`, but this isn't very feasible everywhere.

In [modern JavaScript implementations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) the function is built directly onto `Function.prototype`, giving us `bind` functionality on every function. For our implementation we'll be implementing a standalone functionality that works similar to the built-in `bind` function.

However, it's important to note that `bind` also comes with another handy feature. It accepts an unlimited number of arguments after the context to pass in as the function parameters, from left to right.

```javascript
var __slice = Array.prototype.slice;

/**
 * Bind a function to a certain context.
 *
 * @param  {Function} fn
 * @param  {Object}   context
 * @param  {*}        ...
 * @return {Function}
 */
var bind = function (fn, context /*, ...args */) {
  var args = __slice.call(arguments, 2);

  return function () {
    return fn.apply(context, args.concat(__slice.call(arguments)));
  };
};
```

Bind allows us to keep the `this` context when passing the callback to another function. Imagine passing a function that uses `this` into `setTimeout` or someone elses library utility, where `this` could be unpredictable.

```javascript
var greet = function (greeting) {
  return greeting + ' ' + this.user;
};

greet('Hello'); //=> "Hello undefined"

var boundGreet = bind(greet, { user: 'Bob' });

boundGreet('Hello'); //=> "Hello Bob"
```

We also have another useful feature built into `bind` - partial application. Partial application is essentially the act of pre-filling function arguments. Any future arguments are then appended to the arguments we have already defined.

```javascript
var greet = function (user, greeting) {
  return greeting + ' ' + user;
};

var greetBlake = bind(greet, null, 'Blake');

greetBlake('Hi'); //=> "Hi Blake"
greetBlake('Hello'); //=> "Hello Blake"
```

## Bonus Implementation using Variadic

In my last post, I introduced the concept of a [variadic function](http://blakeembrey.com/articles/javascript-variadic-function/). As this article demonstrates, `bind` is a perfect example of a variadic function, so let's reimplement `bind` with the variadic function.

```javascript
var bind = variadic(function (fn, context, args) {
  return variadic(function (called) {
    return fn.apply(context, args.concat(called));
  });
});
```
