'use strict';

var Helper = require('psykick2d').Helper,
    RenderSystem = require('psykick2d').RenderSystem;

/**
 * Renders some static text
 *
 * @inherit RenderSystem
 * @constructor
 */
var DrawText = function(){
    RenderSystem.call(this);
    this.requiredComponents = ['Text'];
};

Helper.inherit(DrawText, RenderSystem);



DrawText.prototype.draw = function(c){
    for(var i = 0, len = this.drawOrder.length; i < len; i++){
        var entity = this.drawOrder[i],
            text = entity.getComponent('Text');

        c.save();
        c.translate(text.x, text.y);
        c.font = text.font;
        c.fillStyle = text.color;
        c.fillText(text.text,0,0);
        c.restore();
    }
}

module.exports = DrawText;