/**
 *
 */
import rpio = require('rpio');

rpio.init({
    gpiomem: false,          /* Use /dev/gpiomem */
    mapping: 'gpio',    /* Use the P1-P40 numbering scheme */
    mock: undefined,        /* Emulate specific hardware in mock mode */
});

const sonic_sensor = new SonicSensor(
    {
        trig:19,
        echo:26
    },
    (sensor:any) => {
        console.log(sensor.distance + 'cm');
    }
);
//sonic_sensor.start();

const relay = new JQC3FF(21);

/**
while(true) {
    relay.open();
    console.log('Open');
    rpio.msleep(1000);
    relay.close();
    console.log('Close');
    rpio.msleep(1000);
}*/

const motionSensor = new HCSR501(19);
motionSensor.read((isDetected:boolean, seconds:number) => {
    if (isDetected) {
        console.log('No movement ' + seconds + 's');
        //console.log('Bewegung erkannt');
    } else {
        console.log('Moved for ' + seconds + 's');
        //console.log('Bereit...');
    }
});
