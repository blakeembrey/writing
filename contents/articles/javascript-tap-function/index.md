---
title: The Tap Utility in JavaScript
date: 2014-01-04 20:00
author: Blake Embrey
template: article.jade
---

There are numerous functional JavaScript libraries out in the public, many of which include a [utility called tap](http://underscorejs.org/#tap). This simplistic utility serves a single purpose, to call a function with a value and return the value back to us. However, the usefulness of this utility is rarely realised.

```javascript
var tap = function (value, fn) {
  fn(value);
  return value;
};
```

The code above clearly depicts the ease of using the utility function, but when would we ever use this? It's really only useful when we want to easily chain the value between calls. You can pass in any function and receive the passed in value as the return, regardless of the function return value. Consider this.

```javascript
// Pop a value of the end of an array, in reality we'd probably make a pop utility.
tap([1, 2, 3, 4], function (array) {
  return array.pop(); // Pop always returns the popped value.
});
//=> [1, 2, 3]
```
