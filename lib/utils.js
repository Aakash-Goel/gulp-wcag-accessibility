/**
 * gulp-wcag-accessibility helper file
 * ------------------------
 * @summary		helper methods required for the plugin
 *
 * @author		Aakash Goel
 * @link		https://github.com/Aakash-Goel/gulp-wcag-accessibility
 *
 * copyright (c) 2016 Aakash Goel
 */

'use strict';

const Utils = () => {
    let utils = {};

    utils.newDateObj = function() {
        const newDateObj = new Date();
        let newDate = {
			getDate: (newDateObj.getMonth() + 1) + "-" + newDateObj.getDate() + "-" + newDateObj.getFullYear(),
			getTime: newDateObj.toTimeString(),
			getSimplifyTime: newDateObj.toTimeString().substr(0, newDateObj.toTimeString().lastIndexOf(":")).replace(/:/g, "_"),
		}

        return newDate;
    }

    return utils;
}

module.exports = Utils();
