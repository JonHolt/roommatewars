'use strict';

var Helper = require('psykick2d').Helper,
    Component = require('psykick2d').Component;

var PlayerInfo = function(options){
    this.NAME = 'PlayerInfo';

    var defaults = {
        damage: 10,
        health: 110
    }

    options = Helper.defaults(options,defaults);
    this.damage = options.damage;
    this.health = options.health;
};

Helper.inherit(PlayerInfo,Component);

module.exports = PlayerInfo;