# raspi-node-toolkit
A small node toolkit for raspi modules like sensors, relays etc.  
This toolkit does make use of https://github.com/jperkin/node-rpio

## Install
```
npm install garlian/raspi-node-toolkit
```

## How to use
1. Get the name or type of your module e.g. HY-SRF05 (Ultra Sonic Sensor)
2. Use the instance of the class (classname is always capital letter no special chars: HYSRF05), check constructor for needed params (mostly gpio pin)
3. Happy tinker :D

## Supported Modules
Use this list to check if your module is supported, this list will grow over time.


### Sensors
* HY-SRF05 (Distance)
```js
// Sonic Sensor usage:
const hysrf05 = new HYSRF05(
    {
        trig:19,
        echo:26
    },
    (sensor:any) => {
        console.log(sensor.distance + 'cm');
    }
);

hysrf05.start();
```
* HC-SR501 (Motion)
```js
// Using infrared motion sensor
const hcsr501 = new HCSR501(19);
hcsr501.read((movementDetected:boolean, seconds:number) => {
    if (movementDetected) {
        console.log('No movement ' + seconds + 's');
    } else {
        console.log('Moved for ' + seconds + 's');
    }
});
```

### Actors
* JQC-3FF (Relay)
```js
// Turn relay on/off each second
const jqc3ff = new JQC3FF(21);

while(true) {
    jqc3ff.open();
    console.log('Open');
    rpio.msleep(1000);
    jqc3ff.close();
    console.log('Close');
    rpio.msleep(1000);
}
```

### TODO
* Improving overall code quality
* Adding more libraries