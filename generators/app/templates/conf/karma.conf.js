<% if (modules === 'webpack' || modules === 'systemjs' || client === 'angular1') { -%>
const conf = require('./gulp.conf');
<% } -%>
<% if (modules === 'bower') { -%>
const listFiles = require('./karma-files.conf');
<% } -%>

module.exports = function (config) {
  const configuration = <%- json(karmaConf, 2) %>;

  config.set(configuration);
};
