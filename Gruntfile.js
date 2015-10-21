/* global module */
module.exports = function (grunt) {
  module.require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      'options': {
        jshintrc: '.jshintrc'
      },
      default: {
        'src': [ '*.js', 'test/*.js' ]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    'clean-console': {
      all: {
        options: {
          url: 'test/index.html'
        }
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js'],
        tasks: ['jshint', 'test']
      }
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'jshint', 'test']);
};
