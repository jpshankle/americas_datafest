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
                    '../client/bower_components/d3/d3.min.js',
                    '../client/bower_components/angular/angular.min.js',
                    '../client/bower_components/angular-route/angular-route.min.js',
                    '../client/bower_components/angular-resource/angular-resource.min.js'
                ],
                dest: '../client/dist/libs.js'
            },
            main: {
                src: [
                    '../client/src/main.js',
                    '../client/src/directives/**/*.js',
                    '../client/src/map/**/*.js',
                    '../client/src/contact/**/*.js'
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
                    '**'
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