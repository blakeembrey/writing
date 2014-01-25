---
title: Partial Application in JavaScript
date: 2014-01-25 23:00
author: Blake Embrey
template: article.jade
---

Partial application is the act of pre-filling arguments of a function and returning a new function of smaller arity. The returned function can be called with additional parameters and in JavaScript, the `this` context can also be changed when called. Using a partially applied function is extremely common in functional programming with JavaScript as it allows us to compose some really nifty utilities and avoid repeating ourselves in code.

In modern JavaScript engines, there is a [bind function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) which can be used to achieve a similar result. The difference between `partial` and `bind` is that the a partial functions `this` context is set when the returned function is called, while a bound functions `this` context has already been defined and can't be changed.

```javascript
var __slice = Array.prototype.slice;

/**
 * Wrap a function with default arguments for partial application.
 *
 * @param  {Function} fn
 * @param  {*}        ...
 * @return {Function}
 */
var partial = function (fn /*, ...args */) {
  var args = __slice.call(arguments, 1);

  return function () {
    return fn.apply(this, args.concat(__slice.call(arguments)));
  };
};
```

From the function above, we can understand that `partial` accepts the function to be pre-filled and it's default arguments. It then returns a new function which can be called with some more arguments. It's important to note that the context (`this`) is being defined when the returned function is called. But when would you even want to use this?

Normally I would be happy to give a simple example of transforming an `add` function into an `add5` by partially applying it - `partial(add, 5)`. This definitely demonstates how we can use the utility, but doesn't really touch on why.

Consider writing a logging utility that accepts some different arguments that need to be logged - `var log = function (type, value) {}`. Fantastic, it looks like a really simple function to use. But now we want set every log in our file to the `testing` type. We can do a couple of things to achieve this. One option would be to assign our type to a variable and reuse the variable  - `var testType = 'Testing'` and `log(testType, value)`. This will get messy after we write it more than once. What if we just wrapped the `log` function automatically?

```javascript
var testLog = function () {
  return log.apply(this, ['testing'].concat(__slice.call(arguments)));
};
```

Great, this looks familiar - we could have just used partial - `var testLog = partial(log, 'Testing')`. Now we have a function we can continue to reuse any number of times without fear of repeating ourselves.

## Bonus Points

If you've been reading any of my previous blog posts, you may have noticed me abusing the usefulness of [function arity](http://blakeembrey.com/articles/forcing-function-arity-in-javascript/) in anonymously returned functions. And in another article I wrote about a utility that can help us remove the [repetitive argument slicing](http://blakeembrey.com/articles/javascript-variadic-function/). If you haven't checked out these utilities yet, take a quick look and I bet you'll see how we could use them here.

```javascript
var partial = variadic(function (fn, args) {
  var remaining = Math.max(fn.length - args.length, 0);

  return arity(remaining, variadic(function (called) {
    return fn.apply(this, args.concat(called));
  }));
});
```

Now the returned partially applied function gives us the correct number of trailing arguments still to be filled using the `arity` utility. On top of that, we managed to get rid of slicing arguments constantly by using the `variadic` utility. In fact, I've been so interested in these reusable utilities that I published the [partial utility on Github](https://github.com/blakeembrey/partial) so I can reuse it later.
