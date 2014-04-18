'use strict';

var World = require('psykick2d').World;

module.exports = {
    showMainMenu: function() {
        var layer = World.createLayer(),
            startGameEntity = World.createEntity(),
            creditsEntity = World.createEntity(),

            drawTextSystem = new DrawTextSystem(),
            moveSystem = new MoveSystem();

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

        layer.addSystem(drawTextSystem);
        World.pushLayer(layer);
    },

    showOptions: function() {

    },

    showGame: function() {

    },

    rollCredits: function() {

    }
};