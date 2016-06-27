fis
  .set('project.files', [ // 处理的文件类型
    '**.{js,ts,html}'
  ])
  .set('project.ignore', [ // 忽略的文件
    'package.json',
    'node_modules/**',

    'bower.json',
    'bower_components/**',

    'inc/**',

    '**/_*.*',
    'output/**',   //不使用用

    'fis-conf.js',
    'sftp-config.json'
  ])
  .set('project.ext', {
    less: 'css',
    sass: 'css'
  });

fis
  .match("entry.js", {
    useHash: true,
    parser: [fis.plugin('jdists'), fis.plugin(require('../'), {
      resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
      },
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'ts-loader' }
        ]
      },
    })]
  });
