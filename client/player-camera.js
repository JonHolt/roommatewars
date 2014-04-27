/**
 * Created by Jonathan on 4/22/14.
 */
'use strict';

/*
This will translate the camera where it needs to be... Hopefully.
 */

var PlayerCam = function(playerRect){
    this.player = playerRect;
    this.x = 0;
    this.y = 0;
    this.scale = 1.2;
};

PlayerCam.prototype.render = function(c){
    //450 is half the width of the screen
    this.x = -this.player.x + (450 / this.scale) - (this.player.w / 2);
    //300 is half the height
    this.y = -this.player.y + (300 / this.scale) - (this.player.h / 2);

    c.scale(this.scale, this.scale);
    c.translate(this.x, this.y);
    //console.log(this.x + ','+ this.y);
};

module.exports = PlayerCam;