require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const QNA = require('@tensorflow-models/qna');
const cache = require('memory-cache');
const fs = require('fs');
const path = require('path');


const memCache =  new cache.Cache();
(async function(){
    [
        path.join(__dirname, '..','data', 'katherine-johnson.txt'),
        path.join(__dirname, '..','data', 'mary-jackson.txt'),
        path.join(__dirname, '..','data', 'dorothy-vaughan.txt')
    ].map(function(file){
        fs.readFile(file,'utf8', function (err, data){
            if(err){
                console.error('Error', err);
            } else {
                const key = file.split('/')[file.split('/').length - 1].split('.')[0]
                memCache.put(key, data)
            }
        });
    });
})()

async function qnaModel (name, question){
    try {
        await tf.ready();

        let model = await QNA.load();
        const text = memCache.get(name);
        let answers = await model.findAnswers(question, text);

        if(answers.length < 1){
            return console.log('Can you rephrase the question?')
        }
        return answers[0];
    } catch(e){
        console.log('Model encountered an error', e)
    }
}

module.exports ={
    qnaModel
}