"use strict";

module.exports = function(grunt){
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            debug:{
                files: 'client/main.js',
                tasks: ['browserify:debug']
            },
            release:{
                files: 'client/main.js',
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