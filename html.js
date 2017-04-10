import React from 'react';
import Helmet from 'react-helmet';
import * as ReactFreeStyle from 'react-free-style';
import { prefixLink } from 'gatsby-helpers';
import { config } from './utils/config';

const BUILD_TIME = new Date().getTime();

export default class extends React.Component {
  render() {
    const head = Helmet.rewind();
    const style = ReactFreeStyle.rewind();

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {style.toComponent()}
        </head>
        <body>
          <div
            id="react-mount"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {config.gaCode
            ? <script
                dangerouslySetInnerHTML={{
                  __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', ${JSON.stringify(config.gaCode)}, 'auto');
          ga('send', 'pageview');`
                }}
              />
            : undefined}
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
        </body>
      </html>
    );
  }
}
