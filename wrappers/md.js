import React from 'react';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Helmet from 'react-helmet';
import { create, wrap } from 'react-free-style';
import { config } from '../utils/config';
import { pageTitle, pageUrl, pageDescription } from '../utils/pages';

const Style = create();
const infoColor = '#777';

const infoStyle = Style.registerStyle({
  margin: '1.5em 0',
  padding: 0,
  color: infoColor,
  fontSize: '0.85em',
  '> li > a': {
    color: infoColor
  },
  '> li': {
    listStyle: 'none',
    display: 'inline-block',
    paddingRight: 20
  }
});

module.exports = wrap(
  class extends React.Component {
    render() {
      const { page } = this.props.route;
      const { data } = page;
      const date = parse(data.date);
      const description = pageDescription(page);

      return (
        <div>
          <Helmet>
            <title>{pageTitle(page)}</title>
            <link rel="canonical" href={pageUrl(page)} />
            <meta name="og:type" content="article" />
            <meta name="og:title" content={data.title} />
            <meta name="og:site_name" content={config.siteName} />
            <meta name="og:url" content={pageUrl(page)} />
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
            {data.image
              ? <meta name="og:image" content={data.image} />
              : undefined}
            {data.date
              ? <meta
                  name="article:published_time"
                  content={date.toISOString()}
                />
              : undefined}
            <meta name="twitter:site" content="@blakeembrey" />
          </Helmet>
          <h1>{data.title}</h1>
          <ul className={infoStyle}>
            {data.date
              ? <li>
                  Written
                  {' '}
                  <time dateTime={date.toISOString()}>
                    {format(date, 'D MMMM YYYY')}
                  </time>
                </li>
              : undefined}
            {data.github
              ? <li>
                  <a href={`https://github.com/${data.github}`}>
                    View on GitHub
                  </a>
                </li>
              : undefined}
            {data.npm
              ? <li>
                  <a href={`http://npmjs.org/package/${data.npm}`}>
                    Install with NPM
                  </a>
                </li>
              : undefined}
          </ul>
          <div dangerouslySetInnerHTML={{ __html: data.body }} />
          <hr />
          <p>
            <strong>Questions?</strong>
            {' '}
            Find me on
            {' '}
            <a href="https://twitter.com/blakeembrey">Twitter</a>,
            {' '}
            <a href="https://toot.cafe/@blakeembrey">Mastodon</a>
            {' '}
            or
            {' '}
            <a href={config.siteRepo}>my repo</a>
            .
          </p>
        </div>
      );
    }
  },
  Style
);
