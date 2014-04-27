'use strict';

var Game = require('./game.js'),
    PlayerManager = require('./player-manager.js'),
    io = require('socket.io').listen(4242),

    GameModes = {
        Lobby: 0,
        Game: 1
    },
    currentMode = GameModes.Lobby;

io.sockets.on('connection', function(socket) {
    /* Removing for debug
    if (currentMode === GameModes.Game) {
        return;
    }
    */
    PlayerManager.addPlayer(socket);

    // For testing purposes
    Game.startGame();
    currentMode = GameModes.Game;
});
io.sockets.on('readyState', function() {
    if (currentMode === GameModes.Game) {
        return;
    }
    if (PlayerManager.allPlayersAreReady()) {
        Game.startGame();
        currentMode = GameModes.Game;
    }
});