const webpack = require('webpack')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const alias = {
  'react-dom': '@hot-loader/react-dom',
}

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

const mode = process.env.NODE_ENV
const port = process.env.PORT

const options = {
  mode,
  entry: {
    background: path.resolve(__dirname, 'src/background/background.ts'),
    contentScript: path.resolve(
      __dirname,
      'src/contentScript/contentScript.ts',
    ),
    injection: path.resolve(__dirname, 'src/contentScript/injection.ts'),
    devTools: path.resolve(__dirname, 'src/devTools/devTools.ts'),
    panel: path.resolve(__dirname, 'src/panel/index.tsx'),
    testPage: path.resolve(__dirname, 'src/testPage/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'ts-loader' }],

        exclude: [/node_modules/, /dist/],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/manifest.json'),
          to: path.join(__dirname, 'dist'),
          force: true,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/devTools/devTools.html'),
      filename: 'devTools.html',
      chunks: ['devTools'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/panel/panel.html'),
      filename: 'panel.html',
      chunks: ['panel'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/testPage/index.html'),
      filename: 'testPage.html',
      chunks: ['testPage'],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
}

if (mode === 'development') {
  options.devtool = 'cheap-module-source-map'
  options.devServer = {
    https: false,
    hot: false,
    client: false,
    host: 'localhost',
    port: port,
    devMiddleware: {
      publicPath: `http://localhost:${port}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  }
  options.plugins.push(new webpack.HotModuleReplacementPlugin())

  const hot = [
    'webpack/hot/dev-server',
    `webpack-dev-server/client?hot=true&hostname=localhost&port=${port}`,
  ]

  options.entry.panel = [...hot, options.entry.panel]
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = options
