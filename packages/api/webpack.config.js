"use strict";

const Path = require("path");

module.exports = {
  entry: Path.join(__dirname, "src/client/index.ts"),
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: Path.resolve(__dirname, "assets"),
    filename: "client.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  mode: "development",
  target: "web",
};
