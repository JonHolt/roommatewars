'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    QuadTree = require('psykick2d').Helpers.QuadTree,

    ComponentUpdater = require('../component-updater.js');

var Physics = function() {
    BehaviorSystem.call(this);
    this.requiredComponents = ['RectPhysicsBody'];
    this._tree = new QuadTree({
        x: 0,
        y: 0,
        w: 900,
        h: 600,
        cellSize: 120
    });
};

Helper.inherit(Physics, BehaviorSystem);

Physics.prototype.update = function() {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            rect = entity.getComponent('RectPhysicsBody'),
            layerName = 'player'; // Check if it's on the terrain layer later

        rect.x += rect.velocity.x;
        rect.y += rect.velocity.y;

        var changes = null;
        if (rect.velocity.x !== 0) {
            changes = {};
            changes.Rectangle = {
                x: rect.x
            };
        }
        if (rect.velocity.y !== 0) {
            changes = changes || {};
            changes.Rectangle = changes.Rectangle || {};
            changes.Rectangle.y = rect.y;
        }

        if (changes !== null) {
            ComponentUpdater.updateEntity(entity, layerName, changes);
        }
    }
};

module.exports = Physics;