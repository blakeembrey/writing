const parse = require('date-fns/parse');
const cheerio = require('cheerio');
const { config } = require('./config');

const DESCRIPTION_LENGTH = 220;

exports.pageTitle = function(page) {
  return page.data.title
    ? `${page.data.title} • ${config.siteName}`
    : config.siteName;
};

exports.pageUrl = function(page) {
  return config.siteUrl + page.path;
};

exports.pageDescription = function(page) {
  if (page.data.description) {
    return page.data.description;
  }

  const $ = cheerio.load(page.data.body);
  const text = $('p').filter((i, el) => !el.parent).first().text();
  const index = text.substr(DESCRIPTION_LENGTH).search(/\s/);

  return index === -1 ? text : `${text.substr(0, DESCRIPTION_LENGTH + index)}…`;
};

exports.filterArticles = function(pages) {
  const articles = pages
    .filter(page => page.path !== '/404.html' && page.file.extname === '.md')
    .sort(
      (a, b) => parse(b.data.date).getTime() - parse(a.data.date).getTime()
    );

  return articles;
};
