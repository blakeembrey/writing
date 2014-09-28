---
title: Introduction to Browserify
date: 2013-09-12 22:00
author: Blake Embrey
template: article.jade
---

> require('modules') in the browser.

[Browserify](https://github.com/substack/node-browserify) is a development tool that allows us to write node.js-style modules that compile for use in the browser. Just like node, we write our modules in separate files, exporting external methods and properties using the `module.exports` and `exports` variables. We can even require other modules using the `require` function, and if we omit the relative path it'll resolve to the module in the `node_modules` directory.

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

Now that we have a `bundle.js` file that bundled the three modules we wrote, we can add a single script tag reference to it into our html page and it'll execute in the browser automatically resolving `require` calls. `<script src="bundle.js"></script>` and we should see `15625` logged to the JavaScript console.

## NPM + Browserify

Since browserify implements the node.js module resolve algorithm, we can easily use npm to install modules from the package manager and use them inside the browser. There are lots of modules on npm that are made for tools such as browserify, but even more exciting is watching modules that were specifically written for node running in a browser environment without any effort. Let's install `underscore` and include it in our script.

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

The biggest attraction of browserify over similar tools would have to be the inclusion of [node.js core modules](https://github.com/substack/node-browserify#compatibility). Modules such as `url`, `path`, `stream`, `events` and `http` have all been ported for use in the browser. We can't do everything that node can do, but we can do everything a browser can do using node.js style code.

The most immediately obvious core modules that are useful on the client-side are `querystring`, `url` and `path`. By requiring these core modules, we can easily parse and resolves urls, query strings and paths in a client script. On top of that, the `process`, `Buffer`, `__dirname`, `__filename` and `global` variables are all populated with Browserify. That means we can use `process.nextTick` to easily invoke a function on the next event loop (with full cross-browser support). A special `process.browser` flag is also set in browserify builds, so we can do a quick check to see if the script is running in a browser environment (as opposed to node.js for all the cross-environment module developers).

## Transforms

The most powerful feature in Browserify are [source transforms](https://github.com/substack/node-browserify#list-of-source-transforms). A source transform is a stream injected between the resolved module and the content that is returned. A simple use case for using a source transform is compiling CoffeeScript to JavaScript. Using [coffeeify](https://github.com/substack/coffeeify) there is no longer a need for precompilation steps, it just works.

There are loads more transforms and you can easily write your own. Some transforms I find myself using regularly are [brfs](https://github.com/substack/brfs) (inlines file contents), [hbsfy](https://github.com/epeli/node-hbsfy) (precompile Handlebars templates, *better performance and smaller footprint*), [uglifyify](https://github.com/hughsk/uglifyify) (uglify bundled modules with UglifyJS2) and [envify](https://github.com/hughsk/envify) (use environment variables within modules).

## Advanced Options

### Debug

Using the `-d` flag with Browserify will enable source map support. Source maps allow us to view the file in all its natural, multiple file glory. Just make sure you have source maps enabled in your dev tools, and debugging compiled scripts will become 100x easier.

### Stand-alone

With the `-s <name>` option, we can create a bundle for public API consumption with other browser compile and runtime tools. It uses a UMD snippet to define an AMD module, CommonJS module and even falls back to aliasing the name to the `window` global.

### External

In a production website environment, you'll probably want to cut down on duplicate code being included by different modules. This can be done by using the `-x` flag, which specifies a module that should not be bundled directly with the build and instead required from the page itself. Combine this with the `-r` flag to explicitly require modules into a bundle, we can factor out common module dependencies and create a separate bundle.

### Browserify Shim

You'll probably find some module that can't simply be required because it was written for the browser environment. Conviently, we can write a simple polyfill using `module.exports = window.$` or similar. But what if it has dependencies in the global that we have used `require` with? We could alter the snippet a bit more and alias required modules, but even easier is the [browserify-shim](https://github.com/thlorenz/browserify-shim) module that was written specifically with this purpose in mind.

### Grunt task

Lots of people use Grunt everyday to run their build scripts, and browserify is no exception. [Grunt-browserify](https://github.com/jmreidy/grunt-browserify) provides an awesome grunt configuration for setting up your browserify builds and even comes with some extra sugar on top, such as a bundled `browserify-shim` config option.

### Browser Field (package.json)

Browserify also supports the [browser](https://gist.github.com/shtylman/4339901) field in `package.json` files. This allows module developers to specify specific files that should be used in browser builds, in the case that the module has node-specific code that can't or shouldn't be browserified.

## Next Steps

This has been a very brief introduction to Browserify and I haven't even covered everything that is possible. The [browserify docs](https://github.com/substack/node-browserify) cover plenty of information and additional flags, so definitely take a quick look. Feel free to leave a comment with any issues you have, I'd love to help out and write a follow up post that covers more uses.
