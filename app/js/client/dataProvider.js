/**
 * Client side data provider.
 * Class provide communication between node.js server and client
 * side application using socket.io library.
 * @constructor
 * @param {Map} map
 * @param {Board} board
 */
function DataProvider(map, board) {
    /**
     * Map object reference.
     * @member {Map}
     */
    this.map = map;
    /**
     * Board object reference.
     * @member {Board}
     */
    this.board = board;
    /**
     * Socket.io connection descriptor.
     * @member {Object}
     */
    this.socket = io();
}


/**
 * Start listening for input data.
 */
DataProvider.prototype.run = function() {

    var self = this;
    this.socket.on("update", function(data) {
        self.update(data);
    });
}


/**
 * Update application components.
 * @param {Array[][]} dataSet
 */
DataProvider.prototype.update = function(dataSet) {

    dataSet.forEach(function(dataRow) {
        this.map.shoot(dataRow);
        this.board.update(dataRow);
    }, this);
}