const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

token = '6906245106:AAE6FdcrYiEb3l73qKDTwi_1cZUhi489ZVU'
const bot = new TelegramBot(token, {polling: true});
let chatId = 608570756;


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Forecast in Lviv"],   ["Forecast in Vinnytsia"]]
        }
    });

});
bot.on('message', (msg) => {
    const lviv = "Forecast in Lviv";
    if (msg.text.indexOf(lviv) === 0) {
        bot.sendMessage(chatId, "Please set interval",{
            "reply_markup": {
                "keyboard": [["at intervals of 3 hours"],   ["at intervals of 6 hours"]]
            }
        });

        bot.on('message',(answer)=>{
            const lviv_forecast = {
                lat: 49.84,
                lon: 24.03
            }
            const duration = "at intervals of 3 hours";
            if (answer.text.indexOf(duration) === 0) {
                console.log("3 intervals")
                // bot.sendMessage(chatId, "Please set interval");
                loadForecast(lviv_forecast)
            }else {
                console.log("else block")
            }
        })

    }

});


const loadForecast=(city)=>{
    //TODO
    // axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}.84&lon=${city.lon}&appid=0a451ab8ca66d6bab87246de4c00b68e`)
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //         return response
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //         return error.message
    //
    //     })
    console.log(city.lat)
}


// https://api.openweathermap.org/data/2.5/weather?lat=49.84&lon=24.03&appid=0a451ab8ca66d6bab87246de4c00b68e
// axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lviv_forecast.lat}.84&lon=${lviv_forecast.lon}&appid=0a451ab8ca66d6bab87246de4c00b68e`)
//     .then(function (response) {
//         // handle success
//         console.log(response);
//     })
//     .catch(function (error) {
//         // handle error
//         console.log(error);
//     })

