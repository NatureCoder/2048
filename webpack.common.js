const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,           // images
                    use: [ 'file-loader' ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,    // fonts
                    use: [ 'file-loader' ]
                },
                {
                    test:/\.sass$/,
                    use: [{
                        loader: 'style-loader'  // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader',   // translates CSS into CommonJS
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',  // compiles Sass to CSS
                        options: {
                            sourceMap: true
                        }
                    }]
                }
            ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ],
};
