module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'geocens.js', 'geocens-chart.js', 'geocens-map.js', 'test/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'geocens.min.js': 'geocens.js',
          'geocens-chart.min.js': 'geocens-chart.js',
          'geocens-map.min.js': 'geocens-map.js'
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>', 'test/index.html'],
      tasks: ['jshint', 'qunit']
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Tasks
  grunt.registerTask('test', ['jshint', 'qunit']);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);

};
