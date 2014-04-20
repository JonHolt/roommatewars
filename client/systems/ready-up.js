'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem;

/**
 * Sends ready state to server and manages data received from server in lobby state
 * @param {object}  options
 * @param {socket}  options.socket
 * @param {entity}  options.player
 * @constructor
 */
var ReadyUp = function(options){
    BehaviorSystem.call(this);
    this.requiredComponents = ['Color'];
    this.socket = options.socket;
    this.players = [];

    socket.on('lobbyStatus', function (data) {


        lobbyLayer.visible = false;
     });
};

Helper.inherit(ReadyUp,BehaviorSystem);

