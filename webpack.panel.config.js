const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const alias = {
  'react-dom': '@hot-loader/react-dom',
  components: path.resolve(__dirname, 'src/panel/components'),
  constants: path.resolve(__dirname, 'src/panel/constants'),
  hooks: path.resolve(__dirname, 'src/panel/hooks'),
  store: path.resolve(__dirname, 'src/panel/store'),
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
    devTools: {
      import: path.resolve(__dirname, 'src/devTools/devTools.ts'),
      filename: 'devTools/[name].bundle.js',
    },
    panel: {
      import: path.resolve(__dirname, 'src/panel/index.tsx'),
      filename: 'devTools/[name].bundle.js',
    },
    testPage: {
      import: path.resolve(__dirname, 'src/testPage/index.ts'),
      filename: 'testPage/[name].bundle.js',
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
  resolve: {
    alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/devTools/devTools.html'),
      filename: 'devTools/devTools.html',
      chunks: ['devTools'],
      publicPath: '..',
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/panel/panel.html'),
      filename: 'devTools/panel.html',
      chunks: ['panel'],
      publicPath: '..',
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/testPage/index.html'),
      filename: 'testPage/testPage.html',
      chunks: ['testPage'],
      publicPath: '..',
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
    https: false,
    hot: true,
    client: {
      overlay: { errors: true, warnings: false },
    },
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

  const hot = [
    'react-devtools',
    'webpack/hot/dev-server',
    `webpack-dev-server/client?hot=true&hostname=localhost&port=${port}`,
  ]

  options.entry.panel.import = [...hot, options.entry.panel.import]
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
