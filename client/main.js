'use strict';

    var World = require('psykick2d').World,
        ScreenFactory = require('./screen-factory.js'),
        config = require('./config.json');
    var socket = io.connect(config.server, {query:JSON.stringify(config)});

    World.init({
        backgroundColor: '#444',
        width: 900,
        height: 600
    });

    socket.on('confirm',function(data){
        console.log(data);
    });

    /*socket.on('update', function (data) {

    });*/


ScreenFactory.showLobby();