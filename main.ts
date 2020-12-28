/**
 * function windDirection (direction: string) {
 * 
 * serial.writeLine(direction)
 * 
 * switch (direction) {
 * 
 * case 'N': currentWD= 0;break;
 * 
 * case 'NE': currentWD= 45;break;
 * 
 * case 'E': currentWD= 90;break;
 * 
 * case 'SE': currentWD= 135;break;
 * 
 * case 'S': currentWD= 180;break;
 * 
 * case 'SW': currentWD= 225;break;
 * 
 * case 'W': currentWD= 270;break;
 * 
 * case 'NW': currentWD= 315;break;
 * 
 * case '???': break;
 * 
 * default: break;
 * 
 * }
 * 
 * return currentWD
 * 
 * }
 */
/**
 * let currentWD:number = 0
 */
serial.onDataReceived("REQ:", function () {
    serial.writeLine("Nu hände det!")
    command = serial.readLine()
    command.substr(5,command.length()-4);
serial.writeLine(command)
})
function windDirection () {
    voltage = pins.analogReadPin(AnalogPin.P1)
    if (voltage > 368 && voltage < 382) {
        return 112.5
    }
    if (voltage > 381 && voltage < 400) {
        return 67.5
    }
    if (voltage > 399 && voltage < 415) {
        return 90
    }
    if (voltage > 414 && voltage < 457) {
        return 157.5
    }
    if (voltage > 456 && voltage < 510) {
        return 135
    }
    if (voltage > 509 && voltage < 553) {
        return 202.5
    }
    if (voltage > 552 && voltage < 616) {
        return 180
    }
    if (voltage > 615 && voltage < 681) {
        return 22.5
    }
    if (voltage > 680 && voltage < 747) {
        return 45
    }
    if (voltage > 746 && voltage < 803) {
        return 247.5
    }
    if (voltage > 802 && voltage < 834) {
        return 215
    }
    if (voltage > 833 && voltage < 879) {
        return 337.5
    }
    if (voltage > 878 && voltage < 914) {
        return 0
    }
    if (voltage > 913 && voltage < 941) {
        return 292.5
    }
    if (voltage > 940 && voltage < 971) {
        return 315
    }
    if (voltage > 970 && voltage < 993) {
        return 270
    }
    return 360
}
// @param {string} queryParam - The mnemonic for the sensor
function readWeatherSensor (queryParam: string) {
    switch(queryParam) {
        case 'temp':
            return (weatherbit.temperature() / 100);break;
        case 'tempubit':
            return (input.temperature());break;
        case 'humid':
            return (weatherbit.humidity() / 1024);break;
        case 'press':
            return (weatherbit.pressure() / 25600);break;
        case 'alt':
            return weatherbit.altitude();break;
        case 'wspeed':
            return weatherbit.windSpeed() / 2.2369362920544;break;
        case 'wdir':
            serial.writeValue("ADC P1", pins.analogReadPin(AnalogPin.P1));
            return windDirection();    
        case 'rain':
            return weatherbit.rain() * 25.4; break;
       case 'light':
            return input.lightLevel(); break;
        case 'compass':
            return input.compassHeading(); break;
        default:
            return 0;
    }
}
/**
 * let mnemonics = ["temp", "humid", "press", "wspeed", "wdir", "light"]
 */
/**
 * serial.redirect( SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600 )
 */
let voltage = 0
let command = ""
let mnemonics = ["temp", "humid", "press", "wspeed", "wdir", "rain"]
// let mnemonics = ["wdir"]
// weatherbit.startRainMonitoring();
serial.redirectToUSB()
basic.forever(function () {
    weatherbit.startRainMonitoring()
    weatherbit.startWindMonitoring()
    weatherbit.startWeatherMonitoring()
    for (let currentParam of mnemonics) {
        serial.writeValue(currentParam, readWeatherSensor(currentParam))
        basic.pause(1000)
    }
})
