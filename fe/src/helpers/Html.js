import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  }

  render() {
    const {assets, component, store} = this.props;
    const content = component ? renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html>
        <head>
          {head.title.toComponent()}
          {/* 缩放控制 */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"/>
          {/* 删除默认的苹果工具栏和菜单栏 */}
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link key={key} href={assets.styles[style]} rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}
        </head>
        <body>
          <div style={{display: 'none'}} dangerouslySetInnerHTML={{__html:
            `<!--[if lt IE 9]>
              <script src="/static/scripts/html5.js" charSet="UTF-8"></script>
              <script src="/static/scripts/css3-mediaqueries.min.js" charSet="UTF-8"></script>
            <![endif]-->`
          }} />
          <div id="app" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}}/>
          {Object.keys(assets.javascript).map((script, key) =>
            <script key={key} src={assets.javascript[script]} charSet="UTF-8"/>
          )}
        </body>
      </html>
    );
  }
}
