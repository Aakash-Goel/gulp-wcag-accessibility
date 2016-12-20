'use strict';

var gulp = require('gulp');
var gulpWcagAccess = require('./index.js');

// default task
gulp.task('default', function() {
	console.log('gulp is working');
});

// gulp-wcag-accessibility task to generate reports
gulp.task('wcag', function() {
	return gulp.src([''])
		.pipe(gulpWcagAccess({
			accessibilityLevel: 'WCAG2AA',
			maxBuffer: '1024*1024',
			force: true,
			verbose: false,
			reportLevels: {
				notice: false,
				warning: false,
				error: true
			},
			forceUrls: true,
			urls: ['http://www.w3schools.com/',
                  'http://www.tutorialspoint.com/'
              ]
		}))
});
