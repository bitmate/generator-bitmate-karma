'use strict';

const lit = require('bitmate-generator').lit;

module.exports = function karmaConf(options) {
  const conf = {
    basePath: '../',
    singleRun: options.singleRun,
    autoWatch: !options.singleRun,
    logLevel: 'INFO',
    junitReporter: {outputDir: 'test-reports'}
  };

  conf.browsers = ['PhantomJS'];

  const pathSrcHtml = lit`conf.path.client('**/*.html')`;

  if (options.modules === 'bower' && options.client === 'angular1') {
    conf.frameworks = ['phantomjs-shim', 'jasmine', 'angular-filesort'];
  } else {
    conf.frameworks = ['jasmine'];
  }

  if (options.client !== 'angular2' && options.js === 'typescript') {
    conf.frameworks.push('es6-shim');
  }

  if (options.modules === 'bower') {
    conf.files = lit`listFiles()`;
  }

  if (options.modules === 'webpack' || options.client === 'angular1') {
    conf.preprocessors = {};
  }

  if (options.client === 'angular1') {
    conf.preprocessors[pathSrcHtml] = ['ng-html2js'];
  }

  if (options.client === 'angular1') {
    conf.ngHtml2JsPreprocessor = {};

    if (options.modules !== 'systemjs') {
      conf.ngHtml2JsPreprocessor.stripPrefix = lit`\`\${conf.paths.client}/\``;
    }

    if (options.modules === 'bower') {
      conf.ngHtml2JsPreprocessor.moduleName = 'app';
      conf.angularFilesort = {
        whitelist: [lit`conf.path.tmp('**/!(*.html|*.spec|*.mock).js')`]
      };
    }
  }

  conf.plugins = [
    lit`require('karma-jasmine')`,
    lit`require('karma-junit-reporter')`,
    lit`require('karma-coverage')`
  ];

  conf.plugins.push(lit`require('karma-phantomjs-launcher')`);
  conf.plugins.push(lit`require('karma-phantomjs-shim')`);

  if (options.client === 'angular1') {
    conf.plugins.push(lit`require('karma-ng-html2js-preprocessor')`);
  }
  if (options.modules === 'bower' && options.client === 'angular1') {
    conf.plugins.push(lit`require('karma-angular-filesort')`);
  }

  return conf;
};
