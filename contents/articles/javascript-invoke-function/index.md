---
title: A JavaScript Invoke Function
date: 2014-01-04 21:00
author: Blake Embrey
template: article.jade
---

Under certain functional JavaScript toolbelts, we can find a utility that is used purely for invoking a method on a passed in object. The utility is a really simple snippet that can be used in a number of different circumstances.

```javascript
var __slice = Array.prototype.slice;

var invoke = function (method /*, ...args */) {
  var args = __slice.call(arguments, 1);

  return function (obj /*, ..args */) {
    return obj[method].apply(obj, args.concat(__slice.call(arguments, 1)));
  };
};
```

The most useful situation for a utility such as this is in combination with other functional utilities and iterators. Consider the case where we have an array of objects with identical methods. Not uncommon in a complex MVC application where you may be tracking child views. To remove every child view, we need to iterate over an array of views and call `remove`.

```javascript
var children = [/* ... */];

children.forEach(invoke('remove'));
```
