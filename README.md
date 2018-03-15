fis3-parser-webpack
-----

A parser for fis to compile webpack module.

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

## 使用示例

```js
fis.match('xx.js', {
    parser: fis.plugin('webpack', {
        module: {
            rules: [{
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }]
        },
        // ...options
        // 请参考 https://webpack.js.org/configuration/#options
    })
})
```

或者

```js
fis.match('xx.js', {
    parser: fis.plugin('webpack', {
        getOptions: function(webpack) {
            return {
                module: {
                    rules: [{
                        test: /\.css$/,
                        use: [ 'style-loader', 'css-loader' ]
                    }]
                },
                plugins: [
                    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
                    new webpack.IgnorePlugin(
                        /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
                        /vs\/language\/typescript\/lib/
                    )
                ]
            }
        }
    })
})
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/fis3-parser-webpack
[npm-image]: https://badge.fury.io/js/fis3-parser-webpack.svg
[travis-url]: https://travis-ci.org/zswang/fis3-parser-webpack
[travis-image]: https://travis-ci.org/zswang/fis3-parser-webpack.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/fis3-parser-webpack?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/fis3-parser-webpack/badge.svg?branch=master&service=github
