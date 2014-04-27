'use strict';

var Helper = require('psykick2d').Helper,
    PlayerManager = require('./player-manager.js');

var data = {},
    dirty = false;

var ComponentUpdater = {
    /**
     *
     * @param {Entity} entity       Entity that changed
     * @param {string} layerName    Name of the Layer it's on
     * @param {object} changes      Changes to it's components
     */
    updateEntity: function(entity, layerName, changes) {
        dirty = true;
        var entityData = data[entity.id] = data[entity.id] || {};
        entityData.layer = layerName;
        entityData.components = Helper.defaults(changes, entityData.components);
    },

    /**
     * Sends out the updates to each of the players
     */
    emit: function() {
        if (!dirty) {
            return;
        }

        console.log(data);
        PlayerManager.forEachPlayer(function(player) {
            player.socket.emit('update', data);
        });

        dirty = false;
        data = {};
    }
};

module.exports = ComponentUpdater;