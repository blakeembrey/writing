---
title: The Tap Utility in JavaScript
date: 2014-01-04 20:30
author: Blake Embrey
template: article.jade
---

There are numerous functional JavaScript libraries out in the public, many of which include a [utility called tap](http://underscorejs.org/#tap). This simplistic utility serves a single purpose, to call a function with a value and return the value back to us. However, the usefulness of this utility is rarely understood and can even be confusing when looking at examples.

```javascript
var tap = function (value, fn) {
  fn(value);
  return value;
};
```

The code above depicts the simplicity of the function, but when would we ever use it? It's really only useful when we want to chain the value between calls. You can pass in any function and you will always receive the passed in value as the return, regardless of the function return value.

```javascript
// Pop a value of the end of an array, in reality we'd use an `invoke` utility.
tap([1, 2, 3, 4], function (array) {
  // Pop always returns the value it removed from the end of the array.
  return array.pop();
});
//=> [1, 2, 3]
```
