/**
 * @file fis3-parser-webpack
 *
 * A parser for fis to compile webpack module.
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.5
 * @date 2016-06-29
 */
var webpack = require('webpack');
var deasync = require('deasync');
var ProxyFileSystem = require('proxy-fs');
var MemoryFileSystem = require('memory-fs');
var path = require('path');
var url = require('url');
module.exports = function (content, file, conf) {
  var compress = deasync(function (content, callback) {
    var outputFileName = '/output.out';
    var originname = path.resolve(file.origin);
    var options = {
      entry: originname,
      output: {
        filename: outputFileName,
      },
      path: file.dirname,
      resolve: conf.resolve,
      plugins: conf.plugins,
      module: conf.module,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: true,
      version: true,
      cached: false,
      cachedAssets: false,
      reasons: false,
      source: false,
      errorDetails: false
    };
    Object.keys(conf).forEach(function (key) {
      if (typeof options[key] === 'undefined') {
        options[key] = conf[key];
      }
    });
    var compiler = webpack(options);
    var mfs = new MemoryFileSystem({});
    mfs.mkdirpSync(path.dirname(originname));
    mfs.writeFileSync(originname, content);
    compiler.inputFileSystem = new ProxyFileSystem(function (filename) {
      if (path.resolve(file.origin) === path.resolve(filename)) {
        return {
          fileSystem: mfs,
          path: originname
        };
      } else {
        file.cache.addDeps(filename); // 添加编译依赖
      }
    }, compiler.inputFileSystem);
    var outfs = compiler.outputFileSystem = new ProxyFileSystem(function (filename) {
      if (path.resolve(outputFileName) === path.resolve(filename)) {
        return {
          fileSystem: mfs,
          path: outputFileName
        };
      }
    }, compiler.outputFileSystem);
    compiler.run(function (err, stats) {
      if (err) {
        callback(err);
        return;
      }
      var jsonStats = stats.toJson() || {};
      var errors = jsonStats.errors || [];
      if (err || errors.length > 0) {
        callback(err || errors.join('\n'));
      } else {
        callback(null, String(outfs.readFileSync(outputFileName)));
      }
    });
  });
  return compress(content);
};
