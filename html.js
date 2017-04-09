import React from 'react'
import Helmet from 'react-helmet'
import * as ReactFreeStyle from 'react-free-style'
import { prefixLink } from 'gatsby-helpers'

const BUILD_TIME = new Date().getTime()

export default class extends React.Component {

  render () {
    const head = Helmet.rewind()
    const style = ReactFreeStyle.rewind()

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {style.toComponent()}
        </head>
        <body>
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
        </body>
      </html>
    )
  }

}
