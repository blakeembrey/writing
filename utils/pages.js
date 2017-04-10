const moment = require('moment')

exports.filterArticles = function (pages) {
  const articles = pages
    .filter((page) => page.path !== '/404.html' && page.file.extname === '.md')
    .sort((a, b) => moment(b.data.date).unix() - moment(a.data.date).unix())

  return articles
}
