---
title: The State of TypeScript Packages
date: 2015-11-22 16:00
author: Blake Embrey
template: article.jade
---

As a module author and developer, I love TypeScript. It allows me to write, publish and consume 100% type-safe JavaScript. Features like autocompletion, type validation and ES6 features are now part of my typical workflow. However, one step in this development lifecycle has always been broken for me. I've [published](https://github.com/blakeembrey/popsicle) [half](https://github.com/TypeStrong/tsconfig) [a](https://github.com/blakeembrey/free-style) [dozen](https://github.com/TypeStrong/ts-node) modules on NPM, but no one has ever been able to consume the type definitions from them. Why's that?

Let's quickly take a step back. TypeScript includes a creative way for providing the type information of plain JavaScript files. These are `.d.ts` files, also known as "typings", which allows non-TypeScript packages to have a `.d.ts` file written and mirror the runtime JavaScript implementation of that package. This decoupling of the runtime and type compiler is truly elegant, as the TypeScript compiler can output `.js` and `.d.ts` files together and it works as if it is all TypeScript. This has two amazing effects:

1. The greater community can write their own type definitions (`.d.ts` files) for non-TypeScript packages - which is pretty much every popular library on NPM
2. It promotes JavaScript as the first class citizen, something the first "compile-to-JS" languages like CoffeeScript failed to do (it promoted - through general availability - the use of things like `coffeescript/register` at runtime)

To help understand how we, as a community, got here and where we're going next I'm going to give you a quick history lesson.

## The Past

