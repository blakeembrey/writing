import React from 'react';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Helmet from 'react-helmet';
import { create, wrap } from 'react-free-style';
import { config } from '../utils/config';
import { pageTitle } from '../utils/pages';

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
      const post = this.props.route.page.data;
      const date = parse(post.date);

      return (
        <div>
          <Helmet title={pageTitle(page)} />
          <h1>{post.title}</h1>
          <ul className={infoStyle}>
            {post.date ?
              <li>
                Written
                {' '}
                <time dateTime={date.toISOString()}>
                  {format(date, 'MMMM YYYY')}
                </time>
              </li> :
              undefined
            }
            {post.github
              ? <li>
                  <a href={`https://github.com/${post.github}`}>
                    View on GitHub
                  </a>
                </li>
              : undefined}
            {post.npm
              ? <li>
                  <a href={`http://npmjs.org/package/${post.npm}`}>
                    Install with NPM
                  </a>
                </li>
              : undefined}
          </ul>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
          <hr />
          <p>
            <strong>Questions?</strong>
            {' '}
            Ask me on
            {' '}
            <a href={config.twitter}>Twitter</a>
            {' '}
            or in
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
