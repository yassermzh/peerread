
module.exports = function(grunt) {

    // Project configuration.
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	buildDir: '../build',
	herokuURL: 'git@heroku.com:peerread.git',
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
        },
	copy: {
	    options:{
//		processContentExclude: ['**~']
	    },
	    build: {
		files: [
		    // includes files within path
		    {
			expand: true, 
 			src: ['app.js', 'package.json', 'Procfile', 'app/**/*', 'public/**/*', '!**/*~' ,'!app/lab/**/*', '!public/lab/**/*'], 
			dest: '<%= buildDir %>/', 
			filter: 'isFile'
		    },
		]
	    },

	    
	},
	clean: {
	    build: [
		'build'
	    ]
	},
	shell:{
	    options: {
		stdout: true
            },
	    'build-git-init':{
		command: 'cd <%= buildDir %> && git init  '
	    },
	    'build-git-add':{
		command: 'cd <%= buildDir %> && git add . '
	    },
	    'build-git-commit':{
		command: 'cd <%= buildDir %> && git commit -m "build"'
	    },
	    'build-git-heroku-add':{
		command: 'cd <%= buildDir %> && git remote add heroku <%= herokuURL %> '
	    },
	    'build-git-heroku-push':{
		command: 'cd <%= buildDir %> && git push heroku master'
	    }
	}
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);

    grunt.registerTask('build',[
	'clean:build', 
	'copy:build', 
	'shell:build-git-init', 'shell:build-git-add', 'shell:build-git-commit'
    ]);
    grunt.registerTask('deploy',['build', 'shell:build-git-heroku-push']);
    

};


