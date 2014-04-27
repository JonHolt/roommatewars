'use strict';

var BehaviorSystem = require('psykick2d').BehaviorSystem,
    Helper = require('psykick2d').Helper,
    Game = require('./../game.js'),

    PlayerManager = require('../player-manager.js');

var PlayerInput = function() {
    BehaviorSystem.call(this);
};

Helper.inherit(PlayerInput, BehaviorSystem);

PlayerInput.prototype.update = function(delta) {
    var self = this,
        SPEED = 5;
    PlayerManager.forEachPlayer(function(player) {
        var entity = self.entities[player.id],
            rectComponent = entity.getComponent('RectPhysicsBody'),
            emitData = {};

        if (player.keys.left) {
            rectComponent.rotation -= SPEED * Math.PI / 180;
        }
        if (player.keys.right) {
            rectComponent.rotation += SPEED * Math.PI / 180;
        }
        //Manage shooting bullets after rotation is established
        /*if(player.cooldown > 0){
         player.cooldown -= delta;
         } else if(player.keys.w){
         player.cooldown = 1;
         Game.addBullet(rectComponent)
         }*/

        var direction = null,
            deltaX = 0,
            deltaY = 0;
        if (player.keys.up && !player.keys.down) {
            direction = rectComponent.rotation;
        }
        if (player.keys.down && !player.keys.up) {
            direction = rectComponent.rotation + Math.PI;
        }

        if (direction !== null) {
            if (player.keys.a && !player.keys.d) {
                direction -= Math.PI / 4;
            }
            if (player.keys.d && !player.keys.a) {
                direction += Math.PI / 4;
            }

            deltaX = Math.cos(direction) * SPEED;
            deltaY = Math.sin(direction) * SPEED;
        } else {
            if (player.keys.a && !player.keys.d) {
                direction = rectComponent.rotation - Math.PI / 2;
            }
            if (player.keys.d && !player.keys.a) {
                direction = rectComponent.rotation + Math.PI / 2;
            }

            if (direction !== null) {
                deltaX = Math.cos(direction) * SPEED;
                deltaY = Math.sin(direction) * SPEED;
            } else {
                rectComponent.velocity.x = 0;
                rectComponent.velocity.y = 0;
            }
        }

        rectComponent.velocity.x = deltaX;
        rectComponent.velocity.y = deltaY;

        emitData[player.id] = {
            layer: 'player',
            components: {
                Rectangle: {
                    x: rectComponent.x,
                    y: rectComponent.y,
                    rotation: rectComponent.rotation
                }
            }
        };

        player.socket.emit('update', emitData);
    });
};

module.exports = PlayerInput;