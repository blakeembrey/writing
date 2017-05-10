var frontMatter = require('front-matter');
var markdownIt = require('markdown-it');
var highlighter = require('highlighter');

var md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlighter()
})
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-attrs'));

exports.md = function(content) {
  const meta = frontMatter(content);
  const body = md.render(meta.body);

  return Object.assign({}, meta.attributes, {
    body
  });
};
