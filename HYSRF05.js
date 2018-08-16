"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rpio = require("rpio");
/**
 * Designed to work with Ultra Sonic Sensor HY-SRF05,
 * This is an easy to use interface to get some raw data.
 */
var HYSRF05 = /** @class */ (function () {
    function HYSRF05(gpio_pins, loop) {
        if (loop === void 0) { loop = null; }
        // How long to wait until signal is marked as lost?
        this.signal_ttl = 500;
        // Maximum measurement range in cm, official maximum is 450cm
        this.max_range = 450;
        // Time distance between measurements in milliseconds, official maximum is 50ms!
        this.measure_delay = 50;
        this.is_measuring = false;
        // Pins to use for sensor.
        this.gpio_pins = {
            trig: 0,
            echo: 0
        };
        this.gpio_pins = gpio_pins;
        this.loop = loop;
        this.init();
    }
    HYSRF05.prototype.start = function () {
        this.is_measuring = true;
        // Start measuring
        while (this.is_measuring) {
            this.measureDistance();
            typeof this.loop == "function" && this.loop(this);
            rpio.msleep(this.measure_delay);
        }
    };
    HYSRF05.prototype.stop = function () {
        this.is_measuring = false;
    };
    HYSRF05.prototype.init = function () {
        // Activate GPIO
        rpio.open(this.gpio_pins.trig, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.gpio_pins.echo, rpio.INPUT);
        // Wait for device to init and start measuring.
        rpio.msleep(500);
    };
    HYSRF05.prototype.measureDistance = function () {
        this.sendSignal();
        this.calculateDistance(this.receiveSignal());
    };
    HYSRF05.prototype.sendSignal = function () {
        rpio.write(this.gpio_pins.trig, rpio.HIGH);
        rpio.usleep(10);
        rpio.write(this.gpio_pins.trig, rpio.LOW);
    };
    /**
     * Wait for triggered signal to return.
     *
     * @return number Amount of microseconds were the sensor got HIGH signal trough echo.
     */
    HYSRF05.prototype.receiveSignal = function () {
        var no_echo_time = 0;
        var echo_time = 0;
        while (!rpio.read(this.gpio_pins.echo)) {
            rpio.usleep(1);
            no_echo_time += 1;
            if (no_echo_time >= this.signal_ttl) {
                // If signal is lost for some reason then try again.
                return 0;
            }
        }
        while (rpio.read(this.gpio_pins.echo)) {
            rpio.usleep(1);
            echo_time += 1;
            if (echo_time >= this.signal_ttl) {
                // If signal is blocked then try again.
                return 0;
            }
        }
        return echo_time;
    };
    /**
     * Calculate distance in cm by passing the time in microseconds.
     * TODO use temperature to get better results?
     * TODO see: http://www.f15ijp.com/2012/09/arduino-ultrasonic-sensor-hc-sr04-or-hy-srf05/
     */
    HYSRF05.prototype.calculateDistance = function (microseconds) {
        this.distance = microseconds / 58;
        this.distance = Math.round(this.distance * 100);
        if (this.distance >= this.max_range || this.distance <= 0) {
            this.distance = -1;
        }
    };
    return HYSRF05;
}());
exports.HYSRF05 = HYSRF05;
