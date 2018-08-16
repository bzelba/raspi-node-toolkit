import rpio = require('rpio');

/**
 * TODO still not finished, work in progress.
 */
export class RfModule {
    // Pin to use for transmitter
    tx_pin:number = null;

    // Pin to use for receiver
    rx_pin:number = null;

    constructor(tx_pin: number = null, rx_pin:number = null) {
        this.tx_pin = tx_pin;
        this.rx_pin = rx_pin;

        this.tx_pin && this.initTX();
        this.rx_pin && this.initRX();
    }

    // TODO add a quick and easy method :D

    private initTX() {
        rpio.open(this.tx_pin, rpio.OUTPUT, rpio.LOW);
    }

    private initRX() {
        rpio.open(this.rx_pin, rpio.INPUT);
    }

    // Transmit a signal
    async send(message:string) {
        console.log('Send HIGH');
        rpio.write(this.tx_pin, rpio.HIGH);
    }

    // Receive a signal
    async receive() {
        while(true) {
            let value = rpio.read(this.rx_pin);
            if (value) {
                console.log('Received HIGH Nr. ');
                console.log(value);
                break;
            }
        }
    }
}