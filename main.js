"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var rpio = require("rpio");
rpio.init({
    gpiomem: false,
    mapping: 'gpio',
    mock: undefined,
});
var sonic_sensor = new SonicSensor({
    trig: 19,
    echo: 26
}, function (sensor) {
    console.log(sensor.distance + 'cm');
});
//sonic_sensor.start();
var relay = new JQC3FF(21);
/**
while(true) {
    relay.open();
    console.log('Open');
    rpio.msleep(1000);
    relay.close();
    console.log('Close');
    rpio.msleep(1000);
}*/
var motionSensor = new HCSR501(19);
motionSensor.read(function (isDetected, seconds) {
    if (isDetected) {
        console.log('No movement ' + seconds + 's');
        //console.log('Bewegung erkannt');
    }
    else {
        console.log('Moved for ' + seconds + 's');
        //console.log('Bereit...');
    }
});
