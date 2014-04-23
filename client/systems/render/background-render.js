'use strict';

/*
 This is for rendering statics like background walls and destructible walls. It automatically sets itself to invisible after each draw
 so that it will only draw when you tell it to, which should be after diffs have been added.
 */
var Helper = require('psykick2d').Helper,
    RenderSystem = require('psykick2d').RenderSystem;

/**
 * Renders a background image for performance
 *
 * @param layer the parent layer of this system.
 * @inherit RenderSystem
 * @constructor
 */
var BackgroundRender = function(layer){
    RenderSystem.call(this);
    this.requiredComponents = ['SpriteSheet','Position'];
    this.layer = layer;
    //this.fakeCanvas = Mike's mom's continuous rolls of back-fat.
}

Helper.inherit(BackgroundRender,RenderSystem);

/**
 * Sets up and image for the static background at first, then just
 * translates that image when the camera moves. Will re-render the image
 * when destructible terrain has changed state.
 * @param c
 */
BackgroundRender.prototype.draw = function(c){
    //TODO make ^^ that happen.


};

module.exports = BackgroundRender;