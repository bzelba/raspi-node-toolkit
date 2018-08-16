/**
 * This file is just for testing, do not use.
 */
import rpio = require('rpio');
import {JQC3FF} from "./JQC3FF";
import {HYSRF05} from "./HYSRF05";
import {HCSR501} from "./HCSR501";

rpio.init({
    gpiomem: false,          /* Use /dev/gpiomem */
    mapping: 'gpio',    /* Use the P1-P40 numbering scheme */
    mock: undefined,        /* Emulate specific hardware in mock mode */
});

const hcsr501 = new HCSR501(19);
hcsr501.read((movementDetected:boolean, seconds:number) => {
    if (movementDetected) {
        console.log('No movement ' + seconds + 's');
    } else {
        console.log('Moved for ' + seconds + 's');
    }
});
