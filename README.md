# Gulp WCAG Accessibility

Uses [AccessSniff](https://github.com/yargalot/AccessSniff) and [HTML Codesniffer](https://github.com/squizlabs/HTML_CodeSniffer) to grade your site's accessibility using different levels of the WCAG guidelines.

## Getting Started
Install this gulp plugin next to your project's gulpfile with: `npm install gulp-wcag-accessibility --save-dev`

Then add this line to your project's gulpfile.js gulpfile:
```
var wcagAccess = require('gulp-wcag-accessibility');
```

## Documentation
Place this in your gulp file.
```
gulp.task('test', function() {
  return gulp.src('')
    .pipe(wcagAccess({
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
        urls: [
            'http://www.w3schools.com/',
            'http://www.tutorialspoint.com/'
        ]
    }))
});
```

## Report Generation
You can generate report in 4 formats:

- HTML
- JSON
- CSV
- TXT

Default is the HTML Report.

## Options
View [AccessSniff](https://github.com/yargalot/AccessSniff) options for all available options.

## Credits
Steven John Miller [http://www.stevenjohnmiller.com/](http://www.stevenjohnmiller.com/) : [https://github.com/yargalot/grunt-accessibility](https://github.com/yargalot/grunt-accessibility)

Squizlabs : [https://github.com/squizlabs/HTML_CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer)
