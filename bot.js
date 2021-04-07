require("dotenv").config();

var fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const date = new Date();
const queue = new Map();
//const ffmpeg = require("ffmpeg");
const channelTwoID = process.env.GENERAL_TWOID;
const channelOneID = process.env.GENERAL_ONEID;
const yttl = require('ytdl-core');
const YTSearcher = require('ytsearcher');
const prefix = "!";
//Twitter API Stuff
var Twit = require('twit');
var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEYAPI,
  consumer_secret:      process.env.CONSUMER_KEYAPI_SECRET,
  access_token:         process.env.ACCESS_TOKENAPI,
  access_token_secret:  process.env.ACCESS_TOKENAPI_SECRET,
})
//Variable declarations 
const eightBallArray = [
    "As I see it, yes.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "It is certain.",
    "It is decidedly so.",
    "Most likely.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Outlook good.",
    "Reply hazy, try again.",
    "Signs point to yes.",
    "Very doubtful.",
    "Without a doubt.",
    "Yes.",
    "Yes – definitely.",
    "You may rely on it.",
    "Eat my shorts."
];
const soundArray = [
    "sounds/song.mp3",
    "sounds/balls.mp3",
    "sounds/BFGDivision.ogg",
    "sounds/BritenyToxic.ogg",
    "sounds/C418DryHands.ogg",
    "sounds/C418WetHands.ogg",
    "sounds/chunky.mp3",
    "sounds/grimreaper.mp3",
    "sounds/guitar.ogg",
    "sounds/ironMan.ogg",
    "sounds/rain.mp3",
    "sounds/saveThatShit.ogg",
    "sounds/wedidit.mp4",
    "sounds/wocky.mp3",
    "sounds/wockyBass.mp3",
    "sounds/mmm.mp3",
    "sounds/sure.mp3",
    "sounds/xgames.mp3",
    "sounds/stamos.mp3",
    "sounds/wavefinger.mp3",
    "sounds/picklerick.mp3",
    "sounds/moseby.mp3",
    "sounds/getdog.mp3",
    "sounds/rick.mp3",
    "sounds/trashkid.mp3",
    "sounds/saytome.mp3",
    "sounds/geton.mp3",
];
var i;
client.on('ready', () => {
    client.channels.cache.get(channelTwoID).send('Im Ready!');
    checkTimeFunc();
    greetings();
    readTweets();
    readNotes();
    testReadFileArray();
})
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    console.log(theCommand)
    if (theCommand === "!ping") {
        console.log(theCommand)
        message.reply("Pong!")
        message.react("❤️")
    } else if (message.content === "!help") {
        message.reply('I can do a bunch of things including play sounds! Here is a list of what I can do, some of these are sounds and some are not!')
        message.reply('!playRandomSound or !prs, !noteThis "your note here", !milk, !taco, !mmm, !sure, !advice, !guitar, !tweet "Your tweet here", !BFGDivision, !paulGilb, !C418WetHands, !C418DryHands, !grimreaper, !rain, !ironManGuitarOnly, !senddog, !wedidit, !saveThatShit, !chunky, !eightball, !temperatureSports, !wockyBass, !weather "a city here", !coinFlip, !meow, !randomBetween "a number here", !wocky, !sports, !balls, and !ping')
        message.react("👍")
    } else if (theCommand === "!advice") {
        giveAdvice(message)//test this 
    } else if (message.content.startsWith("!noteThis")){
        getReadyToSaveToTextFile(message);
    } else if (theCommand == "!paulgilb") {
        playSong("sounds/song.mp3", message)
    } else if (theCommand == "!ironmanguitaronly") {
        playSong("sounds/guitar.ogg", message)
    } else if (theCommand == "!bfgdivision") {
        playSong("sounds/BFGDivision.ogg", message)
    } else if (theCommand == "!britenytoxic") {
        playSong("sounds/BritenyToxic.ogg", message)
    } else if (theCommand == "!C418DryHands") {
        playSong("sounds/c418dryhands.ogg", message)
    } else if (theCommand == "!c418wethands") {
        playSong("sounds/C418WetHands.ogg", message)
    } else if (theCommand == "!savethatshit") {
        playSong("sounds/saveThatShit.ogg", message)
    } else if (theCommand == "!trash") {
        playSong("sounds/trashkid.mp3", message)
    } else if (theCommand == "!wedidit") {
        playSong("sounds/wedidit.mp4", message)
    } else if (theCommand == "!balls") {
        playSong("sounds/balls.mp3", message)
        ballsCounter(message)
    } else if (theCommand == "!ballcounter"){
        ballChecker(message)
    } /*else if (message.contains("bro")){
        broBot(message)
    }*/ else if (theCommand == "!chunky") {
        playSong("sounds/chunky.mp3", message)
    } else if (theCommand == "!grimreaper") {
        playSong("sounds/grimreaper.mp3", message)
    } else if (theCommand == "!rain") {
        playSong("sounds/rain.mp3", message)
    } else if (theCommand == "!wocky") {
        playSong("sounds/wocky.mp3", message)
    } else if (theCommand == "!wockybass") {
        playSong("sounds/wockyBass.mp3", message)
    } else if ((theCommand == "!playRandomSound") || (theCommand == "!prs"))  {
        playRandom(message)
    } else if (theCommand == "!mmm"){
        playSong("sounds/mmm.mp3", message)
    } else if (theCommand == "!sure"){
        playSong("sounds/sure.mp3", message)
    } else if (theCommand == "!milk"){
        playSong("sounds/milk.mp3", message)
    } else if (theCommand == "!stop"){
        discBot(message)
    } else if (message.content.startsWith("!weather")){
        giveWeather(message)
    } else if(theCommand === "!sports"){
        weatherSports(message)
    } else if(theCommand === "!temperaturesports"){
        temperatureSports(message)
    } else if (theCommand === "!coinflip") {
        flipACoin(message)
    } else if (theCommand === "!eightball") {
        eightBall(message)
    } else if (theCommand === "!meow") {
        message.channel.send("meow" + randomCat(message))
    } else if(theCommand === "!taco") {
        message.reply(getTaco())
    } else if (theCommand === "!senddog") {
        message.channel.send("Doggo" + randomDog(message))
    } else if (message.content.startsWith("!randombetween")){
        randomBetween(message)
    }else if(message.content.startsWith("!tweet")){
        getReadyForTweet(message)
    }
});

