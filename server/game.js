'use strict';

var PlayerManager = require('./player-manager.js'),
    World = require('psykick2d').World,

    Components = {
        SpriteSheet: require('psykick2d').Components.GFX.SpriteSheet,
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
    return wall;
};
var createDestructibleWall = function(data) {
    // Use this until we decide how to do them
    return createWall(data);
};
var createPlayer = function(data) {
    var playerData = null,
        playerCount = 0;
    PlayerManager.forEachPlayer(function(p) {
        if (playerData !== null) {
            return;
        }

        if (p.id === null) {
            playerData = p;
            playerCount += 1;
        }
    });

    var player = World.createEntity(),
        rectComponent = new Components.RectPhysicsBody({
            x: data.x,
            y: data.y,
            w: 32,
            h: 32
        });
    player.addComponent(rectComponent);
    player.addComponentAs(rectComponent, 'Rectangle');
    player.components['SpriteSheet'] = 'Player' + playerCount;
    playerData.id = player.id;
    return player;
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
                    case 'destructibleWalls':
                        createEntity = createDestructibleWall;
                        break;

                    case 'spawnPoints':
                        createEntity = createPlayer;
                        break;
                }

                for (var i = 0, len = entities.length; i < len; i++) {
                    var newEntity = createEntity(entities[i]),
                        components = {};
                    for (var componentName in newEntity.components) {
                        if (componentName === 'RectPhysicsBody') {
                            continue;
                        }

                        var componentData = newEntity.components[componentName];
                        if (componentName === 'Rectangle') {
                            components.Rectangle = {
                                x: componentData.x,
                                y: componentData.y,
                                w: componentData.w,
                                h: componentData.h
                            };
                        } else {
                            components[componentName] = componentData;
                        }
                    }
                    clientData[newEntity.id] = {
                        layer: layerName,
                        components: components
                    };
                }
            }
        }

        PlayerManager.broadcast('start', clientData);
        PlayerManager.forEachPlayer(function(player) {
            player.socket.emit('playerID', player.id);
        });
    }
};