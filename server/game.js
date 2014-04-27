'use strict';

var ComponentUpdater = require('./component-updater.js'),
    PlayerManager = require('./player-manager.js'),
    World = require('psykick2d').World,

    PlayerInput = require('./systems/player-input.js'),
    Physics = require('./systems/physics.js'),

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

var oldUpdate = World.update;
World.update = function(delta) {
    oldUpdate.call(World, delta);
    ComponentUpdater.emit();
};

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
        });
    rectComponent.rotation = 0;
    wall.addComponent(rectComponent);
    wall.addComponentAs(rectComponent, 'Rectangle');
    wall.components['SpriteSheet'] = 'Wall';
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
    rectComponent.rotation = 0;
    player.addComponent(rectComponent);
    player.addComponentAs(rectComponent, 'Rectangle');
    player.components['SpriteSheet'] = 'Player' + playerCount;
    console.log(PlayerManager._players);
    playerData.id = player.id;
    return player;
};

module.exports = {
    startGame: function() {
        World.reset();
        var mapData = require('./maps/basic.json'),
            terrainLayer = World.createLayer(),
            playerLayer = World.createLayer(),
            playerInputSystem = new PlayerInput(),
            physicsSystem = new Physics(),
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

                    if (entityType === 'spawnPoints') {
                        playerInputSystem.addEntity(newEntity);
                    }
                    physicsSystem.addEntity(newEntity);

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

        playerLayer.addSystem(playerInputSystem);
        terrainLayer.addSystem(physicsSystem);
        playerLayer.addSystem(physicsSystem);
        World.pushLayer(terrainLayer);
        World.pushLayer(playerLayer);

        PlayerManager.broadcast('start', clientData);
        PlayerManager.forEachPlayer(function(player) {
            player.socket.emit('playerID', player.id);
        });
    }
};
