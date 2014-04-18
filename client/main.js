'use strict';

    var World = require('psykick2d').World,
        ScreenFactory = require('./screen-factory.js'),
        config = require('./config.json');
    //socket = io.connect(config.server);

    World.init({
        backgroundColor: '#444',
        width: 900,
        height: 600
    });


    /*socket.on('update', function (data) {

    });*/
    /*socket.on('newPlayer', function (data) {
        lobbyLayer.visible = false;
    });*/
//socket.emit('input',{teh:'data'});

ScreenFactory.showLobby();