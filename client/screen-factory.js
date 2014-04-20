'use strict';

var World = require('psykick2d').World,

    DrawTextSystem = require('./systems/draw-text.js'),
    DrawRectSystem = require('psykick2d').Systems.Render.ColoredRect,

    Text = require('./components/text.js'),
    Rect = require('psykick2d').Components.Shape.Rectangle,
    Color = require('psykick2d').Components.GFX.Color,

    config = require('./config.json'),
    layers = {};

module.exports = {
    showLobby: function() {
        var lobbyLayer = World.createLayer(),
            titleEntity = World.createEntity(),
            nameEntity = [],

            drawTextSystem = new DrawTextSystem(),
            drawRectSystem = new DrawRectSystem();

        nameEntity.push(World.createEntity());

        var titleComponent = new Text({
            x: 170,
            y: 100,
            font: '50pt Arial',
            color: '#FF9e00',
            text: 'Welcome to Game'
        });
        var nameComponent = new Text({
            x: 450,
            y: 200,
            color: '#Fe9d00',
            text: config.playername
        });
        var rectComponent = new Rect({
            x:350,
            y:180,
            w:20,
            h:20
        });
        var colorComponent = new Color({
            colors:['#F00','#0F0']
        });

        titleEntity.addComponent(titleComponent);
        nameEntity[0].addComponent(nameComponent);
        nameEntity[0].addComponent(rectComponent);
        nameEntity[0].addComponent(colorComponent);

        drawRectSystem.addEntity(nameEntity);
        drawTextSystem.addEntity(titleEntity);
        drawTextSystem.addEntity(nameEntity);

        lobbyLayer.addSystem(drawRectSystem);
        lobbyLayer.addSystem(drawTextSystem);
        layers = {
            lobby : lobbyLayer
        };

        World.pushLayer(lobbyLayer);

        World.addEventListener('afterDraw',function(){
            lobbyLayer.visible = false;
        })
    },

    showGame: function() {

    },

    rollCredits: function() {

    }
};