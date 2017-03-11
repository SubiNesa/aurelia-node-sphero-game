var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lodash = require('lodash');

var app = express();
var server = require('http').createServer(app);
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

var users = {
    'battle': {}
};
var sphero = {
    steps: 0,
    color: ''
};

app.use(allowCrossDomain);
app.use('/', require('./routes/routes/index'));
app.use(express.static(path.join(__dirname, '../client')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(favicon('../client/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('port', process.env.PORT || 9000);

var server = app.listen(app.get('port'), function() {
    console.log(" _____________________________________ ");
    console.log(" .-. .-. .-.   .-. .-. . . .-. .-. .-. ");
    console.log(" |-| |-'  |    `-. |-' |-| |-  |(  | | ");
    console.log(" ` ' '   `-'   `-' '   ' ` `-' ' ' `-' ");
    console.log(" _____________________________________ ");
    console.log(" Listening on port " + server.address().port);
});

var io = require('socket.io').listen(server);
var router = require('./routes/index')(app, express);

io.sockets.on('connection', function (socket) {

    console.log(" ");
    console.log(" socket connection: ");
    console.log(socket.id);
    console.log(users);
    console.log(" ");

    socket.on('getusers', function (player){
        // Send to the sender and noone else
        socket.emit('setusers', users['battle']);
    });

    socket.on('adduser', function (player){
        var position = lodash.size(users['battle']);
        console.log(player);
        console.log(socket.id);
        socket.username = player;
        socket.room = 'battle';
        console.log(lodash.size(users['battle']));

        users['battle'][socket.id] = {
            'username': player,
            'position': position + 1
        }
        socket.join('battle');

        // Send to everyone except the sender
        socket.broadcast.to('battle').emit('updatuser', player);
        console.log(users);
    });

    socket.on('disconnect', function() {
        console.log("------------------- ");
        console.log(" disconnect: ");
        console.log(" ");
        console.log(" " + socket.id);
        console.log(" " + socket.username);
        console.log(" " + socket.room);

        delete users['battle'][socket.id];
        io.sockets.emit('updateusers', users);
        socket.leave(socket.room);

        console.log("------------------- ");
        console.log("  ");
    });

    /**
     * [description]
     * @param  {Object} datadirection & player
     * @return {[type]}                [description]
     */
    socket.on('movesphero', function(data) {
        // Look from player 1
        if (data.player = 'one') {
            if (data.direction === 'backword') {
                sphero.steps += 1;
            } else {
                sphero.steps -= 1;
            }
        } else {
            if (data.direction === 'backword') {
                sphero.steps -= 1;
            } else {
                sphero.steps += 1;
            }
        }

        var direction = data.direction === 'backword' ? 'forword' : 'backword';


        sphero.position = Number(sphero.steps)
        socket.broadcast.to('battle').emit('spheromoved', {sphero: sphero, direction: direction});
    });
});
