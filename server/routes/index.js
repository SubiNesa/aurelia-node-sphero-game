module.exports = function (app, express, io) {
    var api = require('./routes/api')(express, io);
    app.use('/api', api);
};