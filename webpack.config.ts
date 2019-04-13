import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default () =>
  ({
    entry: "./src/index",
    output: {
      path: join(__dirname, "public"),
      filename: "[name].js"
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.sass/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[name]__[local]--[hash:base64:8]"
              }
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass")
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "サムネ映えチェッカー",
        files: {
          css: ["style.css"]
        }
      }),
      new MiniCssExtractPlugin({
        filename: "style.css"
      })
    ]
  } as webpack.Configuration);
