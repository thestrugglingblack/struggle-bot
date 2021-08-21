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

    if(message.includes('!katherinejohnson')){
        const cleanQuestion = message.replace('!katherinejohnson', '');
        const response = async () => {
            try {
                const answer = await qnaModel('katherine-johnson', cleanQuestion);
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

    if(message.includes('!maryjackson')){
        const cleanQuestion = message.replace('!maryjackson', '');
        const response = async () => {
            try {
                const answer = await qnaModel('mary-jackson', cleanQuestion);
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

    if(message.includes('!dorothyvaughan')){
        const cleanQuestion = message.replace('!dorothyvaughan', '');

        const response = async () => {
            try {
                const answer = await qnaModel('dorothy-vaughan', cleanQuestion);
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

