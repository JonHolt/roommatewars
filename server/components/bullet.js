'use strict';

var Helper = require('psykick2d').Helper,
    Component = require('psykick2d').Component;

var Bullet = function(options){
    this.NAME = 'Bullet';

    var defaults = {
        damage: 0,
        playerID: 0
    }

    options = Helper.defaults(options,defaults);
    this.damage = options.damage;
    this.playerID = options.playerID;
};

Helper.inherit(Bullet,Component);

module.exports = Bullet;