// https://github.com/jantimon/html-webpack-plugin#events
// https://github.com/vuejs/preload-webpack-plugin/blob/master/src/index.js
// https://github.com/googlechromelabs/preload-webpack-plugin
// https://github.com/saiichihashimoto/react-router-html-webpack-plugin/blob/master/src/index.js


const HtmlWebpackPlugin = require("html-webpack-plugin");
const createScriptInnerHTML = require("./lib/webpack-plugin-create-html-preload-pages");

class ReactRouterPreloadChunksPlugin {
  constructor(options) {
    this.options = Object.assign({}, options);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(
        this.constructor.name,
        (htmlPluginData) => {
          const htmlTemplate = createScriptInnerHTML(compilation, this.options.entryRoute)
          htmlPluginData.headTags.unshift({
            tagName: 'script',
            innerHTML: htmlTemplate
          });
          return htmlPluginData;
        }
      );
    });
  }
}

module.exports = ReactRouterPreloadChunksPlugin;
