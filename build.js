var metalsmith   = require('metalsmith');
var drafts       = require('metalsmith-drafts');
var define       = require('metalsmith-define');
var templates    = require('metalsmith-templates');
var markdown     = require('metalsmith-markdown');
var permalinks   = require('metalsmith-permalinks');
var collections  = require('metalsmith-collections');
var date         = require('metalsmith-build-date');
var redirect     = require('metalsmith-redirect');
var autoprefixer = require('metalsmith-autoprefixer');
var snippet      = require('metalsmith-snippet');
var paginate     = require('metalsmith-collections-paginate');

metalsmith(__dirname)
  .source('src')
  .use(define(require('./config/define')))
  .use(redirect(require('./config/redirect')))
  .use(collections(require('./config/collections')))
  .use(paginate(require('./config/paginate')))
  .use(markdown(require('./config/markdown')))
  .use(date())
  .use(drafts())
  .use(snippet())
  .use(permalinks())
  .use(autoprefixer())
  .use(templates(require('./config/templates')))
  .destination('build')
  .build(function (err) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
  });
