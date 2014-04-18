"use strict";

module.exports = function(grunt){
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            debug:{
                files: ['client/*.js','client/components/*.js','client/systems/*.js'],
                tasks: ['browserify:debug']
            },
            release:{
                files: 'client/**/*.js',
                tasks: ['browserify:release']
            }
        },
        browserify: {
            debug: {
               files: {
                   'client/build/game-debug.js': ['client/main.js']
               },
               options:{
                   debug:true
               }
            },
            release: {
               files: {
                   'client/build/game.js': ['client/main.js']
               },
               options:{
                   debug:false
               }
            }
        }
    });
}