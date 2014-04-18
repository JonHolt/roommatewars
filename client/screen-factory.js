'use strict';

var World = require('psykick2d').World,
    layers = {};

module.exports = {
    showLobby: function() {
        var lobbyLayer = World.createLayer(),
            titleEntity = World.createEntity(),
            nameEntity = World.createEntity(),
            readyEntity = World.createEntity(),

            drawTextSystem = new DrawTextSystem();

        var textComponent = new Text({
            x: 350,
            y: 50,
            size: '20%',
            color: '#aaa',
            text: 'Welcome'
        });

        titleEntity.addComponent(textComponent);
        drawTextSystem.addEntity(titleEntity);


        // ...

        lobbyLayer.addSystem(drawTextSystem);
        layers = {
            lobby : lobbyLayer
        };
        World.pushLayer(lobbyLayer);
        World.addEventListener('afterDraw',function(){
            lobbyLayer.visible = false;
        })
    },

    showGame: function() {

    },

    rollCredits: function() {

    }
};