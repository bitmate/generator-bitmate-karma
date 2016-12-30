const _ = require('lodash');
const bitmate = require('bitmate-generator');
const conf = require('./conf');

module.exports = bitmate.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'karma': '^1.3.0',
          'karma-coverage': '^1.1.1',
          'karma-jasmine': '^1.0.2',
          'karma-junit-reporter': '^1.1.0',
          'jasmine': '^2.4.1',
          'es6-shim': '^0.35.0',
          'karma-chrome-launcher': '^0.2.3',
          'karma-phantomjs-launcher': '^1.0.0',
          'karma-phantomjs-shim': '^1.1.2',
          'phantomjs-prebuilt': '^2.1.6',
          'wiredep': '^4.0.0'
        }
      };

      if (this.options.client === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'angular-mocks': '^1.5.0-beta.2',
            'gulp-ng-annotate': '^1.1.0',
            'karma-ng-html2js-preprocessor': '^0.2.0'
          },
          eslintConfig: {
            globals: {
              expect: true
            }
          }
        });

        if (this.options.modules === 'bower') {
          _.merge(pkg, {
            devDependencies: {
              'karma-angular-filesort': '^1.0.0'
            }
          });
        }
      }

      this.mergeJson('package.json', pkg);
    },

    conf() {
      const options = Object.assign({}, {singleRun: true}, this.options);
      options.karmaConf = conf(options);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma.conf.js', options);

      options.singleRun = false;
      options.karmaConf = conf(options);

      this.copyTemplate('conf/karma.conf.js', 'conf/karma-auto.conf.js', options);

      if (this.options.modules === 'bower') {
        this.copyTemplate('conf/karma-files.conf.js', 'conf/karma-files.conf.js');
      }
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        {modules: this.options.modules}
      );
    }
  }
});
