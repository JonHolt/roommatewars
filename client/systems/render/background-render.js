'use strict';

/*
 This is for rendering statics like background walls and destructible walls. It automatically sets itself to invisible after each draw
 so that it will only draw when you tell it to, which should be after diffs have been added.
 */
var Helper = require('psykick2d').Helper,
    Sprite = require('psykick2d').Systems.Render.Sprite;

/**
 * Renders a background image for performance
 *
 * @param layer the parent layer of this system.
 * @inherit RenderSystem
 * @constructor
 */
var BackgroundRender = function(layer){
    Sprite.call(this);
    this.layer = layer;
    this.camera =  null;
    this.dirty = true;
    this.fakeCanvas =  document.createElement('canvas');
    this.fakeCanvas.width = 900;
    this.fakeCanvas.height = 600;
    this.fakeCtx = this.fakeCanvas.getContext('2d');
}

Helper.inherit(BackgroundRender,Sprite);

/**
 * Sets up and image for the static background at first, then just
 * translates that image when the camera moves. Will re-render the image
 * when destructible terrain has changed state.
 * @param c
 */
BackgroundRender.prototype.draw = function(c){
    if(!this.camera){
        return;
    }
    if(this.dirty){
        //update the fakecanvas set dirty false;
        Sprite.prototype.draw.call(this,this.fakeCtx);
        this.pattern = c.createPattern(this.fakeCanvas, 'no-repeat');
        this.dirty = false;
    }
    c.save();
    c.scale(this.camera.scale,this.camera.scale);
    c.fillStyle = this.pattern;
    c.fillRect(this.camera.x,this.camera.y,900,600);
    c.restore();
    this.layer.visible = false;
};

module.exports = BackgroundRender;