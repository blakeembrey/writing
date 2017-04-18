const parse = require('date-fns/parse');
const { config } = require('./config');

exports.pageTitle = function(page) {
  return page.data.title
    ? `${page.data.title} • ${config.siteName}`
    : config.siteName;
};

exports.filterArticles = function(pages) {
  const articles = pages
    .filter(page => page.path !== '/404.html' && page.file.extname === '.md')
    .sort((a, b) => parse(b.data.date).getTime() - parse(a.data.date).getTime());

  return articles;
};
