module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    '../client/bower_components/jquery/jquery.min.js',
                    '../client/bower_components/d3/d3.js',
                    '../client/bower_components/queue-async/queue.min.js',
                    '../client/bower_components/topojson/topojson.js',
                    '../client/bower_components/typeahead.js/dist/dataset.js',
                    '../client/bower_components/typeahead.js/dist/typeahead.js',
                    '../client/bower_components/rickshaw/rickshaw.min.js',
                    '../client/bower_components/angular/angular.min.js',
                    '../client/bower_components/angular-route/angular-route.min.js',
                    '../client/bower_components/angular-resource/angular-resource.min.js',
                    '../client/bower_components/angular-animate/angular-animate.min.js',
                    '../client/bower_components/bootstrap/js/affix.js',
                    '../client/bower_components/bootstrap/js/alert.js',
                    '../client/bower_components/bootstrap/js/button.js',
                    '../client/bower_components/bootstrap/js/carousel.js',
                    '../client/bower_components/bootstrap/js/collapse.js',
                    '../client/bower_components/bootstrap/js/dropdown.js',
                    '../client/bower_components/bootstrap/js/model.js',
                    '../client/bower_components/bootstrap/js/tooltip.js',
                    '../client/bower_components/bootstrap/js/popover.js',
                    '../client/bower_components/bootstrap/js/scrollspy.js',
                    '../client/bower_components/bootstrap/js/tab.js',
                    '../client/bower_components/bootstrap/js/transition.js'
                ],
                dest: '../client/dist/libs.js'
            },
            main: {
                src: [
                    '../client/src/main.js',
                    '../client/src/directives/**/*.js',
                    '../client/src/dashboard/**/*.js',
                    '../client/src/map/**/*.js'
                ],
                dest: '../client/dist/main.js'
            }
        },
        less: {
            main: {
                src: [
                    '../client/src/main.less'
                ],
                dest: '../client/dist/main.css'
            }
             
        },
        copy: {
            index: {
                cwd: '../client/src/',
                expand: true,
                src: [
                    '**/*.html',
                    '**/*.png',
                    '*.json',
                    '*.tsv',
                    '*.csv',
                    '**/*.kml',
                    '**/*.eot',
                    '**/*.svg',
                    '**/*.ttf',
                    '**/*.woff'
                ],
                dest: '../client/dist/'
            },
            rickshaw: {
                cwd: '../client/bower_components/rickshaw',
                expand: true,
                src: [
                    'rickshaw.min.css'
                ],
                dest: '../client/dist/'
            },
            bootstrap: {
              cwd: '../client/bower_components/bootstrap/',
              expand: true,
              src: [
                'fonts/*'
              ],
              dest: '../client/dist/'
            }
        },
        watch: {
            srcfiles: {
                files: '../client/src/**/*',
                tasks: [
                    'default'
                ],
                options: {
                    atBegin: true,
                    spawn: false
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['copy','concat','less']);
};