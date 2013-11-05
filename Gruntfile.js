
module.exports = function(grunt) {

    // Project configuration.
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files:[
                    {src: ['sync02.js'], dest: 'build/sync.min.js'}
                ]
            }
        },
        
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['sample01.js', 'sample02.js'],
                dest: 'build/main.js',
          },
        },

        jshint: {
            options: {
                globals: {
                    jQuery: true,
//                    console: true,
//                    require: true,
//                    __dirname: true,
                },
            },
            all: ['Gruntfile.js', 'sync02.js', 'app.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};


