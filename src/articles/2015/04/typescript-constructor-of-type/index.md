---
title: Reference the Constructor of a Type in TypeScript (Generically)
date: 2015-04-28 00:00
author: Blake Embrey
template: article.jade
---

Although not initially intuitive, I run into this issue while documenting the [`register`](http://martyjs.org/api/registry/index.html#register) function in Marty.js. I didn't realise a solution, so I reached out to a friend who provided me with this beauty.

```ts
function register<T>(clazz: { new (...args: any[]): T }): T;
```

And it works brilliantly! But what's this even doing? I've just created a generic function that accepts a constructor function of any type and returns that type. No need to do type coercion. It turned out perfectly for this situation, where I can register a `Store`, `Queries`, `ActionCreators` and more!

You can also write this with a slightly different syntax such as `new (...args: any[]) => T`. There's no real difference here.

Although it doesn't apply here, we can also look how we might accept more specific types of constructors.

```ts
// Using `typeof`...

class X {
  method (): void {}
}

function create (C: typeof X) {
  return new C()
}

create(X)

// Using an inline parameter...

interface Y {
  method(): void
}

function create2 (C: new (...args: any[]) => Y) {
  return new C()
}

class Z implements Y {
  method(): void {}
}

create2(Z)
```
