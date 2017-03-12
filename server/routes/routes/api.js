var os = require('os');
var sphero = require("sphero");
var bluetooth = require('node-bluetooth');
var lodash = require('lodash');
var device = new bluetooth.DeviceINQ();
var orb = '';

module.exports = function (express) {
    var router = express.Router(),
        battlegame = {
            players: {},
            sphero: {
                pos: 50
            }
        };

    router.get('/devices', function(req, res) {
        device.listPairedDevices(function(devices) {
            res.json(devices);
        });
    });

    router.post('/connect', function(req, res) {
        var device = '',
            platform = os.platform();
        console.log(os.platform());

        if (platform === 'darwin') {
            device = '/dev/tty.Sphero-WBP-AMP-SPP';
        }

        if (platform === 'linux') {
            device = '/dev/rfcomm0';
        }

        console.log(device);
        if (!device) {
            return res.status(400).send({ message: 'device_not_found' });
        }


        orb = sphero(device);
        orb.connect(function() {

            orb.getBluetoothInfo(function(err, data) {
                if (err) {
                    console.error("err:", err);
                    return res.status(500).send({ message: 'cannot_connect_device' });
                } else {

                    console.log("bluetoothInfo:");
                    console.log("  name:", data.name);
                    console.log("  btAddress:", data.btAddress);
                    console.log("  separator:", data.separator);
                    console.log("  colors:", data.colors);

                    orb.getColor(function(err, data) {
                        console.log(data.color);
                        res.json(data);
                    });
                }
            });
        });
    });

    router.post('/battle/init', function(req, res) {

        if (!orb) {
            return res.status(500).send({ message: 'no_device' });
        }


        orb.detectCollisions();


        orb.on("collision", function(data) {

            console.log('');
            console.log('!   !');
            console.log('collision');
            console.log('');
            console.log('');
            orb.color("red");

            setTimeout(function() {
              orb.color("green");
            }, 1000);
        });

        // Move 50 cm
        orb.roll(32, 0);
        setTimeout(function() {
            orb.color("blue");
        }, 5000);

        setTimeout(function() {
            orb.color("green");
            orb.roll(63, 180);
        }, 10000);

        setTimeout(function() {
            orb.color("blue");
        }, 15000);

        setTimeout(function() {
            orb.color("green");
            orb.roll(33, 0);
        }, 20000);

        res.json({ });

    });

    router.put('/battle/move', function(req, res) {
        console.log('------- ===');
        console.log(req.query);
        console.log(req.query.direction);

        var direction = 0;

        if (req.query.player = 'nemanja') {

            if (req.query.direction === 'backword') {
                direction = 180;
            }
        } else {
            if (req.query.direction === 'backword') {
                direction = 0;
            }
        }

        orb.roll(7, direction);

        res.json(req.query);
    });

    return router;
}