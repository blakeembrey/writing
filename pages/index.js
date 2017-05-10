import React from 'react';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import { create, wrap } from 'react-free-style';
import { filterArticles } from '../utils/pages';

const IndexStyle = create();

const subStyle = IndexStyle.registerStyle({
  color: '#777',
  fontSize: '0.8em'
});

module.exports = wrap(
  class extends React.Component {
    render() {
      const pages = filterArticles(this.props.route.pages)
        .sort((a, b) => {
          return a.path < b.path ? 1 : -1;
        })
        .reduce((pages, page) => {
          const parts = page.path.replace(/^\/|\/$/g, '').split('/');

          pages.push(
            <li key={page.path}>
              <Link to={prefixLink(page.path)}>{parts.join(' / ')}</Link>
            </li>
          );

          return pages;
        }, []);

      return <ul>{pages}</ul>;
    }
  },
  IndexStyle
);
