"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rpio = require("rpio");
/**
 * Used to work with infrared motion sensor HC-SR501.
 */
var HCSR501 = /** @class */ (function () {
    function HCSR501(gpio_pin, skip_init) {
        if (skip_init === void 0) { skip_init = false; }
        // Pin to use for data reading.
        this.gpio_pin = null;
        // Check every x milliseconds
        this.sensor_check_delay = 50;
        // Wait x ms to init the sensor
        this.sensor_init_time = 500;
        this.gpio_pin = gpio_pin;
        skip_init && this.init();
    }
    /**
     * Init the sensor for usage.
     */
    HCSR501.prototype.init = function () {
        rpio.open(this.gpio_pin, rpio.INPUT);
        rpio.msleep(this.sensor_init_time);
        // Init sensor
        while (rpio.read(this.gpio_pin) != 0) {
            rpio.msleep(this.sensor_check_delay);
        }
    };
    /**
     * Read the incoming signal permanently,
     * use callback to use the output as you like.
     *
     * @param callback Pass a callback to use the retrieved data.
     */
    HCSR501.prototype.read = function (callback) {
        var movementDetected = false;
        var gpioState = false;
        var timePassed = 0;
        while (true) {
            gpioState = rpio.read(this.gpio_pin);
            if (!movementDetected && gpioState) {
                // Movement detected
                movementDetected = true;
                callback(movementDetected, timePassed / 1000);
                timePassed = 0;
            }
            else {
                if (!gpioState && movementDetected) {
                    // Movement stopped
                    movementDetected = false;
                    callback(movementDetected, timePassed / 1000);
                    timePassed = 0;
                }
            }
            rpio.msleep(this.sensor_check_delay);
            timePassed += this.sensor_check_delay;
        }
    };
    return HCSR501;
}());
exports.HCSR501 = HCSR501;
