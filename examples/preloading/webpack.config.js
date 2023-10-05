const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRouterPreloadChunksPlugin = require("html-webpack-preload-react-router");
const entryRouteFilename = path.resolve(`./src/pages/entryRoute.route.js`);

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3000,
    devMiddleware: { stats: "errors-warnings" },
  },
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      scriptLoading: "module",
      templateContent: ({ htmlWebpackPlugin }) => `
        <html>
        <head>
          ${htmlWebpackPlugin.tags.headTags}
          <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
        </head>
        <body>
          <div id="app"></div>
        </body>
        </html>
      `,
    }),
    new ReactRouterPreloadChunksPlugin({
      entryRoute: entryRouteFilename,
    }),
  ],
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/",
    filename: "scripts/[name].[contenthash:6].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [["@babel/preset-react"]],
        },
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom/client": "ReactDOM",
  },
};
