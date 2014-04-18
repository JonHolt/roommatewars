'use strict';

var World = require('psykick2d').World,
    layers = {};

module.exports = {
    showLobby: function() {
        var lobbyLayer = World.createLayer(),
            welcomeEntity = World.createEntity(),
            nameEntity = World.createEntity(),
            readyEntity = World.createEntity(),

            drawTextSystem = new DrawTextSystem(),
            drawButtonSystem = new DrawButtonSystem();

        var textComponent = new Text({
            x: 350,
            y: 50,
            size: '20%',
            color: '#aaa',
            text: 'Welcome'
        });

        welcomeEntity.addComponent(textComponent);
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