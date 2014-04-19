'use strict';

var World = require('psykick2d').World;

World.init({
    width: 900,
    height: 600,
    serverMode: true
});

var io = require('socket.io').listen(4242);
io.set('authorization', function (handshakeData, cb) {
    console.log(handshakeData.query);
    cb(null, true);
});
io.sockets.on('connection', function(socket) {
    console.log('Connected');
    socket.emit('confirm', {
        name: 'Jon',
        occupation: 'Badass'
    });
});