const test = require('ava');
const _ = require('lodash');
const karmaConf = require('../../generators/app/conf');

function base(options) {
  return {
    basePath: '../',
    singleRun: options.singleRun,
    autoWatch: !options.singleRun,
    logLevel: 'INFO',
    junitReporter: {outputDir: 'test-reports'},
    plugins: [
      `lit>>require('karma-jasmine')<<lit`,
      `lit>>require('karma-junit-reporter')<<lit`,
      `lit>>require('karma-coverage')<<lit`
    ]
  };
}

test.before(() => {
  process.chdir('../../');
});

test.afterEach(() => {
  delete process.env.TRAVIS;
});

function merge(args) {
  const result = {};
  _.mergeWith(result, ...args, (x, y) => {
    if (_.isArray(x)) {
      return _.uniq(x.concat(y));
    }
  });
  return result;
}

test('karmaConf with angular1/bower', t => {
  const options = {client: 'angular1', modules: 'bower', singleRun: true};
  const expected = merge([{}, base(options), {
    browsers: ['PhantomJS'],
    files: `lit>>listFiles()<<lit`,
    preprocessors: {
      [`lit>>conf.path.client('**/*.html')<<lit`]: ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: `lit>>\`\${conf.paths.client}/\`<<lit`,
      moduleName: 'app'
    },
    angularFilesort: {
      whitelist: [`lit>>conf.path.tmp('**/!(*.html|*.spec|*.mock).js')<<lit`]
    },
    frameworks: ['phantomjs-shim', 'jasmine', 'angular-filesort'],
    plugins: [
      `lit>>require('karma-phantomjs-launcher')<<lit`,
      `lit>>require('karma-phantomjs-shim')<<lit`,
      `lit>>require('karma-ng-html2js-preprocessor')<<lit`,
      `lit>>require('karma-angular-filesort')<<lit`
    ]
  }]);
  const result = karmaConf(options);
  t.deepEqual(result, expected);
});

test('karmaConf with angular1/systemjs/typescript', t => {
  const options = {client: 'angular1', modules: 'systemjs', js: 'typescript', singleRun: true};
  const expected = merge([{}, base(options), {
    browsers: ['PhantomJS'],
    frameworks: ['jasmine', 'es6-shim'],
    preprocessors: {
      [`lit>>conf.path.client('**/*.html')<<lit`]: ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {},
    plugins: [
      `lit>>require('karma-jasmine')<<lit`,
      `lit>>require('karma-junit-reporter')<<lit`,
      `lit>>require('karma-coverage')<<lit`,
      `lit>>require('karma-phantomjs-launcher')<<lit`,
      `lit>>require('karma-phantomjs-shim')<<lit`,
      `lit>>require('karma-ng-html2js-preprocessor')<<lit`,
      `lit>>require('karma-jspm')<<lit`,
      `lit>>require('karma-generic-preprocessor')<<lit`,
      `lit>>require('karma-es6-shim')<<lit`
    ]
  }]);
  const result = karmaConf(options);
  t.deepEqual(result, expected);
});

test('karmaConf with angular1/webpack/babel', t => {
  const options = {client: 'angular1', modules: 'webpack', js: 'babel', singleRun: true};
  const expected = merge([{}, base(options), {
    browsers: ['PhantomJS'],
    files: [
      'node_modules/es6-shim/es6-shim.js',
      `lit>>conf.path.client('index.spec.js')<<lit`
    ],
    frameworks: ['jasmine'],
    preprocessors: {
      [`lit>>conf.path.client('index.spec.js')<<lit`]: ['webpack'],
      [`lit>>conf.path.client('**/*.html')<<lit`]: ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: `lit>>\`\${conf.paths.client}/\`<<lit`
    },
    reporters: `lit>>['progress', 'coverage']<<lit`,
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    webpack: `lit>>require('./webpack-test.conf')<<lit`,
    webpackMiddleware: {noInfo: true},
    plugins: [
      `lit>>require('karma-jasmine')<<lit`,
      `lit>>require('karma-junit-reporter')<<lit`,
      `lit>>require('karma-coverage')<<lit`,
      `lit>>require('karma-phantomjs-launcher')<<lit`,
      `lit>>require('karma-phantomjs-shim')<<lit`,
      `lit>>require('karma-ng-html2js-preprocessor')<<lit`,
      `lit>>require('karma-webpack')<<lit`
    ]
  }]);
  const result = karmaConf(options);
  t.deepEqual(result, expected);
});

test('karmaConf with angular2/systemjs/babel', t => {
  const options = {client: 'angular2', modules: 'systemjs', js: 'babel', singleRun: true};
  const expected = merge([{}, base(options), {
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    plugins: [`lit>>require('karma-chrome-launcher')<<lit`, `lit>>require('karma-jspm')<<lit`]
  }]);
  const result = karmaConf(options);
  t.deepEqual(result, expected);
});

test('karmaConf with react/webpack/babel', t => {
  const options = {client: 'react', modules: 'webpack', js: 'babel', singleRun: true};
  const expected = merge([{}, base(options), {
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'node_modules/es6-shim/es6-shim.js',
      `lit>>conf.path.client('index.spec.js')<<lit`
    ],
    preprocessors: {
      [`lit>>conf.path.client('index.spec.js')<<lit`]: ['webpack']
    },
    reporters: `lit>>['progress', 'coverage']<<lit`,
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    webpack: `lit>>require('./webpack-test.conf')<<lit`,
    webpackMiddleware: {noInfo: true},
    plugins: [
      `lit>>require('karma-jasmine')<<lit`,
      `lit>>require('karma-junit-reporter')<<lit`,
      `lit>>require('karma-coverage')<<lit`,
      `lit>>require('karma-phantomjs-launcher')<<lit`,
      `lit>>require('karma-phantomjs-shim')<<lit`,
      `lit>>require('karma-webpack')<<lit`
    ]
  }]);
  const result = karmaConf(options);
  t.deepEqual(result, expected);
});
