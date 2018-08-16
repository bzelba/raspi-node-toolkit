"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rpio = require("rpio");
/**
 * Designed to work with Relay Module JQC-3FF.
 */
var JQC3FF = /** @class */ (function () {
    function JQC3FF(gpio_pin) {
        // Actual relais state
        this.is_open = false;
        // Pin to use for relais
        this.gpio_pin = 0;
        this.gpio_pin = gpio_pin;
        this.init();
    }
    // Activate GPIO pin for relay output
    JQC3FF.prototype.init = function () {
        rpio.open(this.gpio_pin, rpio.OUTPUT, rpio.LOW);
    };
    // Open the relay
    JQC3FF.prototype.open = function () {
        rpio.write(this.gpio_pin, rpio.HIGH);
        this.is_open = true;
    };
    // Close the relay
    JQC3FF.prototype.close = function () {
        rpio.write(this.gpio_pin, rpio.LOW);
        this.is_open = false;
    };
    return JQC3FF;
}());
exports.JQC3FF = JQC3FF;
