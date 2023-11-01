const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

token = '6906245106:AAE6FdcrYiEb3l73qKDTwi_1cZUhi489ZVU'
const bot = new TelegramBot(token, {polling: true, none_stop: true});
let chatId = 608570756;
let intervalId;

const myInterval = (someFunction, time) => {
    intervalId = setInterval(() => someFunction, time)
}

bot.onText(/\/start/, () => {
    clearInterval(intervalId)
    bot.sendMessage(chatId, "Welcome", {
        "reply_markup": {
            "keyboard": [["Forecast in Lviv"], ["Forecast in Vinnytsia"]]
        }
    });

});

bot.onText(/\/stop/, (msg) => {
    bot.sendMessage(chatId, "I hope you liked it!", clearInterval(intervalId))

});

bot.on('message', (msg) => {
    const messageText = msg.text;
    if (messageText === "Forecast in Lviv") {
        const lviv_coordinates = {
            lat: 49.84,
            lon: 24.03
        };
        sendInterval(msg.chat.id, lviv_coordinates);
    }

    if (messageText === "Forecast in Vinnytsia") {
        const vinnytsia_coordinates = {
            lat: 49.24,
            lon: 28.47
        };
        sendInterval(msg.chat.id, vinnytsia_coordinates);
    }
});

function sendInterval(chatId, city) {

    bot.sendMessage(chatId, "Please set interval", {
        "reply_markup": {
            "keyboard": [["at intervals of 3 hours"], ["at intervals of 6 hours"], ["/stop"]]
        }
    });

    bot.on('message', (answer) => {
        const duration = answer.text;
        if (duration === "at intervals of 3 hours") {
            intervalId = setInterval(() => {
                loadForecast(city)
            }, 1000)

        } else if (duration === "at intervals of 6 hours")
        {
            intervalId = setInterval(() => {
                loadForecast(city)
            }, 6 * 60 * 60 * 1000)
        }
    });
}

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
    resultString = resultString.slice(0, -2);
    bot.sendMessage(chatId, resultString)

}




