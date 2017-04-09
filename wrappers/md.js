import React from 'react';
import moment from 'moment';
import Helmet from 'react-helmet';
import { create, wrap } from 'react-free-style';
import { config } from '../utils/config';

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
    propTypes() {
      return {
        router: React.PropTypes.object
      };
    }

    render() {
      const post = this.props.route.page.data;
      const date = moment(post.date);

      return (
        <div>
          <Helmet title={`${post.title} • ${config.siteName}`} />
          <h1>{post.title}</h1>
          <ul className={infoStyle}>
            <li>
              Written
              {' '}
              <time dateTime={date.toISOString()}>
                {date.format('MMMM YYYY')}
              </time>
            </li>
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
