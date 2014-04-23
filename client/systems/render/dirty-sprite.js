/**
 * Created by Jonathan on 4/22/14.
 */
'use strict';
/*
Inherits from sprite, but it marks itself as invisible when done drawing so that it will only be redrawn when marked visible or 'dirty'
 */

var Helper = require('psykick2d').Helper,
    Sprite = require('psykick2d').Systems.Render.Sprite;


var DirtySprite = function(layer){
    Sprite.call(this);
    this.layer = layer;
}

Helper.inherit(DirtySprite,Sprite);

DirtySprite.prototype.draw = function(c){
    Sprite.draw.call(this,c);
    this.layer.visible = false;
};