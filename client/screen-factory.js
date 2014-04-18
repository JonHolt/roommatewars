'use strict';

var World = require('psykick2d').World,
    layers = {};

module.exports = {
    showLobby: function() {
        var lobbyLayer = World.createLayer(),
            Welcome Entity = World.createEntity(),

            drawTextSystem = new DrawTextSystem(),
            drawButtonSystem = new DrawButtonSystem();

        var textComponent = new Text({
            x: 100,
            y: 300,
            color: '#F00',
            text: 'Start Game'
        });

        startGameEntity.addComponent(textComponent);
        startGameEntity.addComponentAs(textComponent, 'Position');
        drawTextSystem.addEntity(startGameEntity);
        moveSystem.addEntity(startGameEntity);


        // ...

        lobbyLayer.addSystem(drawTextSystem);
        layers = {

        };
        World.pushLayer(lobbyLayer);
    },

    showGame: function() {

    },

    rollCredits: function() {

    }
};