Welcome to the past, the wild west of `.d.ts` files. A community project called [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), started by [Boris Yankov](https://github.com/borisyankov), is first committed to [over three years ago](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/647369a322be470d84f8d226e297267a7d1a0796). DefinitelyTyped has evolved 100 times over since the initial inception, but the core premise is to use ambient module declarations that define types for packages in NPM, Bower and the browser.

What is an [ambient module declaration](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/change-case/change-case.d.ts)?

```ts
declare module "change-case" {
  function dot(s: string): string;
  function dotCase(s: string): string;
  [...]
}
```

Notice that `declare module "x"` wraps everything. Declaring the module switches the TypeScript compilers understanding of this `.d.ts` file. It enables you, as a developer, to use `import * as case from "change-case"` or `import case = require('change-case')`. This now imports the type information of `change-case` from this declaration. Sounds brilliant, so what's the drawback?

You're a module author and have a dozen of these NPM dependencies. You downloaded all the ambient modules declarations for your dependencies so you can use TypeScript for what it's good at, making sure you're using your dependencies correctly. Maybe you used TSD, or you copied the files from DefinitelyTyped manually. Now you need to publish your library so everyone else can use it. But how do you publish those typings so people who use the library don't need to do all the work you did downloading the typings?

The obvious solution might be to check in and publish the `typings/` directory (created by `tsd`) with the package. Fantastic, that was pretty simple. Look again though, how do those typings get referenced in your users projects? It would be creating all your dependencies in your users projects, even though they can't access them. Talk about runtime inconsistency.

TSD has a concept called `tsd link`, which references the type definition (`typescript.definition` in `package.json`) from the `tsd.d.ts` file in `typings/`. That means the TypeScript definition in your module needs to be ambient and can't just be the output from the TypeScript compiler. This kind of concept resulted in more hacks and tools as [`dts-generator`](https://github.com/SitePen/dts-generator), which takes the TypeScript compiler `.d.ts` files and wraps them in your modules name so other tools can use them.

Back to the sub-dependency case though, and you're still being hung out to dry. You could have used `dts-generator` to generate a single typings file for the library you just wrote, then published it to NPM with `typescript.definition` (I know [I did](https://github.com/TypeStrong/tsconfig/blob/61bc0ba5997de50432e92d24942cf9d9821f23df/package.json#L6-L8)). Inevitability, when someone actually tries to use this the compiler will start to error because the [sub-dependency typings are missing](https://github.com/TypeStrong/atom-typescript/issues/682). But what if we checked in `typings/` like I mentioned? And our users had them automatically referenced?

Better you don't. But, if you must, [this is what happens](https://github.com/angular/angular/issues/5395). If your users ever want to use the same module or declarations, you'll run into conflicts. Even when they aren't actually there at runtime. On top of this, any sub-dependency typings now introduce their own globals and typings that don't even exist at runtime in my program.

This can all manifest in a much larger and painful bug. Since everything is an ambient module declaration, there's no way to confirm that what's defined in typings is available at runtime. One such example is the ambient typings for [`es6-promise`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/es6-promise/es6-promise.d.ts), which defines the global `Promise` class. Not only will the TypeScript compiler error with duplicate symbols when using ES6, this also implies that `Promise` is available in my runtime. And that's simply not true, which leads to code which can and will crash on node 0.10 (like I was for [popsicle](https://travis-ci.org/blakeembrey/popsicle/jobs/88018081#L316)). Now, isn't this all the types of bugs I'm not meant to have anymore with TypeScript?

Using global interfaces and variables that don't exist at runtime to relay information to other dependencies is commonplace in DefinitelyTyped and leads to tight coupling of their definitions. This makes it difficult to revert broken behavior, like our global `Promise` situation. I spent [more than six months](https://github.com/DefinitelyTyped/tsd/issues/150) after I started maintaining TSD trying to solve this problem. I eventually gave up on the approach, but not after I had spent weeks trying to make the TypeScript compiler to detect ambient module typings, follow ambient declarations through a custom type dependency tree that relies on using `/// <reference>` to work and generate a single non-global polluting bundle.

## The Current

Fortunately, most of my time on the TSD rewrite was spent solving and not patching the current system. I had built the new version to use external module declaration from the ground up, and only tried to build in support for ambient modules toward the end. External module declarations are those `.d.ts` files that TypeScript emits when you use `tsc` with `--declaration` enabled, so support is already built right into the compiler. After many weeks of approaching the ambient module problem, I decided it would be faster and cleaner to skip it. This decision resulted in a new tool, called [`typings`](https://github.com/typings/typings), to be released.

But what's the difference between an ambient and external module?

```ts
export function dot(s: string): string;
export function dotCase(s: string): string;
[...]
```

Notice that this snippet is pretty similar to the previous one, but there's no more `declare module "change-case"` around the block and I'm exporting the functions directly. This is what makes our typings portable, as we can re-use the same type definition anywhere else under a different names and module resolution strategies. For example, when we use Browserify or Webpack aliases, or with the `moduleResolution` in TypeScript 1.6.

It's not enough to just support external module declarations. What does that even mean if the TypeScript compiler can use them? It means that [typings][typings](https://github.com/typings/typings), an open source CLI, can use a reference to `.d.ts` files in GitHub or on NPM and have them "just work", with proper namespaces and no global leaks. If you're an author now, you might be wondering - how do I use this with my own module adn have things "just work" for my users?

This is where `typings.json` comes in. Since I was heavily exposed to all the issues with DefinitelyTyped and TSD, I needed to solve **everything**. And typings comes very close to doing just that. A module author no longer needs to check in `typings/`, but `typings.json`. This enables the user to use `typings` themselves and have things resolve automatically. All of your dependencies become properly namespaced and do not pollute your users typings (you aren't implicitly introducing bugs to your users anymore, which would be bad). Also, typings installation is entirely decentralized and the typings themselves can be downloaded from almost anywhere - GitHub, NPM, Bower and even over HTTP or the filesystem (yes, you can still check them in, but they aren't ambient anymore).

This decentralization solves the biggest pain point I see with maintaining DefinitelyTyped. How does an author of one typings package maintain their file in DefinitelyTyped when they get notifications on thousands of others? How do you make sure typings maintain quality when you have 1000s to review? The solution in typings is you don't, the community does. If typings are incorrect, I can just write and install my own from wherever I want, something that TSD doesn't really allow. There's no merge or review process you need to wait for ([300+ open pull requests](https://github.com/DefinitelyTyped/DefinitelyTyped/pulls)!).

However, decentralization comes with the cost of discoverability. To solve this, a [registry](https://github.com/typings/registry) exists that maintains locations of where the best typing can currently be installed from, for any version. If there's a newer typing, patches, or the old typing author has somehow disappeared, you can replace the entry with your own so people will be directed to your typings from now on. There's also protections in place as JavaScript packages slowly include their own typings, all to enable authors to continue moving quickly.

## The Future

The future is fast approaching, a place where there'll be official standards in place. With the release of typings, there is now collaboration in place with the [TypeScript team](https://github.com/typings/meta/issues/3) to solve the consumption of typings. With ideas like [package scopes](https://github.com/Microsoft/TypeScript/pull/4913) being merged into the TypeScript compiler, typings can and will be compiled into a package scoped `.d.ts` file. This will enable module authors to bundle their typings before they publish and the consumer will never have to do anything. And this isn't too far away from today.

No solution is possible without community support, so please get involved with [typings](https://github.com/typings/typings) and ask JavaScript module authors to add completed type definitions to the packages you use. Better yet, open a PR yourself and help them out - they might not even know what TypeScript is.

## Summary

So, in summary, the current landscape looks something like this:

* Ambient modules are not portable
* TypeScript only outputs external modules
* Publishing TypeScript packages is not possible
* Maintaining DefinitelyTyped is hard, for contributions and tooling
* Typings need simple APIs for IDEs to present developers with warnings and straightforward solutions

[Typings](https://github.com/typings/typings) solves all of this and is currently working on fixing the more obscure use-cases. If you find yourself running into an issue or with more questions, please [open an issue](https://github.com/typings/typings/issues) in the `typings` repository.
