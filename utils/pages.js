const moment = require('moment');
const { config } = require('./config');

exports.pageTitle = function(page) {
  return page.data.title
    ? `${page.data.title} • ${config.siteName}`
    : config.siteName;
};

exports.filterArticles = function(pages) {
  const articles = pages
    .filter(page => page.path !== '/404.html' && page.file.extname === '.md')
    .sort((a, b) => moment(b.data.date).unix() - moment(a.data.date).unix());

  return articles;
};
