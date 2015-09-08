---
title: Technical Introduction to Reactive Functions using TypeScript
date: 2015-08-31 23:00
author: Blake Embrey
template: article.jade
github: blakeembrey/js-intro-to-reactive-functions
---

## Introduction

## Technicals

This technical introduction has an [accompanying repository](https://github.com/blakeembrey/js-intro-to-reactive-functions) that can be used as the complete reference throughout the tutorial. Every step in this blog post will accompany a commit, which can be used to look up all the changes in that step.

### First Steps

_[f3404a90c2feade9205aff8521a4b0b8b97a8cf5](https://github.com/blakeembrey/js-intro-to-reactive-functions/commit/f3404a90c2feade9205aff8521a4b0b8b97a8cf5)_

Let's start by getting the boilerplate out of the way. The first commit adds the development dependencies, configuration files and TypeScript definitions we'll be using throughout the project. We're using `tape` for our tests and the library will be referenced as `rf` throughout the duration of this tutorial.

### Introducing Our First Primitive

_[bc82140a6414bd45b74d728bebc4cd3abdadc7cb](https://github.com/blakeembrey/js-intro-to-reactive-functions/commit/bc82140a6414bd45b74d728bebc4cd3abdadc7cb)_

The primary primitive used in this tutorial is a getter/setter function. The method, `rf.prop()`, will return a function which can be either set to a value, when provided an argument, or returned the current value, when provided no arguments. This is a neat abstraction that we can build upon to achieve reactivity.

```ts
export interface IProp <T> {
  (value?: T): T
  toJSON (): T
}

export function prop <T> (value?: T): IProp<T> {
  function gettersetter () {
    if (arguments.length) {
      value = arguments[0]
    }

    return value
  }

  ;(<any> gettersetter).toJSON = () => value

  return <IProp<T>> gettersetter
}
```

### Reactivity

_[941b587a197f8f19307663973cd7d88a19cbcef3](https://github.com/blakeembrey/js-intro-to-reactive-functions/commit/941b587a197f8f19307663973cd7d88a19cbcef3)_

This is where implementation complexity increases exponentially. For the high level overview, we're going to introduce two classes that extend a common `ChangeEmitter` class - `Context` and `Store`. The `Store` will be used with the `gettersetter` function we implemented to emit value changes while `Context` will our execution container and hold references to `Store`s, as well as other `Context`s in the case where we have dependent execution contexts.

Let's start with the `ChangeEmitter` class. Since the only thing we're interested in is changes, the implementation is just a simplified event emitter. We also want to assign a unique ID to every instance so our `Context` can make sure we're only listening to each store once - a minor optimization here.

```ts
let currentId = 0

export class ChangeEmitter {

  id = currentId++
  listeners: Function[] = []

  addChangeListener (fn: Function) {
    this.listeners.push(fn)
  }

  removeChangeListener (fn: Function) {
    const indexOf = this.listeners.indexOf(fn)

    if (indexOf > -1) {
      this.listeners.splice(indexOf, 1)
    }
  }

  emitChange () {
    for (const listener of this.listeners) {
      listener()
    }
  }

}
```

Next, let's introduce the `Store`. This class is a minimal wrapper around the `ChangeEmitter` with support for holding a value. The only optimization here is that a change will only emit when the value has actually been updated.

```ts
export class Store <T> extends ChangeEmitter {

  constructor (public value: T) {
    super()
  }

  update (value: T) {
    if (this.value !== value) {
      this.value = value
      this.emitChange()
    }
  }

}
```

Finally, we'll introduce the largest chunk of our new logic - the `Context`. This also extends `ChangeEmitter` and integrates reactive updates. Most of the magic here is because we use the global `currentContext` variable to hold the currently running context instance - this is what allows our dependencies to automatically register themselves. The properties `cache` and `_changeListener` hold a map of `ChangeEmitter`s and the function to execute every `cache` instance change respectively.

```ts
let currentContext: Context

export class Context extends ChangeEmitter {

  protected cache: { [id: string]: Context | Store<any> } = {}
  protected _changeListener = () => this.run()

  constructor (protected fn: Function, protected parent = currentContext) {
    super()

    // On initialization of a new context, add to parent context.
    if (parent) {
      parent.add(this)
    }
  }

  add (value: Context | Store<any>) {
    // Only add the child when the function is not queued for another run.
    if (!this.cache[value.id]) {
      this.cache[value.id] = value
      value.addChangeListener(this._changeListener)
    }
  }

  empty () {
    for (const id of Object.keys(this.cache)) {
      const value = this.cache[id]
      value.removeChangeListener(this._changeListener)
      delete this.cache[id]

      if (value instanceof Context) {
        value.empty()
      }
    }
  }

  run () {
    this.empty()

    const fn = this.fn
    const prevContext = currentContext

    currentContext = this
    fn(this)
    currentContext = prevContext
  }

}
```

When we initialize a new `Context`, it is registered to the parent context that it was executed within. This is _extremely_ important for the disposing of `Context` functions. If we did not register and subsequently stop child contexts on disposal, it would be possible to enter a situation where a context was stopped but a child continued reacting to value changes and we'd end up with a memory leak.

The methods `add` and `empty` are the only ways to manipulate the `cache`. When we add a `Context` or `Store`, we add it to our cache (only when it's not already registered, thanks to our hash map) and always add our change listener to re-run the context function when a value changes.

And we're already up to `run` method now. The first thing we need to do is remove all previous change listeners - it's possible that the listeners will be different depending on the conditionals the user has programmed, not the mention we need to kill all current child contexts from future changes.

Finally, what does the exported `run` look like?

```ts
export function run (fn: () => any) {
  const context = new Context(fn)
  context.run()
  return () => context.empty()
}
```

### Stop for a Code Example

Using the code so far, we can already run a reactive function. This example is also available as [an interactive demo](example).

```ts
const a = rf.prop(0)
const b = rf.prop(0)

rf.run(() => {
  console.log(a() + b()) // 0, 10, 20
})

a(10)
b(10)
```

#### Queue Execution

_[f1770d7fe41593d283a8f0761325d3a9929c2660](https://github.com/blakeembrey/js-intro-to-reactive-functions/commit/f1770d7fe41593d283a8f0761325d3a9929c2660)_

In the `Context` class you may have noticed a possible execution oddity. Since changes are emitted synchronously, when we emit a change for the current context (or a parent context) within our current context it'll immediately re-execute the changed context without finishing the current execution. We can solve this in one of two ways, we could use a "stop signal" which will run again from a fresh slate, or we can use a queue to say we need to run again. I'll show the queue option below but it's also completely valid to use a "stop signal".

```ts.diff
@@ -31,6 +31,9 @@

   protected cache: { [id: string]: Context | Store<any> } = {}
   protected _changeListener = () => this.run()

+  protected queued = false
+  protected running = false
+
   constructor (protected fn: Function, protected parent = currentContext) {
     super()

@@ -42,7 +45,7 @@

   add (value: Context | Store<any>) {
     // Only add the child when the function is not queued for another run.
-    if (!this.cache[value.id]) {
+    if (!this.queued && !this.cache[value.id]) {
       this.cache[value.id] = value
       value.addChangeListener(this._changeListener)
     }
@@ -63,12 +66,26 @@
   run () {
     this.empty()

+    if (this.running) {
+      this.queued = true
+      return
+    }
+
     const fn = this.fn
     const prevContext = currentContext

+    this.queued = false
+    this.running = true
+
     currentContext = this
     fn(this)
     currentContext = prevContext
+
+    this.running = false
+
+    if (this.queued) {
+      this.run()
+    }
   }

 }
```

#### Context Stopping and Out of Context Children

In the previous `Context` class, we allowed an optional parent context to passed to the constructor. Let's expose this functionality now, as it'll give us an indirect way to make a context depend on another (E.g. within async callbacks). However, this can introduce another issue - when a context is stopped, the child should not be listened to nor run.

```ts.diff
@@ -33,6 +33,7 @@

   protected queued = false
   protected running = false
+  protected stopped = false

   constructor (protected fn: Function, protected parent = currentContext) {
     super()
@@ -44,6 +45,15 @@
   }

   add (value: Context | Store<any>) {
+    // If the current execution has been stopped, make sure children are also.
+    if (this.stopped) {
+      if (value instanceof Context) {
+        value.stop()
+      }
+
+      return
+    }
+
     // Only add the child when the function is not queued for another run.
     if (!this.queued && !this.cache[value.id]) {
       this.cache[value.id] = value
@@ -58,14 +68,23 @@ export class Context extends ChangeEmitter {
       delete this.cache[id]

       if (value instanceof Context) {
-        value.empty()
+        value.stop()
       }
     }
   }

+  stop () {
+    this.empty()
+    this.stopped = true
+  }
+
   run () {
     this.empty()

+    if (this.stopped) {
+      return
+    }
+
     if (this.running) {
       this.queued = true
       return
@@ -128,8 +147,8 @@
   return <IProp<T>> gettersetter
}

-export function run (fn: () => any) {
-  const context = new Context(fn)
+export function run (fn: (context?: Context) => any, parent?: Context) {
+  const context = new Context(fn, parent)
   context.run()
-  return () => context.empty()
+  return () => context.stop()
}
```

// Add errors and done handling of prop lifecycle.
// When `done` handling is added, is it possible to propagate `done` upward as state to final rendering.
// E.g. Add `done` or Promise-like interface to contexts (`context.then()`)
// What about making `gettersetter` a promise for async functions in ES7 (or at least generators)

rf.run(function * () {
  const aVal = yield a()


})
