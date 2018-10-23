var express = require("express");
var app     = express();
var http    = require("http").Server(app);
var io      = require("socket.io")(http);

/*
 * Require artificial data data source.
 * Should be removed on production stage.
 */
var dataSource = require(__dirname + "/app/js/server/dataSource.js");

/*
 * Return index.html page on site root.
 */
app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

/*
 * Make /lib reference to the node modules.
 */
app.use("/lib",
    express.static(__dirname + "/node_modules")
);

/*
 * Make /app reference to the application JavaScript files.
 */
app.use("/app",
    express.static(__dirname + "/app")
);

/*
 * Listen 3000 port.
 */
http.listen(3001, function(){
    console.log("listening on *:3001");
});

/*
 * Listen connection event and produce artificial data set 
 * on it every second.
 */
io.on("connection", function(socket) {

    var i = 0;

    var intervalId = setInterval(function() {
        if (i >= 25) {
            clearInterval(intervalId);
            return;
        }

        io.emit("update", dataSource.next());

        i ++;
    }, 1000);
});
