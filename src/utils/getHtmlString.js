/* @flow */

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import { minify } from 'html-minifier';
import { isProduction } from 'servers/env';
import type { ReduxState } from 'types';

export default function getHtmlString(
  css: React.Node,
  head: Object,
  content: string,
  initialState: ReduxState,
  loadableStateScript: React.Node,
  preloadResorceElement: React.Node
): string {
  const Html = (
    <html lang="ja">
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {isProduction ? preloadResorceElement : ''}
        {isProduction ? css : ''}
      </head>
      <body>
        <div
          id="root"
          dangerouslySetInnerHTML={{ __html: isProduction ? content : '' }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__ = ${serialize(initialState)}`,
          }}
        />
        {loadableStateScript}
        <script
          src={`/static/javascripts/vendor${isProduction ? '.min' : ''}.js`}
        />
        <script
          src={`/static/javascripts/main${isProduction ? '.min' : ''}.js`}
        />
      </body>
    </html>
  );
  const htmlString = renderToString(Html);
  const minifyConfig = {
    collapseWhitespace: true,
    removeComments: true,
    trimCustomFragments: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
  };

  return minify(htmlString, minifyConfig);
}
