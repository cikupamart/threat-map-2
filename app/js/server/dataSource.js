/**
 * Artificial data source for application demo.
 * @constructor
 */
function DataSource() {
    /**
     * Get one more data set.
     */
    this.next = function() {

        var data = [];
        var size = this.getRandomArbitrary(1, 5);

        for (var i = 0; i < size; i ++) {

            var shot = [];

            var attacker  = this.getRandomCity();
            attacker.ip   = "127.142.246.36" + this.getRandomArbitrary(1, 9);
            attacker.org  = "Company A";

            var victim    = this.getRandomCity();
            victim.ip     = "127.0.0." + this.getRandomArbitrary(1, 9);
            victim.org    = "Company B";

            var shotsAmount;
            var randomValue = Math.random();
            if (randomValue > 0.9) {
                shotsAmount = 4;
            } else if (randomValue > 0.8) {
                shotsAmount = 3;
            } else if (randomValue > 0.5) {
                shotsAmount = 2;
            } else {
                shotsAmount = 1;
            }

            for (j = 0; j < shotsAmount - 1; j ++) {
                shot.push({
                    "timestamp" : Date.now(),
                    "type" : "dos",
                    "port" : 80,
                    "attacker" : attacker,
                    "victim" : victim
                })
            }

            shot.push({
                "timestamp" : Date.now(),
                "type" : "dos",
                "port" : 80,
                "attacker" : attacker,
                "victim" : this.getRandomCity()
            })

            data.push(shot);
        }

        return data;
//        return [[
//            {
//                "timestamp" : Date.now(),
//                "type" : "dos",
//                "port" : 80,
//                "attacker" : this.cities[0],
//                "victim" : this.cities[8]
//            }, {
//                "timestamp" : Date.now(),
//                "type" : "dos",
//                "port" : 80,
//                "attacker" : this.cities[0],
//                "victim" : this.cities[8]
//            }, {
//                "timestamp" : Date.now(),
//                "type" : "dos",
//                "port" : 80,
//                "attacker" : this.cities[0],
//                "victim" : this.cities[8]
//            }, {
//                "timestamp" : Date.now(),
//                "type" : "dos",
//                "port" : 80,
//                "attacker" : this.cities[0],
//                "victim" : this.cities[6]
//            }
//        ]]
    };


    /**
     * Get random value within interval.
     * @param {Integer} min
     * @param {Integer} max
     * @returns {Integer}
     */
    this.getRandomArbitrary = function(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Get random city from cities list.
     * @returns {Object}
     */
    this.getRandomCity = function() {

        return this.cities[
            this.getRandomArbitrary(0, this.cities.length - 1)
        ];
    }


    /**
     * Cities list.
     * @member {Object[]}
     */
    this.cities = [ {
        "name" : "Moscow",
        "latitude" : 55.75,
        "longitude" : 37.6167,
        "countryCode" : "ru",
    }, {
        "name" : "London",
        "latitude" : 51.5072,
        "longitude" : 0.1275,
        "countryCode" : "gb",
    }, {
        "name" : "Berlin",
        "latitude" : 52.5167,
        "longitude" : 13.3833
    }, {
        "name" : "Warsaw",
        "latitude" : 52.2333,
        "longitude" : 21.0167
    }, {
        "name" : "Prague",
        "latitude" : 50.0833,
        "longitude" : 14.4167
    }, {
        "name" : "Paris",
        "latitude" : 48.8567,
        "longitude" : 2.3508,
        "countryCode" : "fr",
    }, {
        "name" : "Belgrade",
        "latitude" : 44.8167,
        "longitude" : 20.4667
    }, {
        "name" : "Lisbon",
        "latitude" : 38.7139,
        "longitude" : -9.1394
    }, {
        "name" : "Ottawa",
        "latitude" : 45.4214,
        "longitude" : -75.6919,
        "countryCode" : "ca",
    }, {
        "name" : "Cape Town",
        "latitude" : -33.9253,
        "longitude" : 18.4239
    }, {
        "name" : "New York",
        "latitude" : 40.7127,
        "longitude" : -74.0059,
        "countryCode" : "us",
    }, {
        "name" : "Tokyo",
        "latitude" : 35.6833,
        "longitude" : 139.6833,
        "countryCode" : "jp",
    }, {
        "name" : "Los Angeles",
        "latitude" : 34.05,
        "longitude" : -118.25,
        "countryCode" : "us",
    }, {
        "name" : "Bogota",
        "latitude" : 4.5981,
        "longitude" : -74.0758
    }, {
        "name" : "Houston",
        "latitude" : 29.7604,
        "longitude" : -95.3698,
        "countryCode" : "us",
    } ]
};

module.exports = new DataSource();