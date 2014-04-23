'use strict';

var PlayerManager = {
    _players: {},

    /**
     * Adds a new player to the collection
     * @param name
     */
    addPlayer: function(socket) {
        var data = JSON.parse(socket.handshake.query.data),
            name = data.playerName,
            player = {};

        if (!PlayerManager._players[name]) {
            PlayerManager._players[name] = {
                id: null,
                name: name,
                socket: socket,
                readyState: false,
                sprite: null,
                keys: {}
            };
        }

        console.log(name + ' has connected');
        player = PlayerManager._players[name];

        socket.on('readyState', function(data) {
            player.readyState = data.readyState;
        });

        socket.on('keys', function(data) {
            player.keys = data;
        });

        socket.on('disconnect', function() {
            console.log(name + ' has disconnected');
        });
    },
    forEachPlayer: function(callback) {
        for (var name in PlayerManager._players) {
            callback(PlayerManager._players[name]);
        }
    },
    allPlayersAreReady: function() {
        for (var name in PlayerManager._players) {
            if (!PlayerManager._players[name].readyState) {
                return false;
            }
        }
        return true;
    },
    getPlayer: function(name) {
        return PlayerManager._players[name];
    },
    broadcast: function(event, msg) {
        PlayerManager.forEachPlayer(function(player) {
            player.socket.emit(event, msg);
        });
    }
};

module.exports = PlayerManager;