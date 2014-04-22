'use strict';

var io = require('socket.io').listen(4242),
    playerStateByName = {},
    sockets = [];

/**
 * Broadcasts a message to all sockets
 * @param {string}  event
 * @param {*}       [msg]
 */
function broadcast(event, msg) {
    for (var i = 0, len = sockets.length; i < len; i++) {
        sockets[i].emit(event, msg);
    }
}
io.set('authorization', function (handshakeData, cb) {
    var data = JSON.parse(handshakeData.query.data);
    playerStateByName[data.playername] = false;
    cb(null, true);
});
io.sockets.on('connection', function(socket) {
    // Reference the players name for debug purposes
    var playerName = '';
    sockets.push(socket);

    // When a player says they are ready
    socket.on('readyState', function(data) {
        playerName = data.name;
        var isConnected = (data.readyState) ? 'ready' : 'not ready';
        playerStateByName[data.name] = data.readyState;
        console.log(data.name + ' is ' + isConnected);

        broadcast('lobbyState', playerStateByName);

        // Are all of the players ready?
        for (var name in playerStateByName) {
            if (!playerStateByName[name]) {
                return;
            }
        }

        // Start the game
        broadcast('start');
    });

    // Remove a player from a game
    socket.on('disconnect', function() {
        sockets.splice(sockets.indexOf(socket), 1);
        if (playerName) {
            delete playerStateByName[playerName];
            broadcast('disconnected', playerName);
            console.log(playerName + ' has disconnected');
        }
    });

    broadcast('start', require('./game.js').startGame());
});