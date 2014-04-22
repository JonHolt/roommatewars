'use strict';

var World = require('psykick2d').World,

    Components = {
        RectPhysicsBody: require('psykick2d').Components.Physics.RectPhysicsBody,
        Color: require('psykick2d').Components.GFX.Color
    },

    WALL_SIZE = 32;

World.init({
    width: 900,
    height: 600,
    serverMode: true
});

var createWall = function(data) {
    var wall = World.createEntity(),
        x = data.origin.x,
        y = data.origin.y,
        w = data.end.x - x + WALL_SIZE,
        h = data.end.y - y + WALL_SIZE,
        rectComponent = new Components.RectPhysicsBody({
            x: x,
            y: y,
            w: w,
            h: h
        }),
        colorComponent = new Components.Color({
            colors: ['#FFF']
        });
    wall.addComponent(rectComponent);
    wall.addComponentAs(rectComponent, 'Rectangle');
    wall.addComponent(colorComponent);
    console.log(wall.id);
    return wall;
};

module.exports = {
    startGame: function() {
        var mapData = require('./maps/basic.json'),
            terrainLayer = World.createLayer(),
            playerLayer = World.createLayer(),
            clientData = {};

        for (var layerName in mapData) {
            var layer = (layerName === 'terrain') ? terrainLayer :
                        (layerName === 'player') ? playerLayer : null,
                layerData = mapData[layerName];
            if (layer === null) {
                throw new Error('Invalid layer in map: ' + layerName);
            }

            for (var entityType in layerData) {
                var entities = layerData[entityType],
                    createEntity = function(){};

                switch (entityType) {
                    case 'walls':
                        createEntity = createWall;
                        break;
                }

                for (var i = 0, len = entities.length; i < len; i++) {
                    var newEntity = createEntity(entities[i]);
                    clientData[newEntity.id] = {
                        layer: layerName,
                        components: newEntity.components
                    };
                }
            }
        }

        return JSON.stringify(clientData);
    }
};