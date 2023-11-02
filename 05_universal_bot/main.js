const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const axios = require('axios');


const token = "6702197813:AAFkkya7bBS1Q1uYSPGNZMCzH13DbF53uAY"
const monoToken = 'u3fwjFQmzaKZ-LGhjzXfZVzSnwxfQoMWg4OoJhbFwShU'
const bot = new TelegramBot(token, {polling: true, none_stop: true});
let chatId = 608570756;
const cacheKey = 'monobankCurrencyData';


let intervalId;



bot.onText(/\/start/, (msg) => {
    bot.sendMessage(chatId, "Welcome", {
        "reply_markup": {
            "keyboard": [["Почати"]]
        }
    });
});

bot.onText(/Почати|Попереднє меню/, (msg) => {
    bot.sendMessage(chatId, "Що будемо робити?", {
        "reply_markup": {
            "keyboard": [["/Погода"], ["/Курс валют"]]
        }
    });
});
bot.onText(/\/Погода/, (msg) => {
    bot.sendMessage(chatId, "Welcome", {
        "reply_markup": {
            "keyboard": [["Forecast in Lviv", "Forecast in Vinnytsia"], ["Попереднє меню"]]
        }
    });
})
bot.onText(/\/Курс валют/, (msg) => {
    bot.sendMessage(chatId, "Оберіть валюту", {
        "reply_markup": {
            "keyboard": [["USD", "EUR"], ["Попереднє меню"]]
        }
    });

})

bot.on( "message", (msg) => {

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
            }, 3 * 60 * 60 * 1000)

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

bot.on("message",(msg)=>{
    if(msg.text==="USD"){
        loadCurrency("USD")
    }
    if(msg.text==="EUR"){
        loadCurrency("EUR")
    }
})

const loadCurrency = async (currency) => {
    const resultPrivat = await axios.get(`https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`)
        .then((res) => {
            return res.data
        }).catch((error) => {
            return error.message
        })
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        bot.sendMessage(chatId,"Зачекайте хвилинку!")
        return cachedData;
    }
    const resultMono= await axios.get("https://api.monobank.ua/bank/currency")
        .then((res)=>{
            return res.data
        }).catch((error)=>{
            return error.message
        })
    myCache.set(cacheKey, resultMono);

    let textMono={}
    let textPrivat={}
    if(currency==="EUR"){
        textPrivat={
            time: new Date().toLocaleString()+" GMT +02:00",
            provider:"Privat24",
            BASE_CURRENCY: resultPrivat[0].base_ccy,
            EUR_BUY: resultPrivat[0].buy,
            EUR_SALE: resultPrivat[0].sale,
        }
    }else {
        textPrivat={
            time: new Date().toLocaleString()+" GMT +02:00",
            provider:"Privat24",
            BASE_CURRENCY: resultPrivat[1].base_ccy,
            USD_BUY: resultPrivat[1].buy,
            USD_SALE: resultPrivat[1].sale,
        }
    }
    if(currency==="EUR"){
        textMono={
            time: new Date().toLocaleString()+" GMT +02:00",
            provider:"Monobank",
            BASE_CURRENCY: "UAH",
            EUR_BUY: resultMono[1].rateBuy,
            EUR_SALE: resultMono[1].rateSell,
        }
    }else {
        textMono={
            time: new Date().toLocaleString()+" GMT +02:00",
            provider:"Monobank",
            BASE_CURRENCY: "UAH",
            USD_BUY: resultPrivat[0].rateBuy,
            USD_SALE: resultPrivat[0].rateSell,
        }
    }

    const resultStringPrivat=formatObject(textPrivat)
    const resultStringMono=formatObject(textMono)
    bot.sendMessage(chatId, resultStringPrivat)
    bot.sendMessage(chatId, resultStringMono)
}
const formatObject=(object)=>{
    let resultString = "";
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            resultString += key + ": " + object[key] + ", \n ";
        }
    }
    resultString = resultString.slice(0, -2);
    return resultString;


}
bot.onText(/\/stop/, (msg) => {
    clearInterval(intervalId)
    bot.sendMessage(chatId, "I hope you liked it!",{
        "reply_markup": {
            "remove_keyboard": true,
        },
    })


});