'use strict';

var World = require('psykick2d').World,
    Helper = require('psykick2d').Helper,
    Component = require('psykick2d').Component,
    SpriteSheet = require('psykick2d').Components.GFX.SpriteSheet;


module.exports = {
    copyComponent: function(copyTo,copyFrom){
        for(var key in copyFrom){
            copyTo[key] = copyFrom[key];
        }
    },

    showLobby: function(sock) {

    },

    showGame: function(sock) {

        var terrainLayer = World.createLayer(),
            playerLayer = World.createLayer(),

            DirtySprite = require('psykick2d').Systems.Render.Sprite,
            //ColoredRect = require('psykick2d').Systems.Render.ColoredRect,
            playerDrawSystem = new DirtySprite(playerLayer),
            BackGround = require('./systems/render/background-render.js'),
            backgroundDrawSystem = new DirtySprite(terrainLayer),
            KeySendSystem = require('./systems/behavior/key-press.js'),

            PlayerCam = require('./player-camera.js');

        //create reusable SpriteSheet components;

        var sprites = {};
        sprites['Player1'] = new SpriteSheet({
            src:'./img/Player1.png',
            width: 32,
            height: 32,
            frameWidth: 32,
            frameHeight:32
        });
        sprites['Player2'] = new SpriteSheet({
            src:'./img/Player2.png',
            width: 32,
            height: 32,
            frameWidth: 32,
            frameHeight:32
        });
        sprites['Player3'] = new SpriteSheet({
            src:'./img/Player3.png',
            width: 32,
            height: 32,
            frameWidth: 32,
            frameHeight:32
        });
        sprites['Player4'] = new SpriteSheet({
            src:'./img/Player4.png',
            width: 32,
            height: 32,
            frameWidth: 32,
            frameHeight:32
        });
        sprites['Wall'] = new SpriteSheet({
            src:'./img/Wall.png',
            width: 32,
            height: 32,
            frameWidth: 32,
            frameHeight:32
        });
        sprites['Bullet'] = new SpriteSheet({
            src:'./img/Bullet.png',
            width: 220,
            height: 330,
            frameWidth: 220,
            frameHeight:330
        });
        sprites['Wall'].repeat = 'repeat';

        //initialize the game state with information from the server.
        sock.on('start',function(data){
            var len = Object.keys(data).length;
            for(var key in data){
                var addEntity = new Entity(key|0);
                var entityData = data[key];
                for(var compKey in entityData.components){
                    if(compKey === 'SpriteSheet'&&sprites[entityData.components[compKey]]){
                        addEntity.addComponentAs(sprites[entityData.components[compKey]],compKey);
                    } else {
                        var addComponent = new Component();
                        addComponent = this.copyComponent(addComponent, entityData.components[compKey]);
                        addEntity.addComponentAs(addComponent,compKey);
                    }
                }
                if(entityData.layer === 'terrain'){
                    backgroundDrawSystem.addEntity(addEntity);
                } else if(entityData.layer === 'player'){
                    playerDrawSystem.addEntity(addEntity);
                } else {
                    throw new Error('Unexpected Layer '+ entityData.layer);
                }
            }
            terrainLayer.addSystem(backgroundDrawSystem);
            playerLayer.addSystem(playerDrawSystem);
            playerLayer.addSystem(new KeySendSystem(sock));
            World.pushLayer(terrainLayer);
            World.pushLayer(playerLayer);
        });

        //update the game state using the diffs from the server
        sock.on('update',function(data){
            for(var key in data){
                var components = data[key].components;
                if(data[key].layer === 'terrain'){
                    var changeEntity = backgroundDrawSystem.entities[key];
                    for(var comp in components){
                        var changeComponent = changeEntity.getComponent(comp);
                        changeComponent = this.copyComponent(changeComponent, components[comp]);
                    }
                    terrainLayer.visible = true;
                } else if(data[key].layer === 'player'){
                    var changeEntity = playerDrawSystem.entities[key];
                    for(var comp in components){
                        var changeComponent = changeEntity.getComponent(comp);
                        changeComponent = this.copyComponent(changeComponent, components[comp]);
                    }
                    playerLayer.visible = true;
                    terrainLayer.visible = true;
                } else {
                    throw new Error('Unexpected Layer '+ data[key].layer);
                }
            }
        });

        //update the living and dead entities
        sock.on('heaven',function(data){
            for(var key in data){
                if(data[key]==='dead'){
                    playerDrawSystem.removeEntity(key);
                    backgroundDrawSystem.removeEntity(key);
                    //kill from animation system too.
                }else{
                    var newEntity = new Entity(key|0),
                        entityData = data[key];

                    for(var compKey in entityData.components){
                        if(compKey === 'SpriteSheet'&&sprites[entityData.components[compKey]]){
                            newEntity.addComponentAs(sprites[entityData.components[compKey]],compKey);
                        } else {
                            var addComponent = new Component();
                            addComponent = this.copyComponent(addComponent, entityData.components[compKey]);
                            newEntity.addComponentAs(addComponent,key);
                        }
                    }
                    if(entityData.layer === 'terrain'){
                        backgroundDrawSystem.addEntity(newEntity);
                    } else if(entityData.layer === 'player'){
                        playerDrawSystem.addEntity(newEntity);
                    } else {
                        throw new Error('Unexpected Layer '+ entityData.layer);
                    }
                }
            }
        });

        //An event to find out who I am
        sock.on('playerID',function(data){
            var player = playerDrawSystem.entities[data];
            var cam = new PlayerCam(player.getComponent('Rectangle'));
            playerLayer.camera = cam;
            terrainLayer.camera = cam;
            //backgroundDrawSystem.camera = cam;
        });
    },

    rollCredits: function() {

    }
};

//Notes: