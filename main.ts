// @param {string} queryParam - The mnemonic for the sensor
function readWeatherSensor (queryParam: string) {
    switch(queryParam) {
        case 'temp':
            return (weatherbit.temperature() / 100);break;
        case 'humid':
            return (weatherbit.humidity() / 1024);break;
        case 'press':
            return (weatherbit.pressure() / 25600);break;
        case 'alt':
            return weatherbit.altitude();break;
        case 'wspeed':
            return weatherbit.windSpeed() / 2.2369362920544;break;
        case 'wdir':
        switch (weatherbit.windDirection()) {
            case 'N': return 0;break;
            case 'NE': return 45;break;
            case 'E': return 90;break;
            case 'SE': return 135;break;
            case 'S': return 180;break;
            case 'SW': return 225;break;
            case 'W': return 270;break;
            case 'NW': return 315;break;
            default: return 0; 
        } break;      
        case 'rain':
            return weatherbit.rain() / 25.4; break;
        default:
            return 0;
    }
}
let weatherParam = 0
let mnemonics = ["temp", "humid", "press", "alt", "wspeed", "wdir", "rain"]
// serial.redirect( SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600 )
weatherbit.startRainMonitoring()
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
serial.redirectToUSB()
basic.forever(function () {
    for (let currentParam of mnemonics) {
        serial.writeValue(currentParam, readWeatherSensor(currentParam))
 //       basic.pause(10000)
        basic.pause(500)
    }
})
