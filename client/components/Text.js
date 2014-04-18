/**
 * Created by Jonathan on 4/18/14.
 */
"use strict";

var Component = require('psykick2d').Component,
    Helper = require('psykick2d').Helper;

/**
 * Text Component for showing static text/menu text
 * @param {object}  options
 * @param {number}  options.x
 * @param {number}  options.y
 * @param {string}  options.size
 * @param {string}  options.color
 * @param {string}  options.text
 * @constructor
 */
var Text = function(options){
    this.NAME = 'Text';

    var defaults = {
        x:0,
        y:0,
        size:'12px',
        color:'#FFF',
        text:'Your resident game designer failed to provide you with a message to put here.'
    }

    options = Helper.defaults(options,defaults);
    this.x = options.x;
    this.y = options.y;
    this.color = options.color;
    this.text = options.text;
}

Helper.inherit(Text,Component);
module.exports = Text;