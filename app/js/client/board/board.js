/**
 * Board dispatcher.
 * @constructor
 * @param {Integer} rowsNumber
 * @param {Theme} theme
 */
function Board(rowsNumber, theme) {
    /**
     * Application theme.
     * @member {Theme}
     */
    this.theme = theme;
    /**
     * Board statistic section.
     * @member {BoardStatisticSection}
     */
    this.stat = new BoardStatisticSection(rowsNumber);
    /**
     * Board feed section.
     * @member {BoardFeedSection}
     */
    this.feed = new BoardFeedSection(rowsNumber);
    /*
     * Continue initialization.
     */
    this._init();
}


/**
 * Initialize object.
 */
Board.prototype._init = function(dataSet) {
    /*
     * Get board configuration or return defaults.
     */
    var boardConfig = this.theme.getCurrent("board", {
        fontColor : "#000",
        fontSize : "14px",
        fontFamily : "sans serif",
        bgColor : "hsla(195, 53%, 79%, 0.5)",
    });
    /*
     * Apply theme to board.
     */
    jQuery("#statistic, #feed").css("color", boardConfig.fontColor)
        .css("font-size", boardConfig.fontSize)
        .css("font-family", boardConfig.fontFamily)
        .css("background-color", boardConfig.bgColor);
}


/**
 * Update board display.
 * @param {Object[]} dataSet
 */
Board.prototype.update = function(dataSet) {

  this.stat.update(dataSet);
  this.feed.update(dataSet);
}