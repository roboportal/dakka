/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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

const mode = process.env.NODE_ENV ?? 'production'
const port = process.env.PORT

const options = {
  mode,
  entry: {
    index: {
      import: path.resolve(__dirname, 'src/index.ts'),
      filename: '[name].bundle.js',
    },
    frame: {
      import: path.resolve(__dirname, 'src/frame.ts'),
      filename: '[name].bundle.js',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
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

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.ejs'),
      filename: 'index.html',
      templateParameters: {
        iframeSrc: 'frame.html',
      },
      chunks: ['index'],
      publicPath: '.',
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/frame.html'),
      filename: 'frame.html',
      chunks: ['frame'],
      publicPath: '.',
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
}

if (mode === 'development') {
  options.devtool = 'inline-cheap-source-map'

  options.devServer = {
    hot: true,
    client: {
      overlay: { errors: true, warnings: false },
    },
    port: port,
  }
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
