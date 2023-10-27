const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')


const { Command } = require('commander');
const program = new Command();


token="6836361243:AAHgmzvYdOu6kPj_zbplCBERRjQnpkPmhro"

const bot = new TelegramBot(token, {polling: true});
let chatId=608570756;

bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendMessage(msg.chat.id, "Hello").then((info)=>{
        return info.chat.id

    });;
})

program.command('send-message')
    .description('command to send message')
    .argument('<string>', 'Some message')
    .action((str, options) => {
        bot.sendMessage(chatId, str);
        console.log("sucess");
    });

program.command('send-photo')
    .description('command to send photo')
    .argument('<string>', 'Path to photo')
    .action((path, options) => {
        bot.sendPhoto(chatId, path, { caption: 'Check out this photo!' })
            .then(() => {
                console.log('Photo sent successfully');
            })
            .catch((error) => {
                console.error('Error sending photo:', error.message);
            });
        // bot.sendPhoto(chatId, fs.createReadStream(path))
        //     .then(() => {
        //         console.log('Photo sent successfully');
        //     })
        //     .catch((error) => {
        //         console.error('Error sending photo:', error);
        //     });
    });

program.parse();

// console.log(chatId)

// program.parse();