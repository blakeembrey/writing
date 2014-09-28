---
title: JavaScript Result Utility
date: 2014-01-09 17:00
author: Blake Embrey
template: article.jade
---

In JavaScript, an objects property can hold any type of data, from strings to functions and even nested objects. Since an object can hold any type of potential data, some libraries implement a [result utility](http://underscorejs.org/#result) to check whether the property is function and instead return the functions return.

This functionality is rarely required in your regular JavaScript workflow and is usually reserved for third-party libraries where users can pass in ambiguous data types. A prominent example would be a templating library, where the template can render simple data types like strings and numbers. However, the template may also be capable of rendering ambiguous or dynamic data in the form of functions. To do this, we could abstract it to the following utility.

```javascript
var result = function (obj, property) {
  var value = obj[property];

  if (typeof value === 'function') {
    value = value.call(obj);
  }

  return value;
};
```

The above is a relatively simple utility, but hopefully you can now imagine some use casesyou can refactor and reuse a utility like this. However, consider a slightly different utility I'm going call `ambiguous`. This utility is similar, albeit entirely incompatible, but works around some of the limitations I found when using the `result` function.

```javascript
var __slice = Array.prototype.slice;

var ambiguous = function (value /*, ...args */) {
  if (typeof value === 'function') {
    value = value.apply(this, __slice.call(arguments, 1));
  }

  return value;
};
```

Personally, the `ambiguous` utility is much more useful in the real world. Especially since it removes the static context limitation from the `result` utility above. It also allows us to pass in optional arguments in the case that the value is a function. Just some food for thought.
