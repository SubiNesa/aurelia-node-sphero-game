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

    router.post('/battle/start', function(req, res) {

        if (lodash.size(battlegame.players) >= 2 ) {
            return res.status(400).send({ message: 'fool' });
        }
        var player = lodash.size(battlegame.players) + 1;

        if (player === 1) {
            player = 'one';
        } else {
            player = 'two';
        }

        battlegame.players[player] = {
            score: 0,
            player: player
        };

        res.json({ player: player });

    });

    router.put('/battle/checkpoint', function(req, res) {
        console.log('------- ===');
        console.log(req.query);
        console.log(battlegame);

        battlegame.players[req.query.player].score += Number(req.query.points);
        if (req.query.player == 1) {
            if (req.query.points > 0) {
                battlegame.sphero.pos += 10;
            } else {
                battlegame.sphero.pos -= 10;
            }
        } else {
            if (req.query.points < 0) {
                battlegame.sphero.pos += 10;
            } else {
                battlegame.sphero.pos -= 10;
            }
        }

        console.log(battlegame);

        res.json(battlegame);
    });

    return router;
}