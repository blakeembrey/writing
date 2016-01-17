---
title: Introduction to Free Style (and CSS-in-JS)
date: 2016-01-17 14:45
author: Blake Embrey
template: article.jade
github: blakeembrey/free-style
npm: free-style
---

With the release of Free Style 1.0, I figure it's about time to write about Free Style - how it works, why you'd want to use it and little introduction to CSS-in-JS. This has been a long time coming, with my first commit to Free Style over a year ago, and the first commit to Free Style in its current form 10 months ago. This is not a blog post designed to sway decisions - as always, you should use your own fair judgement.

## CSS-in-JS

The idea of CSS-in-JS is well covered in [this presentation by React engineer](https://speakerdeck.com/vjeux/react-css-in-js), Christopher Chedeau, and by [many](https://github.com/MicheleBertoli/css-in-js) [others](http://formidable.com/blog/2015/03/01/launching-radium/), so I'll be brief. As React popularized the declarative DOM, it also enabled a generation of CSS-in-JS approaches that attempt to solve the many pitfalls of CSS. These pitfalls are well known and documented, and including "features" such as the global namespace, constant sharing and many approaches to component isolation (BEM, SMACSS). Writing CSS in a way that avoids the pitfalls can be regarded an art.

CSS-in-JS approaches exist to solve the pollution of the global namespace, constant sharing, component isolation, and bring many other unforeseen benefits. The JS part exists because these solutions utilize JavaScript as the way to provide namespacing, constant sharing and proper isolation. You may have already known, but these are things that have long been solved in programming languages, including JavaScript - with CommonJS, AMD and recently ES6 modules. It stands to reason that, if possible, JavaScript will provide a more sound foundation for writing modular CSS. Tooling for JavaScript is more mature, with the ability to do autocompletion, dead code elimination and linting common-place.

## How and Why Does Free Style Work?

Free Style works with hashes. If there's one word you should love at the end of this section, it's hashing. With that said, the essence of [free-style](https://github.com/blakeembrey/free-style/blob/master/src/free-style.ts) is less than 500 lines of code (in TypeScript), so I definitely suggest you check it out.

Free Style is built on top of a core `Cache` class. This class implements a way to append children using an ID (which is a hash), keeps track of how many times a child was added and removed, and can also attach simple change listeners (for when a child is added or removed). Three classes extend the `Cache` implementation to replicate the structure of CSS - `Rule`, `Style` and `FreeStyle`. The only other important class is `Selector`, which implements a `Cacheable` interface (`Cache` fulfills the same interface).

Using these four classes, we can replicate CSS to automatically de-dupe styles. First, we create a `FreeStyle` instance (it can be imagined as a `.css` file). This class holds `Rule` and `Style` children. When you use `registerStyle`, it'll stringifying each object to CSS and hash the contents, while also propagating any rules upward (E.g. when `@media` nested inside a style). The result is a single style registering (potentially) a number of `Style` and `Rule` instances, all of which have their hashes of their own contents. Throughout each instance creation, `registerStyle` collects a separate hash that is returned as the CSS class name to use. Finally, when the final class name hash is known, the class name is interpolated with all selectors and returned for you to use.

The result of this means that duplicate hashes are automatically merged. A duplicate hash means a duplicate rule or style. The benefit of separating `Rule` and `Style` means that two identical media queries can be merged together (less CSS output) and so can identical styles within each context (E.g. identical styles inside and outside the media query can not be merged, but duplicates both inside or output can be).

The other interesting methods are `registerRule` and `registerKeyframes`. Both work similar to `registerStyle`, but are much be simpler. `registerRule` works by recursively registering rules, which are automatically being hashed based on the rule and the contents. `registerKeyframes` works by creating rules and styles that get added to a `Rule` instance with a selector of the hashed contents (hence keyframes are automatically hashed too).

All this hashing results in the fact that all styles are automatically unique. Registered styles and keyframes have a hash to identify them and the chance of a conflict is now left to the computer to resolve, not you. The other pitfalls of CSS are automatically solved as a result, as the hash can only be known and exposed by the implementor while constants and features are solved in JavaScript (you can even use NPM libraries for style manipulation now).

## Free Style Output Targets

Now you understand how Free Style works, the output targets should make a lot more sense. By default, Free Style exposes a feature-rich implementation ready for third-parties to build on top of it. To use it already, you must create instances of `FreeStyle`, merge the multiple instances and use `getStyles` to get the CSS output. There's also an `inject` method, which will take the result of `getStyles` and put in between `<style />` tags in the `<head />`.

Currently, there are two other implementations of output targets. The first is [`easy-style`](https://github.com/jkroso/easy-style), a simple wrapper around the complex functionality in Free Style that abstracts away multiple `FreeStyle` instances. It exposes three core methods - `style`, `rule`, `keyframe` - without having multiple instances, which makes it suitable for most webapps. There's also [`react-free-style`](https://github.com/blakeembrey/react-free-style) which extends the core `FreeStyle` with the ability to wrap components and use React's `context` for collecting all the styles used in the application. This is an interesting feature with interesting repercussions, such as the fact that only styles for components currently rendered will be output (useful for minimizing the transfer size of isomorphic applications).

## Other CSS-in-JS Solutions

A number of other CSS-in-JS solutions also exist, including [`radium`](https://github.com/FormidableLabs/radium), [`react-style`](https://github.com/js-next/react-style) and [`jss`](https://github.com/jsstyles/jss). Radium takes an all JavaScript approach, while `jss` and `react-style` are more similar. Where `jss` and `react-style` differ to `free-style` is with the approaches they took. Both went for namespacing in CSS by generating unique names instead of hashes. They also both went with `StyleSheet` instances that you create once, while `free-style` makes you register styles at each step (for a good reason, it allows linters to detect when a style is no longer used as it'll appear as dead code). They may also restrict some subset of CSS that you can actually use for different reasons. As far as I can tell, neither go further with CSS tooling concepts such as de-duping.
