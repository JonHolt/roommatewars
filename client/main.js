'use strict';

var World = require('psykick2d').World,
    ScreenFactory = require('./screen-factory.js'),
    config = require('config.json'),
    socket = io.connect(config.server);

World.init({
    backgroundColor: '#FFF'
});

socket.on('update', function (data) {

});
//socket.emit('input',{teh:'data'});

ScreenFactory.showLobby({
    onSelection: function(option) {
        switch (option) {
            case 'play game':
                ScreenFactory.setMainGame();

                break;
        }
    }
});

