/**
 * Map representation class.
 * @constructor
 * @param {Application} application
 * @param {Theme} theme
 */
function Map(application, theme) {
    /**
     * Reference to application object.
     * @member {Application}
     */
    this.application = application;
    /**
     * Application theme.
     * @member {Theme}
     */
    this.theme = theme;
    /**
     * Map aspect ratio.
     * @member {Number}
     */
    this.aspectRatio = 1.92;
    /**
     * Shot animation time.
     * @member {Integer}
     */
    this.animationTime = 2500;
    /**
     * Shots color palette.
     * @member {String[]}
     */
    this.colorSet = d3.scale.category10().range();
    /**
     * Blow size scale function.
     * @member {Function}
     */
    this.blowRadiusScale = d3.scale.linear()
        .domain([1, 2])
        .range([50, 60]);
    /**
     * Blow border size scale function.
     * @member {Function}
     */
    this.blowStrokeScale = d3.scale.linear()
        .domain([1, 2])
        .range([7, 10]);
}


/**
 * Calculate duration depending on trajectory length.
 * @param {Number} length
 * @returns {Number}
 */
Map.prototype.getDuration = function(length) {

    return length / 1200 * this.animationTime;
}


/**
 * Get random color from predefined set.
 * @returns {String}
 */
Map.prototype.getColor = function() {

    return this.colorSet[Math.floor(Math.random() * 9)];
}


/**
 * Run callback at the end of transitions crowd.
 * See http://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition
 * @param {Transition} transition
 * @param {Function} callback
 */
Map.prototype.endAll = function(transition, callback) {

    if (transition.size() === 0) {
        callback();
    }

    var n = 0;

    transition.each(function() {
        ++ n;
    }).each("end", function() {
        if (! --n) {
            callback.apply(this, arguments);
        }
    });
}


/**
 * Draw blow circle.
 * @param {Number} x
 * @param {Number} y
 * @param {Integer} size
 * @param {String} color
 * @param {Function} callback
 */
Map.prototype.blow = function(x, y, size, color, callback) {

    this.battleLayer.append("circle")
        .datum(size)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("fill", "transparent")
        .attr("stroke", color)
        .attr("stroke-width", this.blowStrokeScale)
        .attr("stroke-opacity", 1)
        .transition()
        .duration(this.animationTime / 2)
        .attr("r", this.blowRadiusScale)
        .attr("stroke-opacity", 0)
        .each("end", function() {
            /*
             * Remove circle at the end of animation.
             */
            d3.select(this).remove();
            /*
             * Invoke callback if any.
             */
            callback ? callback() : null;
        });
}


/**
 * Calculate and return array of each trajectory middle point.
 * See https://en.wikipedia.org/wiki/Bisection#Line_segment_bisector
 * @param {Integer} size
 * @param {Number[]} from
 * @param {Number[]} to
 * @returns {Number[][]}
 */
Map.prototype.getMidPoints = function(size, from, to) {
    /*
     * Calculate middle point for first missile.
     */
    var midPoint = [
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2
    ];
    /*
     * Return middle point if amount of missiles equals to one.
     */
    if (size == 1) {
        return [ midPoint ];
    };

    var isOdd = size % 2;
    var midPoints = [];
    if (isOdd) {
        midPoints.push(midPoint);
        size --;
    }

    var range = 0.1;
    if (size > 2) {
        if (isOdd) {
            range = Math.log(size) / 10;
        } else {
            range = Math.log(size) / 10 * 0.7;
        }
    }

    var amplitude;
    for (var i = 0, j = 1; i < size; i = i + 2, j ++) {
        /*
         * Calculate amplitude for current pair of missiles.
         */
        amplitude = range / (size / 2) * j;
        /*
         * Calculate middle points depending on amplitude size.
         */
        midPoints.push([
            (from[0] + to[0]) / 2 - amplitude * (to[1] - from[1]),
            (from[1] + to[1]) / 2 + amplitude * (to[0] - from[0])
        ]);
        midPoints.push([
            (from[0] + to[0]) / 2 - (- amplitude) * (to[1] - from[1]),
            (from[1] + to[1]) / 2 + (- amplitude) * (to[0] - from[0])
        ]);
    }

    return midPoints;
}


/**
 * Launch a missile.
 * @param from
 * @param to
 */
