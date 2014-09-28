---
title: Forcing Function Arity in JavaScript
date: 2014-01-22 23:30
author: Blake Embrey
template: article.jade
---

Function arity in something in JavaScript that is usually overlooked. For the most part, that's perfectly understandable, it's just a number. Unfortunately, this number can be integral to many other functions working correctly. But first, what number am I talking about?

```javascript
var fn = function (a, b) {};

fn.length; //=> 2
```

As you can see, the length gives up the exact number of arguments the function is expecting to be passed in. This can be useful for other functions that might want to alter its behaviour based on this digit. For example, I found outlining this issue [with currying](http://raganwald.com/2013/03/21/arity-and-partial-function-application.html). Basically, the `curry` function implementation relies on using the arity information to know how many times the function needs to be curried.

To force the number of arity in our returned anonymous functions, we need to dynamically generate a function with the specified number of arguments. Why? Because the previous implementations of [wrapping functions](http://blakeembrey.com/articles/wrapping-javascript-functions/), [bind](http://blakeembrey.com/articles/javascript-bind-function/), [variadic](http://blakeembrey.com/articles/javascript-variadic-function/) and every other functional utility I have demonstrated don't proxy the number of arguments through the returned function.

This can be a problem in the case where we want to use this function somewhere that expects a function length to work correctly, like when currying. We could fix this at the source, a half a dozen times and any number of times more. Or we could write a little utility that will enfore a number of arguments for us.

```javascript
var names   = 'abcdefghijklmnopqrstuvwxyz';
var __slice = Array.prototype.slice;

/**
 * Make a function appear as though it accepts a certain number of arguments.
 *
 * @param  {Number}   length
 * @param  {Function} fn
 * @return {Function}
 */
var arity = function (length, fn) {
  return eval(
    '(function (' + __slice.call(names, 0, length).join(',') + ') {\n' +
    'return fn.apply(this, arguments);\n' +
    '})'
  );
};
```

The above function allows us to pass in an argument length and a function to proxy. It then returns to us an anonymous function with the correct number of arguments defined (`.length` works!) and allows us to call the function and return the usual result. It doesn't do anything to the arguments in the interim, it just tells the world how many arguments we are accepting.

## The Other Arity Problem

So we've touched one of the arity problems, which is a expecting to read the correct arity from a function. The reverse arity problem is when a function is called with incorrect or overloaded arguments. Consider `parseInt`, which accepts two arguments - a string and the radix.

```javascript
[1, 2, 3, 4, 5].map(parseInt); //=> [1, NaN, NaN, NaN, NaN]
```

Now we're having problems. To fix this we can make a utility function that limits the number of arguments passed through.

```javascript
var __slice = Array.prototype.slice;

/**
 * Force a function to accept a specific number of arguments.
 *
 * @param  {Number}   length
 * @param  {Function} fn
 * @return {Function}
 */
var nary = function (length, fn) {
  return function () {
    return fn.apply(this, __slice.call(arguments, 0, length));
  };
};
```

If you've been reading, you would have just noticed that we introduced the original bug we've been trying to avoid. That is, we're returning a new anonymous function without proxying the number of arguments through. Let's quickly correct that with the function we just wrote.

```javascript
var __slice = Array.prototype.slice;

/**
 * Force a function to accept a specific number of arguments.
 *
 * @param  {Number}   length
 * @param  {Function} fn
 * @return {Function}
 */
var nary = function (length, fn) {
  // Uses the previous function to proxy the number of arguments.
  return arity(length, function () {
    return fn.apply(this, __slice.call(arguments, 0, length));
  });
};
```

Now we can use this to fix our map error from earlier. We also have the added bonus of a correct argument representation.

```javascript
nary(1, parseInt).length; //=> 1

[1, 2, 3, 4, 5].map(nary(1, parseInt)); //=> [1, 2, 3, 4, 5]
```
