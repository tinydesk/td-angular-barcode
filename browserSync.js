const browserSync = require('browser-sync');

browserSync({
  open: false,
  logLevel: "debug",
  logFileChanges: true,
  reloadDelay: 200,
  reloadDebounce: 500,
  files: ['examples/**/*', 'src/barcode.js'],
  watchOptions: {
    ignored: ['node_modules', 'bower_components', 'example/bower_components']
  },
  server: {
    baseDir: './',
    directory: true
  }
});