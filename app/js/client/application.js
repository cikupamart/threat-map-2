/**
 * Web application main class on client side.
 * @constructor
 */
function Application() {
    /**
     * Theme object reference.
     * @member {Theme}
     */
    this.theme = new Theme(config);
    /**
     * Map object reference.
     * @member {Map}
     */
    this.map = new Map(this, this.theme);
    /**
     * Board object reference.
     * @member {Board}
     */
    this.board = new Board(7, this.theme);
    /**
     * DataProvider object reference.
     * @member {DataProvider}
     */
    this.dataProvider = new DataProvider(this.map, this.board);
}


/**
 * Bootstrap application.
 * @param {String} selector
 */
Application.prototype.bootstrap = function(selector) {

    this.map.render(selector);
    this.dataProvider.run();
}