'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,
    Keys = require('psykick2d').Keys;

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
    var suckMyDickYouStupidPieceOfShit = options.player.getComponent('Text').text;
    this.localPlayer = fixME;
    this.players = {
        fixME :{
            entity:options.player,
            ready: false
        }
    };
    this.players[fixME] = {
        entity: options.player,
        ready: false
    };

    //Somehow have to add new entities to text and rect draw systems. Fuck me right?

    this.socket.on('lobbyStatus', function (data) {
        for(var key in data){
            if(this.players[key]){
                this.players[key].ready = data[key];
            } else {
                //add a new entity with the players info and add it to the text and rect draw systems.
            }
        }
        lobbyLayer.visible = true;
    });
    this.socket.on('disconnect',function(data){
        //do shit here
    });
};

Helper.inherit(ReadyUp,BehaviorSystem);

ReadyUp.prototype.update = function(delta){
    if(Helper.isKeyDown(Keys.Space)){
        this.players[this.localPlayer].ready = !this.players[this.localPlayer].ready;
        var color = this.players[this.localPlayer].entity.getComponent('Color');
        color.colors.reverse();
        this.socket.emit('readyState',{
            name:this.localPlayer,
            readyState:this.players[this.localPlayer].ready
        })
    }
}

module.exports = ReadyUp;