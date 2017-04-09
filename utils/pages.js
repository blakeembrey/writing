exports.filterArticles = function (pages) {
  return pages
    .filter((page) => page.path !== '/404.html' && page.file.extname === '.md')
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))
}
