module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      select:
        options:
          bundleExec: true
          style: 'expanded'
          sourcemap: 'none'
        files:
          'styles/select.css': 'styles/select.scss'

    coffee:
      src:
        options:
          bare: true
        files:
          'lib/select.js': 'src/select.coffee'
      spec:
        files:
          'spec/select-spec.js': 'spec/select-spec.coffee'

    umd:
      all:
        src: 'lib/select.js'
        template: 'umd.hbs'
        amdModuleId: 'simple-select'
        objectToExport: 'select'
        globalAlias: 'select'
        deps:
          'default': ['$', 'SimpleModule', 'simpleUtil']
          amd: ['jquery', 'simple-module', 'simple-util']
          cjs: ['jquery', 'simple-module', 'simple-util']
          global:
            items: ['jQuery', 'SimpleModule', 'simple.util']
            prefix: ''

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      spec:
        files: ['spec/**/*.coffee']
        tasks: ['coffee:spec']
      src:
        files: ['src/**/*.coffee']
        tasks: ['coffee:src', 'umd']
      jasmine:
        files: ['lib/**/*.js', 'specs/**/*.js']
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/**/*.js']
        options:
          outfile: 'spec/index.html'
          styles: 'styles/select.css'
          specs: 'spec/select-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/jquery-mousewheel/jquery.mousewheel.min.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/simple-util/lib/util.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['sass', 'coffee', 'umd', 'jasmine:test:build', 'watch']
