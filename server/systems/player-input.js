'use strict';

var BehaviorSystem = require('psykick2d').BehaviorSystem,
    Helper = require('psykick2d').Helper,

    PlayerManager = require('../player-manager.js'),
    ComponentUpdater = require('../component-updater.js');

var PlayerInput = function() {
    BehaviorSystem.call(this);
};

Helper.inherit(PlayerInput, BehaviorSystem);

PlayerInput.prototype.update = function() {
    var self = this,
        SPEED = 5;
    PlayerManager.forEachPlayer(function(player) {
        var entity = self.entities[player.id],
            rectComponent = entity.getComponent('RectPhysicsBody');

        if (player.keys.left) {
            rectComponent.rotation -= SPEED * Math.PI / 180;
            ComponentUpdater.updateEntity(entity, 'player', {
                Rectangle: {
                    rotation: rectComponent.rotation
                }
            });
        }
        if (player.keys.right) {
            rectComponent.rotation += SPEED * Math.PI / 180;
            ComponentUpdater.updateEntity(entity, 'player', {
                Rectangle: {
                    rotation: rectComponent.rotation
                }
            });
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
                deltaX = Math.cos(direction) * 2 * SPEED;
                deltaY = Math.sin(direction) * 2 * SPEED;
            } else {
                rectComponent.velocity.x = 0;
                rectComponent.velocity.y = 0;
            }
        }

        rectComponent.velocity.x += deltaX;
        if(rectComponent.velocity.x > SPEED){
            rectComponent.velocity.x = SPEED;
        } else if (rectComponent.velocity.x < -SPEED){
            rectComponent.velocity.x = -SPEED;
        }
        rectComponent.velocity.y += deltaY;
        if(rectComponent.velocity.y > SPEED){
            rectComponent.velocity.y = SPEED;
        } else if (rectComponent.velocity.y < -SPEED){
            rectComponent.velocity.y = -SPEED;
        }
    });
};

module.exports = PlayerInput;