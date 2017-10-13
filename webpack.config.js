var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.css?$/,
            loaders: ['style', 'raw'],
            include: __dirname
        }]
    },
    // devServer: {
    //   contentBase: "./public",//本地服务器所加载的页面所在的目录
    //   colors: true,//终端中输出结果为彩色
    //   historyApiFallback: true,//不跳转
    //   inline: true//实时刷新
    // },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                //- 移除代码中的注释
                comments: false,
            },
            compress: {
                warnings: false,
                //- 移除所有调试代码：console
                drop_console: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin("ccx-2017-6-8")
    ] : [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    devtool: process.env.NODE_ENV === 'production' ? 'none' : 'eval-source-map'
}

var reduxSrc = path.join(__dirname, '..', '..', 'src')
var reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules')
var fs = require('fs')
if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
    // Resolve Redux to source
    module.exports.resolve = { alias: { 'redux': reduxSrc } }
    // Compile Redux from source
    module.exports.module.loaders.push({
        test: /\.js$/,
        loaders: ['babel'],
        include: reduxSrc
    })
}