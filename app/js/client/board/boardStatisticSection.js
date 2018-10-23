/**
 * Board statistics section.
 * @constructor
 * @param {Integer} rowsNumber
 * @param {Theme} theme
 */
function BoardStatisticSection(rowsNumber, theme) {
    /**
     * Board rows number.
     * @member {Integer}
     */
    this.rowsNumber = rowsNumber;
    /**
     * Section columns number.
     * @member {Integer}
     */
    this.colsNumber = jQuery("#statistic thead tr:last td").size();
    /**
     * Table rows container.
     * @member {jQuery}
     */
    this.display = jQuery("#statistic-display");
    /**
     * Display rows selection.
     * @member {jQuery}
     */
    this.displayRows;
    /**
     * Attacks per IP container.
     * @member {Object[]}
     */
    this.statistic = {};
    /*
     * Continue initialization.
     */
    this._init();
}


/**
 * Initialize object.
 */
BoardStatisticSection.prototype._init = function() {
    /*
     * Append n rows with empty strings as values.
     */
    for (var i = 0; i < this.rowsNumber; i ++) {
        this.appendRow(Array.apply(null, Array(this.colsNumber)).map(String.prototype.valueOf, "&nbsp;"));
    }
    /*
     * Select appended rows.
     */
    this.displayRows = this.display.find("tr");
}


/**
 * Update display.
 * @param {Array[]} dataSet
 */
BoardStatisticSection.prototype.update = function(dataSet) {
    /*
     * Get attack data set first element.
     */
    var attacker = dataSet[0].attacker;
    /*
     * Get attacker IP.
     */
    var ip = attacker.ip;
    /*
     * Update statistic hash.
     */
    if (ip in this.statistic) {
        this.statistic[ip]["count"] += dataSet.length;
    } else {
        this.statistic[ip]  = {
            "count" : dataSet.length,
            "code" : attacker.countryCode
        };
    }
    /*
     * Convert statistic hash to array, sort it and get top rowsNumber.
     */
//    console.log(this.statistic, d3.map(this.statistic).entries());
//    return;
    var top = d3.map(this.statistic).entries()
        .sort(function(a, b) {
            return b.value.count - a.value.count;
        }).slice(0, this.rowsNumber);
//    console.log(2);
//    console.log(top);
    /*
     * Loop over sorted array.
     */
    top.forEach(function(data, i) {
//        console.log(data)
        /*
         * Find corresponding table row.
         */
        var row = this.displayRows.eq(i);
        /*
         * Fetch row columns.
         */
        var columns = row.find("td");
        /*
         * Update columns values.
         */
        columns.eq(0).text(data.value.count);
        columns.eq(1).html(data.value.code ? '<span class="flag-icon flag-icon-' + data.value.code + '"></span>' : "&nbsp;");
        columns.eq(2).text(data.key);
    }, this);
}


/**
 * Append row to the display.
 * @param {Array} dataSet
 */
BoardStatisticSection.prototype.appendRow = function(dataSet) {
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