---
title: Contributing to Open Source
date: 2013-04-03 20:35
author: Blake Embrey
template: article.jade
---

> “Software is like sex; it's better when it's free.”
> - Linus Torvalds

Being able to contribute to open source is an awesome feeling. The feeling of having code which thousands, if not millions, of people will run everyday is enough to make you cringe. Surprisingly though, few people realize how empowering, yet simple, contributing to an open source project can be.

In this article I am going to run you through what my usual process looks like when issuing a pull request through GitHub, and what sort of things to expect.

## First Steps

The first thing you'll need is an open source library or project that you are passionate about. Finding a library that fits this criteria can be difficult, but I am sure there are a dozen of projects you take for granted everyday. It's unlikely you even realize how many issues some libraries have backlogged to work through.

Once you have found a project you are interested in contributing to, chances are it's on GitHub. If it's not on GitHub, repeat the previous step. For the purpose of this blog post, I'll be running with [this issue from Stylus](https://github.com/LearnBoost/stylus/issues/989).

![Stylus issue on GitHub](http://f.cl.ly/items/2n2R1S3M291X3V1k110C/CapturFiles_1.png)

The first thing you'll need to do is fork the repo. This is done by clicking the `Fork` button in the top right of GitHub. Once you fork the repo, you'll have your own personal copy of the original repo that you can do what you want with. From there, you'll want to use you command line to clone the repo off GitHub.

![Local Stylus Fork](http://f.cl.ly/items/0s0V12453x0X3Z102i1Z/CapturFiles_3.png)

```
git clone git@github.com:blakeembrey/stylus.git
```

After cloning the repository, you'll now have a local copy on your machine. My next step is usually to set up the `upstream` repository link for pulling down code.

```
git remote add upstream git@github.com:LearnBoost/stylus.git
```

The next step is to create a branch, normally based on the name or description of the issue you are trying to solve. You don't want to make your changes in the `master` branch as it will make future updates and pull requests more difficult to do.

```
git checkout -b media-query-colon
```
With that command, I'll quickly create a new branch based off `master` and switch to it. The first thing you'll want to do before writing any code is try and find the test suite for the project (hopefully they have one). This is the most useful thing I find during development, especially when it's a library I'm not entire familiar with. With Stylus, I know I can find the test script under the scripts section the `package.json`.

```
npm test
```

![Command Line after working through the previous steps](http://f.cl.ly/items/0f0x1n22031F3j3E060D/CapturFiles_4.png)

## Committing your work

Running the test script should quickly give an overview of how the library is constructed and the current status of the library. Most of the time, all tests should be passing - otherwise this would mean more bugs that need fixing.

After running the test script, I usually find it useful to whip up a new test based on the issue you are trying to solve - which will be failing initially. This is known as Test Driven Development (TDD), and will be crucial as you explore the core of some libraries. Make sure to add as many test cases to demostrate the issue and fix, which will also stop future regressions.

> In lieu of a formal styleguide, take care to maintain the existing coding style.

When contributing to someone elses library, you'll want to make sure your coding style is matching the code which already exists. This is an important concept to understand, as it makes future commits easier to read through when all the code is consistent. [All code in any code-base should look like a single person typed it, no matter how many people contributed](https://github.com/rwldrn/idiomatic.js/#all-code-in-any-code-base-should-look-like-a-single-person-typed-it-no-matter-how-many-people-contributed). You may find that some projects also include a [CONTRIBUTING.md](https://github.com/twitter/bootstrap/blob/master/CONTRIBUTING.md) file.

Somewhere during this time you'll want to commit your changes. Next, we'll want to push our changes back to the remote repository we cloned from earlier (`git push -u origin media-query-colon`). This will create a new branch on the remote repo to track from. Once the code is pushed back up to GitHub, you can create a pull request from your repo back to the original (`upstream`).

## Creating a pull request

When creating the pull request, it is vital to provide a descriptive title and contents - anyone reading the issue should understand what your trying to achieve before reading any code. If there are similar issues or you were fixing an existing issue, make sure to take a note of the issue numbers in the issue description. You can even make a reference to another repo if it affects it - this shows the impact of your change and demostrates the priority of your patch.

## Keeping it relevant

Chances are, by now there have been new commits created since you forked the repo, or perhaps your commit history for the issue is just getting a little unwieldly. Fortunately there is a simple utility built into git for this known as rebasing.

```
git checkout master
git pull upstream master
git checkout media-query-colon
git rebase -i master # Interactively rebase
```

![Rebase process](http://f.cl.ly/items/1k3N1Q1I282p3Y3J233L/CapturFiles_6.png)

A rebase will rewrite your commit history, so you can squash commits together into a single commit and clean up all the changes you have made. It'll also move the commits to be the lastest in the commit log. Because the history will be rewritten, next time you push you'll probably need to use the force push flag which overrides the remote commit (`git push -f`).

Luckily, with the way GitHub works, any commits in the branch - new or old -  will be appended to your pull request. This makes is simple to quickly iterate on any issues raised by fellow developers or the project owner.

## Completion

Now you are likely done. Depending on the repo and repo owner(s), it could take anywhere from a few minutes to a few months for your pull request to be reviewed. It won't always be perfect, and it may be denied. In the case of your pull request being denied, check out the feedback - it'll usually be really useful and maybe even give you an idea of where to go from there. If not, there are always more repos in need of contributors.
