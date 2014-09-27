module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      select:
        options:
          style: 'expanded'
          bundleExec: true
        files:
          'lib/select.css': 'src/select.scss'

    coffee:
      select:
        files:
          'lib/select.js': 'src/select.coffee'
      spec:
        files:
          'spec/select-spec.js': 'spec/select-spec.coffee'

    watch:
      styles:
        files: ['src/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee']
      jasmine:
        files: [
          'lib/select.css',
          'lib/select.js',
          'specs/*.js'
        ],
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/select.js']
        options:
          outfile: 'spec/index.html'
          styles: [
            'lib/select.css',
            'vendor/bower/fontawesome/css/font-awesome.min.css'
          ]
          specs: 'spec/select-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js',
            'vendor/bower/jquery-mousewheel/jquery.mousewheel.min.js',
            'vendor/bower/simple-module/lib/module.js',
            'vendor/bower/simple-util/lib/util.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['coffee', 'jasmine:test:build', 'watch']
