'use strict';

/*
This here code is for taking key input and sending it to the server in question. It will utilize the shit out of the glorious ?: operator.
 */

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    Keys = require('psykick2d').Keys;

/**
 * Sends KeyPresses to server
 * @param sock  socket connected to server
 * @constructor
 */
var KeyPress = function(sock){
    BehaviorSystem.call(this);
    this.socket = sock;
};

Helper.inherit(KeyPress,BehaviorSystem);


KeyPress.prototype.update = function(){
    var sendKeys = {
        w:Helper.isKeyDown(Keys.W),
        a:Helper.isKeyDown(Keys.A),
        s:Helper.isKeyDown(Keys.S),
        d:Helper.isKeyDown(Keys.D),
        left:Helper.isKeyDown(Keys.Left),
        up:Helper.isKeyDown(Keys.Up),
        right:Helper.isKeyDown(Keys.Right),
        down:Helper.isKeyDown(Keys.Down)
    };
    var send = false;
    for(var key in sendKeys){
        if(sendKeys[key]===true){
            send = true;
        }
    }
    if(send){
        this.socket.emit('keys',sendKeys);
    }
};

module.exports = KeyPress;