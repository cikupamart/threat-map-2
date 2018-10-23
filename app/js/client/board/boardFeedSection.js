/**
 * Board feed section.
 * @constructor
 * @param {Integer} rowsNumber
 * @param {Theme} theme
 */
function BoardFeedSection(rowsNumber, theme) {
    /**
     * Board rows number.
     * @member {Integer}
     */
    this.rowsNumber = rowsNumber;
    /**
     * Section columns number.
     * @member {Integer}
     */
    this.colsNumber = jQuery("#feed thead tr:last td").size();
    /**
     * Table rows container.
     * @member {jQuery}
     */
    this.display = jQuery("#feed-display");
    /*
     * Continue initialization.
     */
    this._init();
}


/**
 * Initialize object.
 */
BoardFeedSection.prototype._init = function() {
    /*
     * Append n rows with empty strings as values.
     */
    for (var i = 0; i < this.rowsNumber; i ++) {
        this.appendRow(Array.apply(null, Array(this.colsNumber)).map(String.prototype.valueOf, "&nbsp;"));
    }
}


/**
 * Update display.
 * @param {Array[]} dataSet
 */
BoardFeedSection.prototype.update = function(dataSet) {
    /*
     * Get attack data set first element.
     */
    var attack = dataSet[0];
    /*
     * Get attacker and victim objects.
     */
    var attacker = attack.attacker;
    var victim   = attack.victim;
    /*
     * Remove display last row.
     */
    this.removeLastRow();
    /*
     * Append new row to display.
     */
    this.appendRow([
        attack.timestamp,
        attacker.org,
        attacker.ip,
        attacker.name,
        victim.org,
        victim.ip,
        victim.name,
        attack.type,
        attack.port
    ]);
}


/**
 * Remove display last row.
 */
BoardFeedSection.prototype.removeLastRow = function() {

    this.display.find("tr:last").remove();
}


/**
 * Append row to the display.
 * @param {Array} dataSet
 */
BoardFeedSection.prototype.appendRow = function(dataSet) {
    /*
     * Declare row variable.
     */
    var row = "<tr>";
    /*
     * Append column tags.
     */
    for (var i = 0; i < this.colsNumber; i ++) {
        row += "<td>" + (dataSet[i] == undefined ? "&nbsp;" : dataSet[i]) + "</td>";
    }
    /*
     * Append closing tag.
     */
    row += "</tr>";
    /*
     * Append row ro display.
     */
    this.display.prepend(row);
}