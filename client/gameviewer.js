var spriteSystem = require('psykick2d').Systems.Render.Sprite;
var world = require('psykick2d').World;
var spriteComponent = require('psykick2d').Components.GFX.SpriteSheet;
var rectangle = require('psykick2d').Components.Shape.Rectangle;


world.init({
	width:900,
	height:600,
	backgroundColor:"#AAA"
});

var Components = {
        SpriteSheet: require('psykick2d').Components.GFX.SpriteSheet,
        RectPhysicsBody: require('psykick2d').Components.Physics.RectPhysicsBody,
        Color: require('psykick2d').Components.GFX.Color
    };

/*	
var layer = world.createLayer();
var sprite = new spriteSystem();
layer.addSystem(sprite);
world.pushLayer(layer);


var player1 = world.createEntity();
var newSprite1 = new spriteComponent({
	src:"../img/Player1.png",
	frameWidth:32,
	frameHeight:32
});

var player2 = world.createEntity();
var newSprite2 = new spriteComponent({
	src:"../img/Player2.png",
	frameWidth:32,
	frameHeight:32
});

var player3 = world.createEntity();
var newSprite3 = new spriteComponent({
	src:"../img/Player3.png",
	frameWidth:32,
	frameHeight:32
});

var player4 = world.createEntity();
var newSprite4 = new spriteComponent({
	src:"../img/Player4.png",
	frameWidth:32,
	frameHeight:32
});

var newRectangle1 = new rectangle({
	x:50,
	y:100,
	w:32,
	h:32
});

var newRectangle2 = new rectangle({
	x:100,
	y:100,
	w:32,
	h:32
});

var newRectangle3 = new rectangle({
	x:150,
	y:100,
	w:32,
	h:32
});

var newRectangle4 = new rectangle({
	x:200,
	y:100,
	w:32,
	h:32
});

player1.addComponent(newSprite1);
player1.addComponent(newRectangle1);

player2.addComponent(newSprite2);
player2.addComponent(newRectangle2);

player3.addComponent(newSprite3);
player3.addComponent(newRectangle3);

player4.addComponent(newSprite4);
player4.addComponent(newRectangle4);

sprite.addEntity(player1);
sprite.addEntity(player4);
sprite.addEntity(player3);
sprite.addEntity(player2);
*/

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
    player.addComponent(rectComponent);
    player.addComponentAs(rectComponent, 'Rectangle');
    player.components['SpriteSheet'] = 'Player' + playerCount;
    //player.components['SpriteSheet'] = 'Bullet';
    playerData.id = player.id;
    return player;
};

// module.exports = {
//    startGame: function() {
        var mapData = require('./roomviewer/testMap.json'),
            terrainLayer = World.createLayer(),
            playerLayer = World.createLayer(),
//            playerInputSystem = new PlayerInput(),
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
//                        playerInputSystem.addEntity(newEntity);
                    }

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

//        playerLayer.addSystem(playerInputSystem);
//        World.pushLayer(playerLayer);

//        PlayerManager.broadcast('start', clientData);
//        PlayerManager.forEachPlayer(function(player) {
//            player.socket.emit('playerID', player.id);
//        });
//    }
//};
