/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
 <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
 <% var now = new Date() %>
 * @date <%- [
 now.getFullYear(),
 now.getMonth() + 101,
 now.getDate() + 100
 ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

/*<remove>*/
/*jslint node: true */
'use strict';
/*</remove>*/

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

    if (typeof conf.getOptions === 'function') {
      conf = conf.getOptions(webpack);
    }

    var options = {
      entry: originname,
      output: {
        path: '/',
        filename: outputFileName.substring(1),
      },
      // path: file.dirname,  // unknown property
      module: conf.module,
      resolve: conf.resolve,
      performance: conf.performance,
      module: conf.module,
      target: conf.target,
      externals: conf.externals,
      plugins: conf.plugins,
      
      // hash: false, // unknown property
      // timings: false, // unknown property
      // chunks: false, // unknown property
      // chunkModules: false, // unknown property
      // modules: false, // unknown property
      // children: true, // unknown property
      // version: true, // unknown property
      // cached: false, // unknown property
      // cachedAssets: false, // unknown property
      // reasons: false, // unknown property
      // source: false, // unknown property
      // errorDetails: false // unknown property
    };
    
    // 新版本不识别的字段会报错，所以不能自由添加了。
    // Object.keys(conf).forEach(function (key) {
    //   if (typeof options[key] === 'undefined') {
    //     options[key] = conf[key];
    //   }
    // });
    
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
