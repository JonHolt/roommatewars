'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    QuadTree = require('psykick2d').Helpers.QuadTree,

    ComponentUpdater = require('../component-updater.js'),

    BULLET_ROTATION = 10;

/**
 * Determines if two objects are colliding
 * @param {RectPhysicsBody} a
 * @param {RectPhysicsBody} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + a.h,
        leftA = a.x,
        rightA = a.x + a.w,

        topB = b.y,
        bottomB = b.y + b.h,
        leftB = b.x,
        rightB = b.x + b.w,

        verticalIntersect = (topA <= bottomB && bottomA >= bottomB) ||
            (topB <= bottomA && bottomB >= bottomA),
        horizontalIntersect = (leftA <= rightB && rightA >= rightB) ||
            (leftB <= rightA && rightB >= rightA);

    return (verticalIntersect && horizontalIntersect);
}

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

Physics.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        this._tree.addEntity(entity);
        return true;
    } else {
        return false;
    }
};

Physics.prototype.removeEntity = function(entity) {
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        this._tree.removeEntity(entity);
        return true;
    } else {
        return false;
    }
};

Physics.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            body = entity.getComponent('RectPhysicsBody'),
            spriteSheet = entity.getComponent('SpriteSheet'),
            isBullet = spriteSheet === 'Bullet',
            layerName = (spriteSheet === 'Wall') ? 'terrain' : 'player';
        if (layerName === 'terrain') {
            continue;
        }

        if (isBullet) {
            body.rotation += BULLET_ROTATION * delta;
            ComponentUpdater.updateEntity(entity, layerName, {
                Rectangle: {
                    rotation: body.rotation
                }
            });
        }

        var oldPosition = {
                x: body.x,
                y: body.y
            },
            newPosition = {};

        this._tree.moveEntity(entity, body.velocity);

        if (body.solid) {
            var collisions = this._tree.getCollisions(entity, body);
            if (isBullet && collisions.length > 0) {
                this.removeEntity(entity);
                ComponentUpdater.kill(entity);
                continue;
            }
            for (var j = 0, len2 = collisions.length; j < len2; j++) {
                var other = collisions[j],
                    otherBody = other.getComponent('RectPhysicsBody'),
                    sides = {
                        left: body.x,
                        right: body.x + body.w,
                        top: body.y,
                        bottom: body.y + body.h
                    },
                    otherSides = {
                        left: otherBody.x,
                        right: otherBody.x + otherBody.w,
                        top: otherBody.y,
                        bottom: otherBody.y + otherBody.h
                    },
                    verticalIntersection = 0,
                    horizontalIntersection = 0;

                if (sides.bottom > otherSides.top && sides.top < otherSides.top) {
                    verticalIntersection = -(sides.bottom - otherSides.top);
                } else if (otherSides.bottom > sides.top && otherSides.top < sides.top) {
                    verticalIntersection = otherSides.bottom - sides.top;
                }
                if (sides.right > otherSides.left && sides.left < otherSides.left) {
                    horizontalIntersection = -(sides.right - otherSides.left);
                } else if (otherSides.right > sides.left && otherSides.left < sides.left) {
                    horizontalIntersection = otherSides.right - sides.left;
                }

                if (Math.abs(verticalIntersection) < Math.abs(horizontalIntersection)) {
                    horizontalIntersection = 0;
                } else {
                    verticalIntersection = 0;
                }

                this._tree.moveEntity(entity, {
                    x: horizontalIntersection,
                    y: verticalIntersection
                });
            }
        }

        newPosition = {
            x: body.x,
            y: body.y
        };

        if (newPosition.x !== oldPosition.x || newPosition.y !== oldPosition.y) {
            ComponentUpdater.updateEntity(entity, layerName, {
                Rectangle: newPosition
            });
        }
    }
};

module.exports = Physics;