"use strict"

//  webpack-transpile-watch.js

//webpack --progress --colors --watch
let webpack = require("webpack")
let webpackConfiguration = require(`../webpack.config.js`)

const compiler = webpack(webpackConfiguration)
compiler.watch({watch: true}, (err_ignore, stats_ignore) => {
}, {watchOptions: {aggregateTimeout: 300, poll: 1000}})

