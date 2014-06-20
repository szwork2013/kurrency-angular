var markdown = require('node-markdown').Markdown;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ngdocs');

  // Project configuration.
  grunt.util.linefeed = '\n';

  grunt.initConfig({
    ngversion: '1.2.18',
    modules: [],//to be filled in by build task
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    examples: 'examples',
    filename: 'kurrency-angular',
    meta: {
      banner: ['/*',
        ' * <%= pkg.name %>',
        ' * <%= pkg.homepage %>\n',
        ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
        ' * License: <%= pkg.license %>',
        ' */\n'].join('\n')
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>\n'
        },
        src: [], //src filled in by build task
        dest: '<%= dist %>/<%= filename %>.js'
      }
    },
    html2js: {
      dist: {
        options: {
          module: null, // no bundle module for all the html2js templates
          base: '.'
        },
        files: [{
          expand: true,
          src: ['template/**/*.html'],
          ext: '.html.js'
        }]
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        templateFile: 'misc/changelog.tpl.md',
        github: 'typefoo/kurrency-angular'
      }
    },
    ngdocs: {
      options: {
        dest: 'dist/docs',
        scripts: [
          'angular.js',
          '<%= concat.dist_tpls.dest %>'
        ],
        styles: [
          'docs/css/style.css'
        ],
        navTemplate: 'docs/nav.html',
        title: 'kurrency-angular',
        html5Mode: false
      },
      api: {
        src: ['src/**/*.js', 'src/**/*.ngdoc'],
        title: 'API Documentation'
      }
    },
    watch: {
      site: {
        files: [
          '<%= examples %>/*.html',
          'template/**/*.html',
          'src/**/*.js'
        ],
        tasks: ['html2js', 'build']
      },
      options: {
        livereload: 35729
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          middleware: function (connect) {
            return [
              mountFolder(connect, 'examples'),
              mountFolder(connect, '.')
            ];
          }
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['build']);

  grunt.registerTask('server', [
    'connect',
    'watch'
  ]);

  grunt.registerTask('dist', 'Override dist directory', function() {
    var dir = this.args[0];
    if (dir) { grunt.config('dist', dir); }
  });

  grunt.registerTask('build', 'Create kurrency build files', function() {
    var _ = grunt.util._;

    //If arguments define what modules to build, build those. Else, everything
    var modules = [];
    grunt.file.expand({
      filter: 'isDirectory', cwd: '.'
    }, 'src/*').forEach(function(dir) {
      console.log(dir);
      var name = dir.split('/')[1];
      modules.push(grunt.file.expand('src/'+name+'/*.js'));
    });

    console.log(modules);
    //Set the concat task to concatenate the given src modules
    grunt.config('concat.dist.src', grunt.config('concat.dist.src')
      .concat(modules));

    grunt.task.run(['concat']);
  });

  function setVersion(type, suffix) {
    var file = 'package.json';
    var VERSION_REGEX = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)(-\w+)*([\'|\"])/;
    var contents = grunt.file.read(file);
    var version;
    contents = contents.replace(VERSION_REGEX, function(match, left, center) {
      version = center;
      if (type) {
        version = require('semver').inc(version, type);
      }
      //semver.inc strips our suffix if it existed
      if (suffix) {
        version += '-' + suffix;
      }
      return left + version + '"';
    });
    grunt.log.ok('Version set to ' + version.cyan);
    grunt.file.write(file, contents);
    return version;
  }

  grunt.registerTask('version', 'Set version. If no arguments, it just takes off suffix', function() {
    setVersion(this.args[0], this.args[1]);
  });

  return grunt;
};
