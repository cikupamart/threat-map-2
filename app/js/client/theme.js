/**
 * Client side application theme.
 * @param {Object} config
 * @constructor
 */
function Theme(config) {

    this.config = config;
}


/**
 * Get current config.
 * Current config determined by currentTheme option.
 * @returns
 */
Theme.prototype.getCurrentConfig = function() {

    return this.config.themes[this.config.currentTheme];
}


/**
 * Get default config.
 * Default config determined by name "threat".
 * @returns
 */
Theme.prototype.getDefaultConfig = function() {

    return this.config.themes.threat;
}


/**
 * Check option in current config.
 * @param {String} option
 * @returns {Boolean}
 */
Theme.prototype.hasCurrent = function(option) {

    return option in this.getCurrentConfig();
}


/**
 * Get option from current config.
 * @param {String} option
 * @param {Object} defaults
 * @returns
 */
Theme.prototype.getCurrent = function(option, defaults) {

    if (this.hasCurrent(option)) {
        return this.getCurrentConfig()[option];
    } else {
        return defaults;
    }
}


/**
 * Check option in default config.
 * @param {String} option
 * @returns {Boolean}
 */
Theme.prototype.hasDefault = function(option) {

    var config = this.getDefaultConfig();
    return option in config;
}


/**
 * Get option from default config.
 * @param {String} option
 * @param {Object} defaults
 * @returns
 */
Theme.prototype.getDefault = function(option, defaults) {

    if (this.hasDefault(option)) {
        return this.getDefaultConfig()[option];
    } else {
        return defaults;
    }
}


/**
 * Check option in custom config.
 * @param {String} option
 * @returns {Boolean}
 */
Theme.prototype.hasCustom = function(option) {

    if (this.config.currentTheme == "threat") {
        return false;
    }

    var config = this.getCurrentConfig();
    return option in config;
}


/**
 * Get option from custom config.
 * @param {String} option
 * @returns
 */
Theme.prototype.getCustom = function(option) {

    return this.getCurrentConfig()[option];
}