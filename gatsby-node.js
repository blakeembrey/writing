const Feed = require('feed')
const { writeFile } = require('fs')
const { join } = require('path')
const { resolve } = require('url')
const { filterArticles } = require('./utils/pages')
const { config } = require('./utils/config')

exports.postBuild = function (pages, cb) {
  const now = new Date()

  const feed = new Feed({
    title: config.siteName,
    description: config.siteDescription,
    id: config.siteUrl,
    link: config.siteUrl,
    image: config.siteImage,
    copyright: `Copyright ${now.getFullYear()} ${config.authorName}`,
    updated: now,
    author: {
      name: config.authorName,
      email: config.authorEmail,
      link: config.authorUrl
    }
  })

  filterArticles(pages).forEach(page => {
    const url = resolve(config.siteUrl, page.path)

    feed.addItem({
      title: page.data.title,
      id: url,
      link: url,
      description: page.data.body,
      author: page.data.author || [{
        name: config.authorName,
        email: config.authorEmail,
        link: config.authorUrl
      }],
      contributor: page.data.contributor || [],
      date: new Date(page.data.date),
      image: page.data.image
    })
  })

  return writeFile(join(__dirname, 'public/rss.xml'), feed.rss2(), cb)
}
