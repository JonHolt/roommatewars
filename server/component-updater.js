'use strict';

var PlayerManager = require('./player-manager.js');

function merge(obj, changes) {
    for (var key in changes) {
        obj[key] = changes[key];
    }
    return obj;
}

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
        entityData.components = entityData.components || {};
        for (var key in changes) {
            entityData.components[key] = entityData.components[key] || {};
            merge(entityData.components[key], changes[key]);
        }
    },

    /**
     * Sends out the updates to each of the players
     */
    emit: function() {
        if (!dirty) {
            return;
        }

        PlayerManager.forEachPlayer(function(player) {
            player.socket.emit('update', data);
        });

        dirty = false;
        data = {};
    }
};

module.exports = ComponentUpdater;