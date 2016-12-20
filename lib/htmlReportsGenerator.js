/**
 * gulp-wcag-accessibility html report generator file
 * ------------------------
 * @summary		generate html files from AccessSniff reports.
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
const handlebars = require('handlebars');
const mkdirp = require('mkdirp');

const dateObj = require('./utils.js').newDateObj();
const getDirName = path.dirname;

const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-wcag-accessibility';

/**
 * HTML file generator from AccessSniff reports.
 *
 * @class			HTMLReportsGenerator
 *
 * @param {object} 	options. View AccessSniff (https://github.com/yargalot/AccessSniff) plugin options for all available options.
 * @param {object} 	accessibilityReport. Report object generated from AccessSniff.
 */
class HTMLReportsGenerator {
	constructor(options, accessibilityReport) {
		this.report = accessibilityReport;
		this.options = options;

		this.errorTemplateSource = fs.readFileSync(this.options.errorTemplate, 'utf8');
		this.template = handlebars.compile(this.errorTemplateSource);

		this.generateReport()
	}

	generateReport() {
		if (this.report) {
			for (let k in this.report) {
				const writableContent = this.renderToString(k);
				this.writeFile(k, writableContent);
			}
		}
		else {
			throw new PluginError(PLUGIN_NAME, 'Report file doesn\'t exist');
		}
	}

	renderToString(str) {
		const templateContext = {
			reportName: str,
			date: dateObj.getDate,
			time: dateObj.getTime,
			level: this.options.accessibilityLevel,
			data: this.report[str].messageLog
		}

		let outputString = this.template(templateContext);

		return outputString;
	}

	writeFile(str, writableContent) {
		const fileName = str.replace(/[,<>=?|*:./"%]/g, '_');
		const folderName = 'WCAG_Errors_' + dateObj.getDate + '_' + dateObj.getSimplifyTime;
		const filePath = this.options.reportLocation + "/" + folderName + "/" + fileName + "_accessibility_report.html";

		mkdirp.sync(getDirName(filePath));

		fs.writeFileSync(filePath, writableContent);
	}
}

module.exports = HTMLReportsGenerator;
