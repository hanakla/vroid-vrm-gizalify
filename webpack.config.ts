import webpack from "webpack";
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
      extensions: [".js", ".ts"]
    },
    module: {
      rules: [
        {
          test: /\.ts?/,
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "Gizabalify for VRoid VRM",
        template: "src/index.html"
      })
    ]
  } as webpack.Configuration);
