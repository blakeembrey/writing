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
      const pages = filterArticles(
        this.props.route.pages
      ).reduce((pages, page) => {
        const date = parse(page.data.date);
        const parts = page.path.substr(1).split('/');

        pages.push(
          <p key={page.path}>
            <Link to={prefixLink(page.path)}>{page.data.title}</Link>
            <span className={subStyle}>
              <time dateTime={date.toISOString()}>
                {' '}{format(date, 'MMM YYYY')}
              </time>
              {parts.length > 1 ? ` / ${parts[0]}` : undefined}
            </span>
          </p>
        );

        return pages;
      }, []);

      return <div>{pages}</div>;
    }
  },
  IndexStyle
);
