var metalsmith = require('metalsmith')
var drafts = require('metalsmith-drafts')
var define = require('metalsmith-define')
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdown')
var permalinks = require('metalsmith-permalinks')
var collections = require('metalsmith-collections')
var date = require('metalsmith-build-date')
var redirect = require('metalsmith-redirect')
var autoprefixer = require('metalsmith-autoprefixer')
var css = require('metalsmith-clean-css')
var fingerprint = require('metalsmith-fingerprint')

metalsmith(__dirname)
  .source('src')
  .use(define({
    blog: {
      url: 'http://blakeembrey.com',
      title: 'Blake Embrey',
      description: 'Avid software engineer who occasionally finds time to compose a few words.'
    },
    googleAnalytics: 'UA-22855713-2',
    owner: {
      url: 'http://blakeembrey.me',
      name: 'Blake Embrey'
    },
    moment: require('moment')
  }))
  .use(redirect({
    '/articles/angular-js-number-validation-bug/': '/articles/2014/05/angular-js-number-validation-bug/',
    '/articles/introducing-node-retest/': '/articles/2014/02/introducing-node-retest/',
    '/articles/mocha-test-harmony-generators/': '/articles/2014/02/mocha-test-harmony-generators/',
    '/articles/partial-application-in-javascript/': '/articles/2014/01/partial-application-in-javascript/',
    '/articles/forcing-function-arity-in-javascript/': '/articles/2014/01/forcing-function-arity-in-javascript/',
    '/articles/compose-functions-javascript/': '/articles/2014/01/compose-functions-javascript/',
    '/articles/wrapping-javascript-functions/': '/articles/2014/01/wrapping-javascript-functions/',
    '/articles/javascript-result-utility/': '/articles/2014/01/javascript-result-utility/',
    '/articles/javascript-invoke-function/': '/articles/2014/01/javascript-invoke-function/',
    '/articles/javascript-tap-function/': '/articles/2014/01/javascript-tap-function/',
    '/articles/writing-github-pages-deploy-script/': '/articles/2013/08/writing-github-pages-deploy-script/',
    '/articles/sublime-text-preferences/': '/articles/2013/08/sublime-text-preferences/',
    '/articles/introduction-to-browserify/': '/articles/2013/09/introduction-to-browserify/',
    '/articles/javascript-variadic-function/': '/articles/2013/12/javascript-variadic-function/',
    '/articles/javascript-bind-function/': '/articles/2013/12/javascript-bind-function/',
    '/articles/warning-somethings-not-right/': '/articles/2011/09/warning-somethings-not-right/',
    '/articles/geektool-change-desktop-background/': '/articles/2011/10/geektool-change-desktop-background/',
    '/articles/local-development-with-dnsmasq/': '/articles/2012/04/local-development-with-dnsmasq/',
    '/articles/contributing-to-open-source/': '/articles/2013/04/contributing-to-open-source/',
    '/articles/improve-dev-tools-console-workflow/': '/articles/2013/07/improve-dev-tools-console-workflow/',
    '/articles/wii-jailbreak-3-0-4-2/': '/articles/2011/04/wii-jailbreak-3-0-4-2/'
  }))
  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown({
    gfm: true,
    tables: true,
    highlight: require('highlighter')()
  }))
  .use(date())
  .use(drafts())
  .use(permalinks())
  .use(autoprefixer())
  .use(css({
    files: '**/*.css',
    cleanCSS: {
      rebase: true
    }
  }))
  .use(fingerprint({
    pattern: '{css,vendor}/**/*'
  }))
  .use(layouts({
    engine: 'pug',
    directory: 'layouts'
  }))
  .destination('build')
  .build(function (err) {
    if (err) {
      throw err
    }

    console.log('Build completed!')
  })
