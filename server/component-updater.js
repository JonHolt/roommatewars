'use strict';

var PlayerManager = require('./player-manager.js');

function merge(obj, changes) {
    for (var key in changes) {
        obj[key] = changes[key];
    }
    return obj;
}

var data = {},
    heavenMessage = {},
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

    kill: function(entity) {
        dirty = true;
        if (data[entity.id]) {
            delete data[entity.id];
        }

        heavenMessage[entity.id] = 'dead';
    },

    /**
     * Sends out the updates to each of the players
     */
    emit: function() {
        if (!dirty) {
            return;
        }

        PlayerManager.forEachPlayer(function(player) {
            if (Object.keys(heavenMessage).length > 0) {
                player.socket.emit('heaven', heavenMessage);
            }
            player.socket.emit('update', data);
        });

        dirty = false;
        data = {};
        heavenMessage = {};
    }
};

module.exports = ComponentUpdater;