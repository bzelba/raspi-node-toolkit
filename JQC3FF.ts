import rpio = require('rpio');

/**
 * Designed to work with Relay Module JQC-3FF.
 */
export class JQC3FF {
    // Actual relais state
    is_open:boolean = false;

    // Pin to use for relais
    gpio_pin:number = 0;

    constructor(gpio_pin: number) {
        this.gpio_pin = gpio_pin;
        this.init();
    }

    // Activate GPIO pin for relay output
    private init() {
        rpio.open(this.gpio_pin, rpio.OUTPUT, rpio.LOW);
    }

    // Open the relay
    public open() {
        rpio.write(this.gpio_pin, rpio.HIGH);
        this.is_open = true;
    }

    // Close the relay
    public close() {
        rpio.write(this.gpio_pin, rpio.LOW);
        this.is_open = false;
    }
}