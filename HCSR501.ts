import rpio = require('rpio');

/**
 * Used to work with infrared motion sensor HC-SR501.
 */
export class HCSR501 {
    // Pin to use for data reading.
    gpio_pin:number = null;

    // Check every x milliseconds
    sensor_check_delay:number = 50;

    // Wait x ms to init the sensor
    sensor_init_time:number = 500;

    constructor(gpio_pin:number, skip_init:boolean = false) {
        this.gpio_pin = gpio_pin;
        skip_init && this.init();
    }

    /**
     * Init the sensor for usage.
     */
    private init() {
        rpio.open(this.gpio_pin, rpio.INPUT);
        rpio.msleep(this.sensor_init_time);

        // Init sensor
        while(rpio.read(this.gpio_pin) != 0) {
            rpio.msleep(this.sensor_check_delay);
        }
    }

    /**
     * Read the incoming signal permanently,
     * use callback to use the output as you like.
     *
     * @param callback Pass a callback to use the retrieved data.
     */
    public read(callback:(state:boolean,delay:number) => void) {
        let movementDetected:boolean = false;
        let gpioState:boolean = false;
        let timePassed:number = 0;

        while(true) {
            gpioState = rpio.read(this.gpio_pin);

            if (!movementDetected && gpioState) {
                // Movement detected
                movementDetected = true;
                callback(movementDetected, timePassed/1000);
                timePassed = 0;
            } else {
                if(!gpioState && movementDetected) {
                    // Movement stopped
                    movementDetected = false;
                    callback(movementDetected, timePassed/1000);
                    timePassed = 0;
                }
            }
            rpio.msleep(this.sensor_check_delay);
            timePassed += this.sensor_check_delay;
        }
    }
}
