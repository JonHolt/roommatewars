'use strict';

/*
This is for rendering players and buffs. It automatically sets itself to invisible after each draw
so that it will only draw when you tell it to, which should be after diffs have been added.
 */

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders each player and buff in their respective positions.
 *
 * @inherit RenderSystem
 * @constructor
 */
var PlayerRender = function(){
    RenderSystem.call(this);
    this.requiredComponents = ['SpriteSheet','Position'];
}

Helper.inherit(PlayerRender,RenderSystem);

/**
 * Draws each entity's sprite in its repsective position
 * @param c
 */
BackgroundRender.prototype.draw = function(c){
    //TODO make ^^ that happen.
};

module.exports = PlayerRender;