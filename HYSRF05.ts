import rpio = require('rpio');

/**
 * Designed to work with Ultra Sonic Sensor HY-SRF05,
 * This is an easy to use interface to get some raw data.
 */
export class HYSRF05 {
    // The measured distance in cm.
    distance:number;

    // How long to wait until signal is marked as lost?
    private signal_ttl: number = 500;

    // Maximum measurement range in cm, official maximum is 450cm
    private max_range:number = 450;

    // Time distance between measurements in milliseconds, official maximum is 50ms!
    private measure_delay:number = 50;

    // Callback function in loop.
    private loop:any;

    private is_measuring:boolean = false;

    // Pins to use for sensor.
    gpio_pins:any = {
        trig:0,
        echo:0
    };

    constructor(gpio_pins: {trig:number,echo:number}, loop:(sensor:any) => void = null) {
        this.gpio_pins = gpio_pins;
        this.loop = loop;
        this.init();
    }

    public start() {
        this.is_measuring = true;

        // Start measuring
        while(this.is_measuring) {
            this.measureDistance();
            typeof this.loop == "function" && this.loop(this);
            rpio.msleep(this.measure_delay);
        }
    }

    public stop() {
        this.is_measuring = false;
    }

    private init() {
        // Activate GPIO
        rpio.open(this.gpio_pins.trig, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.gpio_pins.echo, rpio.INPUT);

        // Wait for device to init and start measuring.
        rpio.msleep(500);
    }

    private measureDistance() {
        this.sendSignal();
        this.calculateDistance(
            this.receiveSignal()
        );
    }

    private sendSignal() {
        rpio.write(this.gpio_pins.trig, rpio.HIGH);
        rpio.usleep(10);
        rpio.write(this.gpio_pins.trig, rpio.LOW);
    }

    /**
     * Wait for triggered signal to return.
     *
     * @return number Amount of microseconds were the sensor got HIGH signal trough echo.
     */
    private receiveSignal() {
        let no_echo_time = 0;
        let echo_time = 0;

        while(!rpio.read(this.gpio_pins.echo)) {
            rpio.usleep(1);
            no_echo_time+=1;
            if (no_echo_time >= this.signal_ttl) {
                // If signal is lost for some reason then try again.
                return 0;
            }
        }

        while(rpio.read(this.gpio_pins.echo)) {
            rpio.usleep(1);
            echo_time+=1;

            if (echo_time >= this.signal_ttl) {
                // If signal is blocked then try again.
                return 0;
            }
        }

        return echo_time;
    }

    /**
     * Calculate distance in cm by passing the time in microseconds.
     * TODO use temperature to get better results?
     * TODO see: http://www.f15ijp.com/2012/09/arduino-ultrasonic-sensor-hc-sr04-or-hy-srf05/
     */
    private calculateDistance(microseconds:number) {
        this.distance = microseconds/58;
        this.distance = Math.round(this.distance*100);
        if (this.distance >= this.max_range || this.distance <= 0){
            this.distance = -1;
        }
    }
}