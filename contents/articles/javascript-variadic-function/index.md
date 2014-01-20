---
title: A Variadic Utility in JavaScript
date: 2013-12-29 23:00
author: Blake Embrey
template: article.jade
---

A variadic function is a type of function which accepts a variable number of arguments. In JavaScript, every function can be variadic and it's commonplace to see snippets of code using `Array.prototype.slice.call(arguments, 1)` to get a unlimited number of trailing arguments back as an array. You can also find many instances where you would even slice all the arguments, for the sake of manipulation and array concatenation.

The ability to get all the functions trailing arguments natively would be a great inclusion to the language, and in fact [it's already in the works with ES6](http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html). For now though, we could be stuck typing this out manually. Or we can write ourselves a [little utility function](https://github.com/blakeembrey/variadic) to speed up our workflow.

```javascript
var __slice = Array.prototype.slice;

/**
 * Generate a function that accepts a variable number of arguments as the last
 * function argument.
 *
 * @param  {Function} fn
 * @return {Function}
 */
var variadic = function (fn) {
  var count = Math.max(fn.length - 1, 0);

  return function () {
    var args = __slice.call(arguments, 0, count);

    // Enforce the array length, in case we don't have enough array padding.
    args.length = count;
    args.push(__slice.call(arguments, count));

    return fn.apply(this, args);
  };
};
```

The snippet above accepts a single function as its argument and returns a new function that will pass in every additional argument as an array to the last parameter.

```javascript
var fn = variadic(function (args) {
  return args;
});

fn(); //=> []
fn('a'); //=> ['a']
fn('a', 'b') //=> ['a', 'b'];

var fn = variadic(function (a, b, args) {
  return { a: a, b: b, args: args };
});

fn(); //=> { a: undefined, b: undefined, args: [] }
fn('a'); //=> { a: 'a', b: undefined, args: [] }
fn('a', 'b', 'c', 'd', 'e'); //=> { a: 'a', b: 'b', args: ['c', 'd', 'e'] }
```

When might you use this in practice though? One example is the Backbone.js event triggering mechanism which accepts a variable number of arguments.

```javascript
trigger: function(name) {
  if (!this._events) return this;
  var args = slice.call(arguments, 1);
  // Trigger some events with the args.
  return this;
},
```

Could be rewritten to simply be:

```javascript
trigger: variadic(function (name, args) {
  if (!this._events) return this;
  // Trigger some events with the args.
  return this;
}),
```
