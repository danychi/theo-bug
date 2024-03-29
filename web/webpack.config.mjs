import path from "path";

import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const rootDirectory = process.cwd();
const webpackEnvironment = process.env.NODE_ENV || "development";
const productionMode = webpackEnvironment === "production";

const BROWSERS_LIST_QUERY = ">0.2%, not dead, not op_mini all, Chrome >= 38";

/**
 * For details on how SWC is configured, refer to the `.swcrc` configuration file.
 *
 * @see /.swcrc
 * @type {webpack.RuleSetRule}
 */
const swcLoaderConfiguration = {
  test: /\.[jt]sx?$|\.mjs$|\.cjs$/,
  loader: "swc-loader",
  exclude: /node_modules\/(core-js\/|scheduler\/)/,
  options: { minify: productionMode },
};

/** @type {webpack.RuleSetRule} */
const fontsLoaderConfiguration = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  type: "asset/resource",
};

/** @type {webpack.RuleSetRule} */
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg|ico)$/,
  type: "asset/resource",
};

/** @type {webpack.RuleSetRule} */
const styleLoaderConfiguration = {
  test: /\.(css)$/,
  use: ["style-loader", "css-loader"],
};

/** @type {webpack.RuleSetRule} */
const htmlLoader = {
  test: /\.html$/,
  use: "html-loader",
};

/** @type {import('webpack').Configuration} */
const webpackConfig = {
  mode: webpackEnvironment,
  entry: { app: path.join(rootDirectory, "./index.web.tsx") },
  stats: "errors-only",
  output: {
    publicPath: "",
    path: path.resolve(rootDirectory, "build"),
    filename: "app-[contenthash].bundle.js",
    clean: true,
  },
  module: {
    rules: [
      swcLoaderConfiguration,
      imageLoaderConfiguration,
      fontsLoaderConfiguration,
      styleLoaderConfiguration,
      htmlLoader,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(rootDirectory, "./web/public/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
      __DEV__: process.env.APP_ENV !== "production",
    }),
    ...(webpackEnvironment === "development"
      ? [new webpack.HotModuleReplacementPlugin()]
      : []),
  ],
  resolve: {
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".tsx",
      ".ts",
      ".web.jsx",
      ".web.js",
      ".jsx",
      ".js",
    ],
    alias: {
      "react-native$": "react-native-web",
      react: path.join(rootDirectory, "./node_modules/react"),
      "react-dom": path.join(rootDirectory, "./node_modules/react-dom"),
      "react-native-web$": path.join(
        rootDirectory,
        "./node_modules/react-native-web"
      ),
    },
  },
  target: ["web", `browserslist: ${BROWSERS_LIST_QUERY}`],
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    devMiddleware: {
      // it generates the build folder, so then the webOS simulator can run the project on DEV mode
      writeToDisk: true,
    },
    static: [
      {
        directory: path.join(rootDirectory, "./web/public"),
      },
    ],
  },
};

export default { ...webpackConfig };
