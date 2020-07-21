serial.onDataReceived("REQ:", function () {
    serial.writeLine("Nu hände det!")
    command = serial.readLine()
    command.substr(5,command.length()-4);
    serial.writeLine(command);
})
// There is an issue with the rain interupt – intereferes with the serial
function windDirection (direction: string) {
    serial.writeLine(direction)
    switch (direction) {
            case 'N': currentWD= 0;break;
            case 'NE': currentWD= 45;break;
            case 'E': currentWD= 90;break;
            case 'SE': currentWD= 135;break;
            case 'S': currentWD= 180;break;
            case 'SW': currentWD= 225;break;
            case 'W': currentWD= 270;break;
            case 'NW': currentWD= 315;break;
            case '???': break;
            default: break; 
        }
return currentWD
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
            return windDirection(weatherbit.windDirection()); break;      
        case 'rain':
            return weatherbit.rain() / 25.4; break;
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
let command = ""
let currentWD:number = 0
let mnemonics = ["temp", "tempubit", "humid", "press", "wspeed", "wdir", "rain", "light"]
weatherbit.startRainMonitoring()
basic.pause(1000)
weatherbit.startWeatherMonitoring()
basic.pause(1000)
// Seems that startWindMonitoring is not necessary and intereferes with startRainMonitoring...
// weatherbit.startWindMonitoring()
serial.redirectToUSB()
basic.forever(function () {
    // weatherbit.startWeatherMonitoring()
    for (let currentParam of mnemonics) {
        serial.writeValue(currentParam, readWeatherSensor(currentParam))
        basic.pause(1000)
    }
})