Map.prototype.shoot = function(shots) {
    /*
     * Get missile color.
     */
    var color = this.getColor();
    /*
     * Generate missile trace.
     */
    var trajectory = d3.svg.line()
        .x(function(d, i) {
            return d.x;
        }).y(function(d, i) {
            return d.y;
        }).interpolate("basis");
    /*
     * Create animation container.
     */
    var shotContainer = this.battleLayer.append("g");
    /*
     * Split input into arrays by victim latitude and longitude.
     */
    var victims = _(shots).chain()
        .groupBy(function(shot) {
            return shot.victim.latitude + "x" + shot.victim.longitude;
        }).values().value();
    /*
     * Draw attacker launch blow.
     */
    var attackerCoordinates = this.projection([shots[0].attacker.longitude, shots[0].attacker.latitude]);
    this.blow(attackerCoordinates[0], attackerCoordinates[1], shots.length, color);
    /*
     * Loop over victims.
     */
    for (var i = 0; i < victims.length; i ++) {
        var shots = victims[i];

        var midPoints = this.getMidPoints(
            shots.length,
            this.projection([shots[0].attacker.longitude, shots[0].attacker.latitude]),
            this.projection([shots[0].victim.longitude, shots[0].victim.latitude])
        );
        /*
         * Declare trajectory start and last coordinates.
         */
        var start;
        var finish;
        /*
         * Loop over one victim shots.
         */
        for (var j = 0; j < shots.length; j ++) {

            var shot = shots[j];

            start  = this.projection([shot.attacker.longitude, shot.attacker.latitude]);
            finish = this.projection([shot.victim.longitude, shot.victim.latitude]);

            var trajectoryData = [{
                x : start[0],
                y : start[1]
            }, {
                x : midPoints[j][0],
                y : midPoints[j][1]
            }, {
                x : finish[0],
                y : finish[1]
            }];
            /*
             * Append missile to container.
             */
            shotContainer.selectAll(".path")
                .data([2, 3, 4])
                .enter()
                .append("path")
                .attr("class", "path-" + i)
                .attr("d", trajectory(trajectoryData))
                .attr("stroke", color)
                .attr("visibility", "hidden")
                .attr("fill", "none")
                .attr("stroke-width", function(d) {
                    return d;
                });
        }
        /*
         * Select all appended path during victim shots loop.
         */
        var path = shotContainer.selectAll(".path-" + i);
        /*
         * Start sequence of animations in current context
         * (and variables states) using closure.
         */
        (function(map, path, blowCoordinates, blowSize) {
            /*
             * Get trajectory length.
             */
            var totalLength = d3.max(path[0], function(p) {
              return p.getTotalLength();
            });
            /*
             * Calculate animation time depending on the trajectory length.
             */
            var animationTime = map.getDuration(totalLength);

            path.attr("stroke-dasharray", "0 0 0 " + totalLength)
                .attr("visibility", "visible")
                .transition()
                .duration(animationTime / (totalLength / 100))
                .ease("linear")
                .attrTween("stroke-dasharray", function(d) {
                    return map.getFirstStageInterpolater(d, totalLength);
                }).each("end", function() {
                    d3.select(this).transition()
                        .duration(animationTime)
                        .ease("linear")
                        .attrTween("stroke-dasharray", function(d) {
                            return map.getSecondStageInterpolater(d, totalLength);
                        }).call(map.endAll, function(d) {
                            /*
                             * Draw victim hit blow and remove animation container at the end.
                             */
                            map.blow(blowCoordinates[0], blowCoordinates[1], blowSize, color, function() {
                                shotContainer.remove();
                            });
                        })
                });
        })(this, path, finish, shots.length);
    };
}


/**
 * Get missile first phase interpolater.
 * @param d
 * @param totalLength
 * @returns {Function}
 */
Map.prototype.getFirstStageInterpolater = function(d, totalLength) {

    var length;

    switch (d) {
        case 2 : {
            offset = 0, length = 100;
        }; break;
        case 3 : {
            offset = 25, length = 75;
        }; break;
        case 4 : {
            offset = 50, length = 50;
        }; break;
    }

    var interpolateLength = d3.interpolate(0, length);
    var interpolateOffset = d3.interpolate(0, offset);

    return function(t) {
        return "0 " + interpolateOffset(t) + " " + interpolateLength(t) + " " + totalLength;
    };
}


/**
 * Get missile second phase interpolater.
 * @param d
 * @param totalLength
 * @returns {Function}
 */
Map.prototype.getSecondStageInterpolater = function(d, totalLength) {

    var offset;
    var length;

    switch (d) {
        case 2 : {
            offset = 0, length = 100;
        }; break;
        case 3 : {
            offset = 25, length = 75;
        }; break;
        case 4 : {
            offset = 50, length = 50;
        }; break;
    }

    var interpolate = d3.interpolate(0, totalLength);

    return function(t) {
        return "0 " + (interpolate(t) + offset) + " " + length + " " + (totalLength - interpolate(t));
    };
}


/**
 * Get browser scroll bar width.
 * See http://stackoverflow.com/a/986977/1191125
 * @returns {Number}
 */
Map.prototype.getScrollBarWidth = function() {

    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);

    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);

    return (w1 - w2);
};


