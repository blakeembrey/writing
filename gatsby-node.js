const Feed = require('feed');
const parse = require('date-fns/parse');
const unthenify = require('unthenify');
const { writeFile, readFile } = require('mz/fs');
const { join } = require('path');
const { resolve } = require('url');
const { md } = require('./utils/render');
const { filterArticles } = require('./utils/pages');
const { config } = require('./utils/config');

exports.postBuild = unthenify(function(pages) {
  const now = new Date();

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
  });

  const files = filterArticles(pages).slice(0, 15).reduce((p, page) => {
    const url = resolve(config.siteUrl, page.path);

    return p.then(() => {
      return readFile(
        join(__dirname, 'pages', page.requirePath),
        'utf8'
      ).then(contents => {
        const data = md(contents);

        feed.addItem({
          title: page.data.title,
          id: page.path,
          link: url,
          content: data.body,
          author: page.data.author || [
            {
              name: config.authorName,
              email: config.authorEmail,
              link: config.authorUrl
            }
          ],
          contributor: page.data.contributor || [],
          date: parse(page.data.date),
          image: page.data.image
        });
      });
    });
  }, Promise.resolve());

  return files.then(() => {
    return writeFile(join(__dirname, 'public/rss.xml'), feed.rss2());
  });
});
