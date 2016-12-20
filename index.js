/**
 * Gulp WCAG Accessibility
 * ------------------------
 * This plugin helps to grade your site's accessibility
 * and generate a report from different WCAG levels.
 *
 * @summary		Glup Plugin to check web accessibility as per the WCAG Standards
 *
 * @author		Aakash Goel
 * @link		https://github.com/Aakash-Goel/gulp-wcag-accessibility
 *
 * copyright (c) 2016 Aakash Goel
 */

'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const accessSniff = require('access-sniff');

const HtmlReportsGenerator = require('./lib/htmlReportsGenerator');

const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-wcag-accessibility';

// default options
const defaultOptions = {
	reportType: 'html',
	reportFileName: 'report',
	reportLocation: 'reports/html',
	errorTemplate: __dirname + "/template/error-report.html",
	forceUrls: false,
	urls: null,
	browser: false
};

/**
 * Main method. Optional overrides may also be passed to this function.
 *
 * @function		gulpWcagAccessibilityPlugin
 *
 * @param {object} 	options Optional. View AccessSniff (https://github.com/yargalot/AccessSniff) plugin options for all available options.
 *
 * @return {stream} if generate reports for files
 * @return {null}	if generate reports for urls
 */
const gulpWcagAccessibilityPlugin = (options = {}) => {
	let fileArr = [];
	let tempReportType = '';
	let gulpOptions = options;

	gulpOptions.reportType = gulpOptions.reportType || defaultOptions.reportType;
	gulpOptions.reportFileName = gulpOptions.reportFileName || defaultOptions.reportFileName;
	gulpOptions.reportLocation = gulpOptions.reportLocation || defaultOptions.reportLocation;
	gulpOptions.errorTemplate = gulpOptions.errorTemplate || defaultOptions.errorTemplate;
	gulpOptions.forceUrls = (typeof gulpOptions.forceUrls === 'boolean') ? gulpOptions.forceUrls : defaultOptions.forceUrls;
	gulpOptions.urls = gulpOptions.urls && gulpOptions.urls.length > 0 ? gulpOptions.urls : defaultOptions.urls;
	gulpOptions.browser = gulpOptions.urls ? true : (typeof gulpOptions.browser === 'boolean') ? gulpOptions.browser : defaultOptions.browser;

	if (gulpOptions.reportType.toLowerCase() === 'html') {
		tempReportType = gulpOptions.reportType.toLowerCase();
		gulpOptions.reportType = 'json';
	}

	// through2 is a thin wrapper around node transform streams
	let stream = through.obj(function(file, enc, callback) {
		// if no file, check for urls
		if (file.isNull()) {
			// urls present and forceUrls set to true, then generate report
			if (gulpOptions.urls && gulpOptions.forceUrls) {
				generateAccessibilityReport(gulpOptions.urls, file, callback);
			}
			// urls present but forceUrls option is false, then throw an error
			else if (gulpOptions.urls && !gulpOptions.forceUrls){
				throw new PluginError(PLUGIN_NAME, 'Please set \'forceUrls\' option to \'true\' ');
			}
			// if no file and no urls, then throw an error
			else {
				throw new PluginError(PLUGIN_NAME, 'No urls are specified ');
			}
		}

		// if stream, throw an error
		if (file.isStream()) {
			throw new PluginError(PLUGIN_NAME, 'Cannot read streams');
		}

		if (file.isBuffer()) {
			// if urls are present and forceUrls option is true, then generate access report for urls
			if (gulpOptions.urls && gulpOptions.forceUrls) {
				generateAccessibilityReport(gulpOptions.urls, file, callback);
			}
			// if urls are not present and forceUrls option is true, then throw an error to let user know what to do
			else if (!gulpOptions.urls && gulpOptions.forceUrls) {
				throw new PluginError(PLUGIN_NAME, 'Please remove \'forceUrls\' option or set to \'false\' ');
			}
			// if no urls and forceUrls option is false, then run through each file buffer and generate report for files
			else {
				let filePath = file.path.replace(file.cwd+'/', '')
				fileArr.push(filePath);

				generateAccessibilityReport(fileArr, file, callback);
			}
		}

	});

	/**
	 * Using AccessSniff generates report.
	 *
	 * @function		generateAccessibilityReport
	 *
	 * @param {array} 	arrFilePaths. Array of files for which reports to be generated.
	 * @param {stream} 	file. file stream.
	 * @param {array} 	callback. callback function from through object.
	 *
	 * @return {stream} if generate reports for files
	 * @return {null}	if generate reports for urls
	 */
	function generateAccessibilityReport(arrFilePaths, file, callback) {
		accessSniff
			.default(arrFilePaths, gulpOptions)
			.then(function(report) {
				accessSniff.report(report, {
					fileName: gulpOptions.reportFileName,
					location: gulpOptions.reportLocation,
					reportType: gulpOptions.reportType
				});

				gutil.log(gutil.colors.magenta('Generated Report at : '), gulpOptions.reportLocation);

				return report;
			})
			.then(function(report) {
				generateHtmls(report);

				let cb = gulpOptions.forceUrls ? null : file.isNull() ? callback() : callback(null, file);

				return cb
			})
			.catch(function(error) {
				let err = new Error(error);

				return callback(err, file);;
			});
	}

	/**
	 * generate html file from report, if reportType is 'html'
	 *
	 * @function		generateHtmls
	 *
	 * @param {object} 	accessReport. Report object generated from AccessSniff.
	 */
	function generateHtmls(accessReport) {
		if (tempReportType === 'html') {
			new HtmlReportsGenerator(gulpOptions, accessReport);
		}
	}

	return stream;
}

// Exporting the plugin main function
module.exports = gulpWcagAccessibilityPlugin;
