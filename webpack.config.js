const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const pages = ['index', 'test'];

const avatarsFolder = {
  from: path.resolve(__dirname, "src/img/avatars"),
  to: path.resolve(__dirname, 'dist/img/avatars'),
};


module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),

  entry: pages.reduce((entryConfig, page) => {
    entryConfig[page] = `./js/${page}.js`;
    return entryConfig;
  }, {}),


  output: {
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: isProduction,
    assetModuleFilename: isDevelopment ? '[path]/[name][ext]' : '[path]/[name][contenthash][ext]',
  },


  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          isProduction ? 'postcss-loader' : '',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },


  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: isDevelopment,
    port: 3000,
  },


  plugins: [].concat(
    pages.map(
      (page) =>
        new HTMLWebpackPlugin({
          inject: true,
          template: `./${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
          minify: {
            collapseWhitespace: isProduction,
          },
        })
    ),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'css/[name].css' : 'css/[name].[contenthash].css',
    }),
    new ESLintPlugin(),
    new CopyPlugin({
      patterns: [
        avatarsFolder,
      ],
    }),
  ),


  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
            ],
          },
        },
      }),
      new ImageminWebpWebpackPlugin(),
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ]
  },


  devtool: isDevelopment ? 'source-map' : false,
}

