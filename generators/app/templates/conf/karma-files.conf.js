const conf = require('./gulp.conf');
const wiredep = require('wiredep');

module.exports = function listFiles() {
  const wiredepOptions = Object.assign({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  const patterns = wiredep(wiredepOptions).js.concat([
<% if (client === 'angular1') { -%>
    conf.path.tmp('**/*.js'),
    conf.path.client('**/*.html')
<% } -%>
  ]);

  const files = patterns.map(pattern => ({pattern}));
  files.push({
    pattern: conf.path.client('assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
};
