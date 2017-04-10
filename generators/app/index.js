/* eslint quote-props: 0 */  // --> OFF

const _ = require('lodash');
const bitmate = require('@oligibson/bitmate-generator');
const conf = require('./conf');

module.exports = bitmate.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'karma': '1.6.0',
          'karma-coverage': '1.1.1',
          'karma-jasmine': '1.1.0',
          'karma-junit-reporter': '1.2.0',
          'jasmine': '2.5.3',
          'es6-shim': '0.35.3'
        }
      };

      if (this.options.client === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'angular-mocks': '1.6.2',
            'gulp-ng-annotate': '2.0.0',
            'karma-angular-filesort': '1.0.2',
            'karma-ng-html2js-preprocessor': '1.0.0'
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
              'karma-angular-filesort': '1.0.2'
            }
          });
        }
      }

      if (this.options.client !== 'angular2' && this.options.js === 'typescript') {
        _.merge(pkg, {
          devDependencies: {
            'karma-es6-shim': '^1.0.0'
          }
        });
      }

      if (this.options.client === 'angular2') {
        _.merge(pkg, {
          devDependencies: {
            'karma-chrome-launcher': '2.0.0'
          }
        });

        if (this.options.modules === 'systemjs') {
          _.merge(pkg, {
            devDependencies: {
              glob: '^7.1.1'
            }
          });
        }
      } else {
        _.merge(pkg, {
          devDependencies: {
            'karma-phantomjs-launcher': '1.0.4',
            'karma-phantomjs-shim': '1.4.0',
            'phantomjs-prebuilt': '2.1.14'
          }
        });
      }

      if (this.options.modules === 'webpack') {
        _.merge(pkg, {
          devDependencies: {
            'karma-webpack': '2.0.3'
          }
        });
      }

      if (this.options.js === 'babel') {
        _.merge(pkg, {
          devDependencies: {
            'babel-plugin-istanbul': '4.1.1'
          }
        });
      }

      if (this.options.modules === 'systemjs') {
        _.merge(pkg, {
          devDependencies: {
            'karma-jspm': '^2.2.1'
          }
        });

        if (this.options.client === 'angular1' && this.options.js === 'typescript') {
          _.merge(pkg, {
            devDependencies: {
              'karma-generic-preprocessor': '^1.1.0'
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
    },

    client() {
      if (this.options.modules === 'webpack') {
        this.fs.copyTpl(
          this.templatePath('client/index.spec.js'),
          this.destinationPath('client/index.spec.js'),
          {client: this.options.client, js: this.options.js}
        );
      }
    }
  }

});