client.on('message', message => {
    if ((message.content.startsWith("I'm")) || (message.content.startsWith("Im")) || (message.content.startsWith("I’m")) || (message.content.startsWith("im")) || (message.content.startsWith("i'm"))){
        dadBot(message)
    }
});
//---------------------Functionsssssssssssssssssssssssssss-------------------------
function playRandom(message){
    const randomNumber = Math.floor(Math.random()* soundArray.length);
    playSong(soundArray[randomNumber], message)
}
function eightBall(message){
    const randomNumber = Math.floor(Math.random()* eightBallArray.length);
    message.reply(eightBallArray[randomNumber])
    message.react("🎱")
}
function playSong(songName, message){
    // Checking if the message author is in a voice channel.
    if (!message.member.voice.channel) 
        return message.reply("You must be in a voice channel.");
    // Checking if the bot is in a voice channel.
    if (message.guild.me.voice.channel) 
        return message.reply("I'm already playing.");
    // Joining the channel and creating a VoiceConnection.
    message.member.voice.channel.join().then(VoiceConnection => {
        // Playing the music, and, on finish, disconnecting the bot.
        VoiceConnection.play(songName).on("finish", () => 
            VoiceConnection.disconnect());
            message.reply("Playing...");
    }).catch(err => 
        console.log(err))
};
function dadBot(message){
    const args = message.content.slice().trim().split(/ +/g);
        const theCommand = args.shift();
        var stringer = "";
        for(i = 0; i < args.length; i++){
            stringer = stringer + " " + args[i];
        }
        message.channel.send("Hi" + stringer + ", im HelpfulBot")
        return;
}
function broBot(message){
    const randomNumber = Math.floor(Math.random()* broArray.length);
    message.channel.send("Wassup my fellow " + broArray[randomNumber] + ", im BROBOT")
    message.react("😎")
    message.react("💪")
    return;
}
function temperatureSports(message){
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=lockport,us&units=imperial&APPID=" + process.env.API_TOKEN_KEY)
        .then((res) => {  
            if(res.data.main.temp <= 45){
                message.reply("The temperature outside is: " + res.data.main.temp + ", its pretty cold out I would stay in today and play some games");
            } else if(res.data.main.temp <=55 ){
                message.reply("The temperature outside is: " + res.data.main.temp + ", its not the warmest out right now I would go if you're desperate. ");
            } else if(res.data.main.temp <= 60  ){
                message.reply("The temperature outside is: " + res.data.main.temp + ", its a little chilly bring a sweater!");
            } else if(res.data.main.temp <= 70){
                message.reply("The temperature outside is: " + res.data.main.temp + ", its nice and warm get out there!");
            } else if(res.data.main.temp == 75){
                message.reply("The temperature outside is: " + res.data.main.temp + ", its perfect! ");
            } else {
                message.reply("The temperature outside is: " + res.data.main.temp + ", its pretty hot out, get out there! ")}
        })
        .catch((err) => {
            console.error('ERR:', err)
        })
}
function flipACoin(message){
    const coin = 2;
    const randomNumber = Math.floor(Math.random() * 2);
    if(randomNumber == 1){
        message.reply("Heads!" , {
        files: [
            "https://faculty.math.illinois.edu/~hildebr/fakerandomness/resources/heads.png"
        ]
    })
    } else{
        message.reply("Tails!", {
            files: [
                "https://random-ize.com/coin-flip/us-quarter/us-quarter-back.jpg"
            ] 
        });
    }
}
function weatherSports(message){
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=lockport,us&units=imperial&APPID=" + process.env.API_TOKEN_KEY)
    .then((res) => {  
        if(res.data.wind.speed <= 3){
            message.reply("The wind today is almost nonexistant go outside! The temperature is " + res.data.main.temp + " degrees. The real feel is "
             + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Tennis would be great today!");
        } else if(res.data.wind.speed <=6 ){
            message.reply("The wind today is pretty slim get out there! The temperature is " + res.data.main.temp + " degrees. The real feel is "
             + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Tennis would be pretty good today!");
        } else if(res.data.wind.speed <= 9.5  ){
            message.reply("The wind today isnt looking bad, check the forecast for gusts and future developments could be great! The temperature is " + res.data.main.temp + " degrees. The real feel is "
             + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Disc golf is going to be alright today especially behind some trees. Tennis is not looking good.");
        } else if(res.data.wind.speed <= 15){
            message.reply("The wind today is kinda high I wouldnt reccomend sports unless its forecasted to die down. The temperature is " + res.data.main.temp + " degrees. The real feel is "
             + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Sports today arent looking good.");
        } else if(res.data.wind.speed <= 20){
            message.reply("The wind today is very high I wouldnt recommend going out for sports. The temperature is " + res.data.main.temp + " degrees. The real feel is "
             + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Prepare to get frustrated if you're heading out");
        } else {message.reply("The wind today is insane I highly wouldnt reccomend going out for sports. The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Dont do it.")}
    })
}
function giveWeather(message){
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    const city = args[0];
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&units=imperial&APPID=" + process.env.API_TOKEN_KEY)
    .then((res) => { 
        message.reply("The temperature is " + res.data.main.temp + " degrees. The real feel is " + res.data.main.feels_like + " degrees. The wind speed is " + res.data.wind.speed + "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Please, have a nice day.");   
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
}
function discBot(message){
    const empty = "";
    message.member.voice.channel.join().then(VoiceConnection => {
        // Playing the music, and, on finish, disconnecting the bot.
        VoiceConnection.play(empty).on("finish", () => 
            VoiceConnection.disconnect());
            message.reply("Stopping...");
    }).catch(err => 
        console.log(err))
}
function checkTimeFunc(){
    if(date.getHours() == 17){
        client.channels.cache.get(channelTwoID).send('Welcome home from work Andrew. I hope it went well.');
    } else {
        setTimeout(checkTimeFunc, 3600000); //one hour so it only checks once per hour triggering the function once only
        console.log("Its "+ date.getHours() + ", lets check again later.")
    }
}
function greetings(){
    if(date.getHours() == 7) {
        console.log("7am");
        client.channels.cache.get(channelOneID).send('Good morning, everyone!.');
        giveAdvice(message);
    } else if (date.getHours() == 0) {
        console.log("midnight");
        client.channels.cache.get(channelTwoID).send("Goodnight, everyone.");
    } else {
        console.log("checked after another hour its currently hour " + date.getHours());
        setTimeout(checkTimeFunc, 3600000);//one hour 
    }
}
function randomDog(message){
    axios.get("https://dog.ceo/api/breeds/image/random")
    .then((res) => {
        message.channel.send(res.data.message)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " "
}
function randomCat(message){
    axios.get("https://api.thecatapi.com/v1/images/search")
    .then((res) => {
        //console.log('RES:', res.data[0].url)
        message.channel.send(res.data[0].url)  
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " "
}
function makeTweets(theTweet){
    //Not looping anything to post again, not getting banned again also PS twitter devs if youre reading this dont ban me 
    //EDIT: it almost got banned again seperate reason though 
    T.post('statuses/update', { status: theTweet }, function(err, data, response) {
        saveTweetID(data.id_str, theTweet);
        data = " ";
        theTweet = " ";
    })
}
function saveTweetID(tweetID, theTweet){
    fs.appendFile('mynewfile1.txt', "\r\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    fs.appendFile('mynewfile1.txt', tweetID +"_"+ theTweet, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}
function readTweets(){
    fs.stat('mynewfile1.txt', function (error, stats) { 
        fs.open('mynewfile1.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    console.log(data); 
                    let arrayOfIds = [];
                    arrayOfIds.push(data);
                    console.log(arrayOfIds.length);//needs fix, seperate on _s each to get each item then make the array
            }); 
        });
    });
}
function readNotes(){
    fs.stat('newFile2.txt', function (error, stats) { 
        fs.open('newFile2.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    console.log(data); 
                    let arrayOfIds = [];
                    arrayOfIds.push(data);
                    console.log(arrayOfIds.length);//needs fix, seperate on _s each to get each item then make the array
            }); 
        });
    });
}
function testReadFileArray(){
    fs.stat('testfile.txt', function (error, stats) { 
        fs.open('testfile.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    console.log(data); 
                    let arrayOfIds = [];
                    arrayOfIds.push(data);
                    const randomNumber = Math.floor(Math.random() * arrayOfIds.length);
                    for (i = 0; i < arrayOfIds.length; i++) {
                        console.log(arrayOfIds.slice().trim())
                    }
                    console.log(arrayOfIds.length);//needs fix, seperate on _s each to get each item then make the array
            }); 
        });
    });
}
function randomBetween(message){
    if (message.content.startsWith("!randomBetween")){
        const args = message.content.slice().trim().split(/ +/g);
        const command = args.shift().toLowerCase();   
        const randomNumber = Math.floor(Math.random()* args[0]);
        message.channel.send("You randomed between "+ args[0]+" and 0 to get "+ randomNumber);
    }
}
function saveToTextFile(theMessage){
    fs.appendFile('newFile2.txt', theMessage, function (err) {
        if (err) throw err;
        console.log(theMessage)
        console.log('Saved!');
    })
}
function ballsCounter(message){
    fs.readFile('ballsCounter.txt', function(err, data) {
        console.log("this is a test to see what its at " + data)
        //parseInt(data)
        //console.log(data)
        newData = parseInt(data) 
        //console.log(data)
        fs.appendFile('ballsCounter.txt', newData, function (err) {
            if (err) throw err;
            console.log('Saved!');
        })
    });
}
function counter(){
    fetch("ballsCounter.txt")
    .then(function(response) { return response.text; })
    .then(function(text) {
      var num = parseInt(text);
    });
}
function ballChecker(message){
    fs.readFile('ballsCounter.txt', function(err, data) {
        console.log(data);
        message.reply("The counter is at: " + data)
        return data; 
    });
}
function giveAdvice(message){
    axios.get("https://api.adviceslip.com/advice")
    .then((res) => {
        //console.log('RES:', res.data.slip.advice)
        message.reply(res.data.slip.advice)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
function getTaco(){
    axios.get("http://taco-randomizer.herokuapp.com/random/?full-taco=true")
    .then((res) => {
        console.log('RES:', res.data.base_layer.recipe)
        client.channels.cache.get(channelTwoID).send(res.data.base_layer.recipe)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
function getReadyToSaveToTextFile(message){
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    var stringer = ""
    for(i = 0; i < args.length; i++){
        stringer = stringer + " " + args[i];
    }
    client.channels.cache.get(channelTwoID).send("Saved "+ stringer + " to the bots notepad!(my pc thanks)")
    saveToTextFile(stringer);
}
function getReadyForTweet(message){
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    var stringer = "";
    for(i = 0; i < args.length; i++){
        stringer = stringer + " " + args[i];
    }
    makeTweets(stringer); 
    message.reply('You tweeted: '+ stringer);
}
client.login(process.env.BOT_TOKEN)
//npm run devStart