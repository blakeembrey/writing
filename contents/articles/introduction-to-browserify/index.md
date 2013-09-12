---
title: Introduction to Browserify
date: 2013-09-12 22:00
author: Blake Embrey
template: article.jade
---

> require('modules') in the browser.

[Browserify](https://github.com/substack/node-browserify) is a development tool that allows us to write node.js-style modules that compile for direct use in the browser. Just like in node, we write our modules in seperate files, exporting external data using the `module.exports` and `exports` variables. We can even require other files locally using `require` function and if we omit the relative path, it'll resolve to the module in the `node_modules` directory.

## Getting Started

Getting started with the browserify command-line tool requires node.js and npm installed.

```bash
npm install browserify -g
```

## Our First Module

**multiply.js:**

```javascript
module.exports = function (a, b) {
  return a * b;
};
```

**square.js:**

```javascript
var multiply = require('./multiply');

module.exports = function (n) {
  return multiply(n, n);
};
```

**index.js:**

```javascript
var square = require('./square');

console.log(square(125)); //=> 15625
```

Now we have written a couple of modules that require each other, we can run browserify and generate the file for use in the browser:

```bash
browserify index.js -o bundle.js
```

That just created a `bundle.js` file that contains the three modules we just wrote, bundled in a single file ready to execute in the browser. If we dropped this into a html file, we would see `15625` logged to the JavaScript console.

## NPM + Browserify

Since browserify implements the node.js module resolve algorithm, we can easily use `npm` to install any module on npm and use it inside the browser. There are quite a few modules on `npm` that are made specifically for tools such as browserify, but even more exciting is using a module that wasn't originally written for the browser on the client-side. Let's install `underscore` and include it in our script.

```bash
npm install underscore --save
```

```javascript
var _ = require('underscore');

_.each([1, 2, 3], function (n) {
  console.log(n); //=> 1, 2, 3
});
```

## Node-core Modules

One of the biggest attractions of browserify is the inclusion of [node.js core modules](https://github.com/substack/node-browserify#compatibility). Yes, modules such as `url`, `path`, `stream`, `events` and `http` have all been ported for use in the browser. Now, you can't do everything you can do in node, but you can do everything a browser can do using node code.

The most obvious core modules that are useful on the client-side are `querystring`, `url` and `path`. Requiring the core modules, we can easily parse and resolves urls, query strings and paths. On top of that, `process`, `Buffer`, `__dirname`, `__filename` and `global` variables are all populated. That means we can use `process.nextTick` to invoke a function asynchronously on the next event loop (and it's polyfilled for maximum cross-browser support). A special `process.browser` flag is also set in browserify builds, so we can even do checks if the script is running in a browser environment (as opposed to node for all use cross-environment module developers).

## Transforms

The most powerful feature of browserify is the simpicity of writing [source transforms](https://github.com/substack/node-browserify#list-of-source-transforms). That is a transformation to the file between when it's resolved and required in a module. A basic use case of this for compiling CoffeeScript using [coffeeify](https://github.com/substack/coffeeify), so we don't have to do any sort of precompilation in this case.

However, there are loads more transforms and you can easily add your own. Some transforms I find myself commonly using are [brfs](https://github.com/substack/brfs) (inline static file contents), [hbsfy](https://github.com/epeli/node-hbsfy) (precompile Handlebars templates, *performance boost*), [uglifyify](https://github.com/hughsk/uglifyify) (uglify bundled files with UglifyJS2) and [envify](https://github.com/hughsk/envify) (use environment variables within modules).

## Advanced Options

### Debug

Using the `-d` flag with browserify will enable source map support. Source maps allow us to view the file in all its natural glory, spread across multiple files and modules (Make sure you have source maps enable in your dev tools).

### Stand-alone

By using the `-s <name>` option, we can create a bundle that is specifically created for public API consumption with other browser tools. It uses a UMD snippet to define a AMD module, CommonJS module and even falling back to aliasing the provided name to the `window`.

### External

In a production website environment, you may want to cut down on duplicate code downloads from different modules by externalizing the common modules between them. This allows you to specify module names that should not be bundled directly and instead assumed to by included already on the page.

### Browserify Shim

Some time you will likely find a module that can't simply by require since it was written for the browser window. Conviently, we could simply polyfill it using `module.exports = window.$` or similar. But what if it has dependencies in the global that we have used `require` with? You could also the snippet a bit more, but even quicker is the [browserify-shim](https://github.com/thlorenz/browserify-shim) module.

### Grunt task

Lots of people are using Grunt nowadays to run their build scripts, and browserify is no exception. [grunt-browserify](https://github.com/jmreidy/grunt-browserify) provides an awesome grunt configuration for setting up your browserify builds and even comes with some extra sugar on top, such as bundled `browserify-shim`.

### Browser Field (package.json)

Browserify also supports the [browser](https://gist.github.com/shtylman/4339901) field in `package.json` files. That means module developers can specify specific files for use in browser builds, in case your module has node-specific code that can't or shouldn't be browserified.

## Next Steps

This has been a very brief introduction and I haven't even covered using the module in node or the grunt plugin. The [browserify docs](https://github.com/substack/node-browserify) certainly cover a lot more use cases, so definitely check it out. Also, feel free to leave a comment with any lingering issues, I'd love to do a follow up post covering issues that people have when getting started with Browserify.
