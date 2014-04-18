'use strict';

var World = require('psykick2d').World,
    ScreenFactory = require('./screen-factory.js');

World.init({
    backgroundColor: '#FFF'
});

ScreenFactory.setMainMenu({
    onSelection: function(option) {
        switch (option) {
            case 'play game':
                ScreenFactory.setMainGame();
                break;
        }
    }
});