/**
 * Render map.
 * @param {String} selector
 */
Map.prototype.render = function(selector) {
    /*
     * Get map theme config or return defaults.
     */
    var mapConfig = this.theme.getCurrent("map", {
        waterColor : "#516e9d",
        terraColor : "#102142",
        bordersColor : "#777",
        bordersWidth : "1px"
    });
    /*
     * Set background/water color.
     */
    d3.select("html, body").style("background-color", mapConfig.waterColor)
    /*
     * Select map container.
     */
    this.container = d3.select(selector);
    /*
     * Get container width.
     */
    this.width = this.container.node()
        .getBoundingClientRect()
        .width;
    /*
     * Change map width if current browser window aspect ration more than 1.92.
     */
    var aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio > this.aspectRatio) {
        this.width = this.width - this.getScrollBarWidth();
    }
    /*
     * Calculate height.
     */
    this.height = this.width / this.aspectRatio;
    /*
     * Append SVG element to container.
     */
    this.svg = d3.select(selector).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
    /*
     * Append "static" map layer to the map.
     */
    this.groundLayer = this.svg.append("g");
    /*
     * Append "dynamic" animation layer to the map.
     */
    this.battleLayer = this.svg.append("g")
    /*
     * Declare scale variable. It will be recalculated further.
     */
    var scale  = this.aspectRatio;
    /*
     * Declare offset variable. It will be recalculated further.
     */
    var offset = [this.width / 2, this.height / 2];
    /*
     * Create equirectangular projection.
     */
    this.projection = d3.geo.equirectangular()
        .scale(scale)
        .translate(offset);
    /*
     * Create geo path from projection.
     */
    var path = d3.geo.path()
        .projection(this.projection);
    /*
     * Append logotypes.
     */
    // this._appendLogotypes();
    /*
     * Append map title.
     */
    this._appendTitle();
    /*
     * Stash reference to this object.
     */
    var self = this;
    /*
     * Load topojson world map and render it.
     */
    d3.json("/lib/topojson/examples/world-110m.json", function(error, world) {
        /*
         * Show message if world map could not be loaded.
         */
        if (error) {
            console.error(error);
        }
        /*
         * Recalculate map values to make it full width:
         * https://stackoverflow.com/questions/30629309/d3-js-how-to-make-map-full-width
         */
        var bounds = path.bounds(topojson.feature(world, world.objects.land));
        var hscale = scale * self.width / (bounds[1][0] - bounds[0][0]);
        var vscale = scale * self.height / (bounds[1][1] - bounds[0][1]);
        scale  = (hscale < vscale) ? hscale : vscale;
        offset = [
            self.width  - (bounds[0][0] + bounds[1][0]) / 2,
            self.height - (bounds[0][1] + bounds[1][1]) / 2
        ];
        /*
         * Update projection to fit fool screen.
         */
        self.projection
            .scale(scale)
            .translate(offset);
        /*
         * Draw continents.
         */
        self.groundLayer.append("path")
            .datum(topojson.feature(world, world.objects.land))
            .style("fill", mapConfig.terraColor)
            .style("stroke", mapConfig.bordersColor)
            .style("stroke-width", mapConfig.bordersWidth)
            .attr("d", path);
        /*
         * Draw countries boundaries.
         */
        self.groundLayer.append("path")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .style("stroke", mapConfig.bordersColor)
            .style("stroke-width", mapConfig.bordersWidth)
            .attr("d", path);
    });
}


/**
 * Append title to the map.
 */
Map.prototype._appendTitle = function() {
    /*
     * Get title config.
     */
    var titleConfig = this.theme.getCurrent("title", {
        text : "Very deafult title",
        color: "#fff"
    });
    /*
     * Append title to the map.
     */
    d3.select(document.body).append("h1")
        .attr("class", "title")
        .style("color", titleConfig.color)
        .text(titleConfig.text)
}


/**
 * Append logotypes to the map.
 */
Map.prototype._appendLogotypes = function() {
    /*
     * Get logo default config or apply default.
     */
    var logoConfig = this.theme.getDefault("logo", {
        url : "/app/img/threat_informant.png",
        width : "296px",
        height : "70px"
    });
    /*
     * Append default logo.
     */
    d3.select(document.body).append("img")
        .attr("id", "threat-logo")
        .attr("width", logoConfig.width)
        .attr("height", logoConfig.height)
        .attr("src", logoConfig.url)
    /*
     * Append custom logo if any.
     */
    if (this.theme.hasCustom("logo")) {
        logoConfig = this.theme.getCustom("logo");
        d3.select(document.body).append("img")
            .attr("id", "custom-logo")
            .attr("width", logoConfig.width)
            .attr("height", logoConfig.height)
            .attr("src", logoConfig.url)
    }
}
