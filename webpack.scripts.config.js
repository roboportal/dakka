/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('webpack')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const { version } = require('./package.json')

const mode = process.env.NODE_ENV ?? 'production'

const options = {
  mode,
  entry: {
    background: {
      import: path.resolve(__dirname, 'src/background/background.ts'),
      filename: 'background/[name].bundle.js',
    },
    contentScript: {
      import: path.resolve(__dirname, 'src/contentScript/contentScript.ts'),
      filename: 'contentScript/[name].bundle.js',
    },
    injection: {
      import: path.resolve(__dirname, 'src/contentScript/injection.ts'),
      filename: 'contentScript/[name].bundle.js',
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
    extensions: ['.ts'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/manifest.json'),
          to: path.join(__dirname, 'dist'),
          force: true,
          transform(content) {
            const parsed = JSON.parse(content)
            parsed.version = version
            return JSON.stringify(parsed, null, 2)
          },
        },
      ],
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
}

if (mode === 'development') {
  options.devtool = 'inline-cheap-source-map'
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
