'use strict';

var BehaviorSystem = require('psykick2d').BehaviorSystem,
    Helper = require('psykick2d').Helper,

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

        if (player.keys.a) {
            rectComponent.rotation -= SPEED * Math.PI / 180;
        }
        if (player.keys.d) {
            rectComponent.rotation += SPEED * Math.PI / 180;
        }

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
            if (player.keys.left && !player.keys.right) {
                direction -= Math.PI / 4;
            }
            if (player.keys.right && !player.keys.left) {
                direction += Math.PI / 4;
            }

            deltaX = Math.cos(direction) * SPEED;
            deltaY = Math.sin(direction) * SPEED;
        } else {
            if (player.keys.left && !player.keys.right) {
                direction = rectComponent.rotation - Math.PI / 2;
            }
            if (player.keys.right && !player.keys.left) {
                direction = rectComponent.rotation + Math.PI / 2;
            }

            if (direction !== null) {
                deltaX = Math.cos(direction) * SPEED;
                deltaY = Math.sin(direction) * SPEED;
            }
        }

        rectComponent.x += deltaX;
        rectComponent.y += deltaY;

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