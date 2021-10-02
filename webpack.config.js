var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["./js/app.js"],
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "HEXBUSTERS • A board game",
    }),
  ],
  module: {
    rules: [
      { test: /\.js|\.jsx$/, use: "babel-loader" },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              // Don't want ES modules because we need to dynamically require images.
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
