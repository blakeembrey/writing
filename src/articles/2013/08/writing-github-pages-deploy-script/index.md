---
title: Writing a Github Pages Deploy Script
date: 2013-08-04 20:40
author: Blake Embrey
template: article.jade
---

Lately I have found myself creating more and more sites of the static kind and deploying them Github Pages. Regularly, this would involve having a `public` directory which contains all the assets before I build them (think preprocessor - SASS, Less, Stylus, Jade, Browserify, Requirejs) and another `build` directory where these assets are compiled to during development, testing and deployment. I found myself doing this so often, I figured I'd better make a little Makefile script for me to easily deploy any directory to Github Pages.

```bash
deploy:
  @grunt build
  @cd ./build && git init . && git add . && git commit -m \"Deploy\" && \
  git push "git@github.com:blakeembrey/<repo>.git" master:gh-pages --force && rm -rf .git
```

All the script does is run the build, in this case `grunt build` and initialises the `build` directory as a git repository. It then commits all the directory contents and pushes it up to the Github Pages branch of a repo you define.
