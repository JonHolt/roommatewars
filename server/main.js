'use strict';

var Game = require('./game.js'),
    PlayerManager = require('./player-manager.js'),
    io = require('socket.io').listen(4242),

    GameModes = {
        Lobby: 0,
        Game: 1
    },
    currentMode = GameModes.Lobby,
    MAX_PLAYERS = 2,
    numPlayers = 0;

io.sockets.on('connection', function(socket) {
    if (currentMode === GameModes.Game) {
        return;
    }
    PlayerManager.addPlayer(socket);
    numPlayers++;
    // For testing purposes
    if(numPlayers === MAX_PLAYERS){
        Game.startGame();
        currentMode = GameModes.Game;
    }
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