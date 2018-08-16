"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var rpio = require("rpio");
var HCSR501_1 = require("./HCSR501");
rpio.init({
    gpiomem: false,
    mapping: 'gpio',
    mock: undefined,
});
var hcsr501 = new HCSR501_1.HCSR501(19);
hcsr501.read(function (movementDetected, seconds) {
    if (movementDetected) {
        console.log('No movement ' + seconds + 's');
    }
    else {
        console.log('Moved for ' + seconds + 's');
    }
});
