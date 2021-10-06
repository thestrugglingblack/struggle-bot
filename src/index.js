require('dotenv').config()
const tmi = require('tmi.js')
const fs = require('fs');
const path = require('path');
const cache = require('memory-cache');
const qnaModel = require('./model/nlp').qnaModel;

let memCache = new cache.Cache();

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_AUTH
    },
    channels: [process.env.TWITCH_CHANNEL]
})

client.connect();

const getDefaultMessage = () => {
    const file = path.join(__dirname, 'data', 'greetings.txt');
    try {
        fs.readFile(file, 'utf8',function (err, data){
            data.toString();
            if(data){
                memCache.put('greeting', data.toString());
            }
        })
    }catch (e){
        console.error('Problem retrieving greeting file',e)
    }
}
getDefaultMessage();

client.on('chat', (channel, userstate, message, self) => {

    setTimeout( async function (){
        const message = memCache.get('greeting')
        client.say(channel, message);
    }, process.env.TWITCH_POST_TIMER)
})

client.on('message', (channel, tags, message, self) => {

    if(self) return;

    if(message.includes('!redietabebe')){
        const cleanQuestion = message.replace('!redietabebe', '');
        const response = async () => {
            try {
                const answer = await qnaModel('rediet-abebe', cleanQuestion);
                if(answer.text === undefined || !answer.text){
                    return 'I am sorry we could not find the answer'
                }
                return answer.text;
            }catch (e) {
                return e.toString()
            }
        }
        response().then(data => {
            client.say(channel, data);
        });

    }

    if(message.includes('!timnitgebru')){
        const cleanQuestion = message.replace('!timnitgebru', '');
        const response = async () => {
            try {
                const answer = await qnaModel('timnit-gebru', cleanQuestion);
                console.log('What is the text?', answer)
                if(answer.text === undefined || !answer.text){
                    return 'I am sorry we could not find the answer'
                }
                return answer.text;
            }catch (e) {
                return e.toString()
            }
        }
        response().then(data => {
            client.say(channel, data);
        });
    }

    if(message.includes('!joybuolamwini')){
        const cleanQuestion = message.replace('!joybuolamwini', '');

        const response = async () => {
            try {
                const answer = await qnaModel('joy-buolamwini', cleanQuestion);
                if(answer.text === undefined || !answer.text){
                    return 'I am sorry we could not find the answer'
                }
                return answer.text;
            }catch (e) {
                return e.toString()
            }
        }
        response().then(data => {
            client.say(channel, data);
        });
    }
})

