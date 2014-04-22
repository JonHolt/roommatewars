'use strict';

var World = require('psykick2d').World,
    Helper = require('psykick2d').Helper,
    Component = require('psykick2d').Component,

    terrainLayer = World.createLayer(),
    playerLayer = World.createLayer();

module.exports = {
    showLobby: function(sock) {

    },

    showGame: function(sock) {

        sock.on('start',function(data){
            var len = Object.keys(data).length;
            for(var i = 0; i < len; i++){
                var addEntity = World.createEntity();
                if(data[addEntity.id]){
                    var entityData = data[addEntity.id];
                    for(var key in entityData.components){
                        var addComponent = new Component();
                        addComponent = Helper.defaults(addComponent, entityData.components[key]);
                        addEntity.addComponent(addComponent);
                    }
                    if(entityData.layer === 'terrain'){
                        terrainLayer.addEntity(addEntity); //Change this to add to system instead
                    } else if(entityData.layer === 'player'){
                        playerLayer.addEntity(addEntity); //Change these to add to systems instead
                    } else {
                        throw new Error('Unexpected Layer '+ entityData.layer);
                    }
                } else {
                    throw new Error('Did not receive Entity from server by id '+addEntity.id);
                }
            }
        });
    },

    rollCredits: function() {

    }
};

//Notes:
// var component = new Component();
// component = Helper.defaults(component, componentData);