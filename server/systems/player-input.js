'use strict';

var BehaviorSystem = require('psykick2d').BehaviorSystem,
    Helper = require('psykick2d').Helper,

    PlayerManager = require('../player-manager.js');

var PlayerInput = function() {
    BehaviorSystem.call(this);
};

Helper.inherit(PlayerInput, BehaviorSystem);

PlayerInput.prototype.update = function(delta) {
    var self = this;
    PlayerManager.forEachPlayer(function(player) {
        var entity = self.entities[player.id],
            rectComponent = entity.getComponent('RectPhysicsBody');

        if (player.keys.up) {
            rectComponent.y -= 1;
            var emitData = {};
            emitData[player.id] = {
                layer: 'player',
                components: {
                    Rectangle: {
                        y: rectComponent.y
                    }
                }
            };

            player.socket.emit('update', emitData);
        }
    });
};

module.exports = PlayerInput;