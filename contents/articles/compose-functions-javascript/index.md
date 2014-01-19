---
title: Composing Functions in JavaScript
date: 2014-01-19 00:00
author: Blake Embrey
template: article.jade
---

Composing multiple functions to create more complex ones is a common utility in any programming language. And the ability to construct functions in a way that is easily composable is a true talent, but it really shines with code maintenance and reuse. It's not uncommon to find huge applications composed of many, much smaller functions. Inspired by this pattern of extremely modular functions, I've been slowly migrating my programming style to allow for more composable and reusable functions.

To compose functions together, we will need to accept a list of functions for it to be made up from. Let's call the functions `a`, `b` and `c`. Now that we have the list of functions, we need to call each of them with the result of the next function. In JavaScript, we would do this with `a(b(c(x)))` - with `x` being the starting value. However, it would be much more useful to have something a little more reusable than this.

```javascript
var compose = function () {
  var fns = arguments;

  return function (result) {
    for (var i = fns.length - 1; i > -1; i--) {
      result = fns[i].call(this, result);
    }

    return result;
  };
};
```

The above function iterates over the function list (our arguments) in reverse - the last function to pass in is executed first. Given a single value as the initial input, it'll chain that value between every function call and return the final result. This allows us to do some really cool things.

```javascript
var number = compose(Math.round, parseFloat);

number('72.5'); //=> 73
```

## Sequence

Another utility I've seen about in some functional libraries is called [sequence](https://github.com/raganwald/allong.es#functional-composition). It's very similar to `compose`, except the arguments are executed in reverse. For example:

```javascript
var sequence = function () {
  var fns = arguments;

  return function (result) {
    for (var i = 0; i < fns.length; i++) {
      result = fns[i].call(this, result);
    }

    return result;
  };
};
```

However, we should make a note of the almost identical function signature to `compose`. Usually, seeing something like this should trigger a warning in your head to find some way to reuse previous functionality, instead of replicating it. In this example, we can reuse the `compose` function to write the `sequence` implementation.

```javascript
var __slice = Array.prototype.slice;

var sequence = function () {
  return compose.apply(this, __slice.call(arguments).reverse());
};
```
