const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

token = '6906245106:AAE6FdcrYiEb3l73qKDTwi_1cZUhi489ZVU'
const bot = new TelegramBot(token, {polling: true,none_stop: true});
let chatId = 608570756;


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Forecast in Lviv"], ["Forecast in Vinnytsia"]]
        }
    });

});

bot.on('message', (msg) => {
    const lviv = "Forecast in Lviv";
    if (msg.text.indexOf(lviv) === 0) {
        bot.sendMessage(chatId, "Please set interval", {
            "reply_markup": {
                "keyboard": [["at intervals of 3 hours"], ["at intervals of 6 hours"]]
            }
        });

        bot.on('message', (answer) => {
            const lviv_coordinates = {
                lat:49.84,
                lon:24.03
            }
            const duration = "at intervals of 3 hours";
            if (answer.text.indexOf(duration) === 0) {
                loadForecast(lviv_coordinates)
                const myInterval=setInterval(()=>{loadForecast(lviv_coordinates)},  3 * 60 * 60 * 1000 )
            } else {
                loadForecast(lviv_coordinates)
                const myInterval=setInterval(()=>{loadForecast(lviv_coordinates)}, 6 * 60 * 60 * 1000)
            }


        })
    }
    const vinnytsia = "Forecast in Vinnytsia";
    if(msg.text.indexOf(vinnytsia) === 0) {

                bot.sendMessage(chatId, "Please set interval", {
                    "reply_markup": {
                        "keyboard": [["at intervals of 3 hours"], ["at intervals of 6 hours"]]
                    }
                });
                bot.on('message', (answer) => {
                    const vinnytsia_coordinates = {
                        lat: 49.24,
                        lon: 28.47
                    }
                    const duration = "at intervals of 3 hours";
                    if (answer.text.indexOf(duration) === 0) {
                        loadForecast(vinnytsia_coordinates)
                        setInterval(()=>{loadForecast(vinnytsia_coordinates)}, 3 * 60 * 60 * 1000)
                    } else {
                        loadForecast(vinnytsia_coordinates)
                        const myInterval=setInterval(()=>{loadForecast(vinnytsia_coordinates)}, 6 * 60 * 60 * 1000)
                    }
                })

    }
});

    const loadForecast = async (city) => {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=0a451ab8ca66d6bab87246de4c00b68e`)
            .then((response) => {
                return response.data
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return error.message

            })

        const text = {
            time: new Date,
            city: result.name,
            main: result.weather[0].description,
            humidity: result.main.humidity,
            temp: (result.main.temp - 273.15).toFixed(2) + " C",
            wind: result.wind.speed + "km/h"
        }
        let resultString = "";
        for (const key in text) {
            if (text.hasOwnProperty(key)) {
                resultString += key + ": " + text[key] + ", \n ";
            }
        }


// Remove the trailing comma and space
        resultString = resultString.slice(0, -2);
        bot.sendMessage(chatId, resultString)

    }

bot.onText(/\/stop/, (msg) => {
    bot.sendMessage(chatId, "I hope you liked it!").then(()=>{
        clearInterval(myInterval)
    })

    ;

});


