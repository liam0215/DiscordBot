const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = ""; // ADD TOKEN
const PREFIX = "D! ";

function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}, {quality: "91"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if(server.queue[0]) {
            play(connection, message);
        } else {
            connection.disconnect();
        }
    });
}

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
});

bot.on("message", function(message) {
    if(!message.author.equals(bot.user)) {
        if(message.content.startsWith(PREFIX)) {
            var args = message.content.substring(PREFIX.length).split(" ");
            
            if(args[0].toLowerCase() == "ping") {
                message.channel.sendMessage("Pong!");
            } else if(args[0].toLowerCase() == "play") {
                if(!args[1]) {
                    message.channel.sendMessage("Please provide a link");
                } else if(!message.member.voiceChannel) {
                    message.channel.sendMessage("You must be in a voice channel");
                } else {
                    if(!servers[message.guild.id]) {
                        servers[message.guild.id] = {queue: []};
                    }
                    
                    var server = servers[message.guild.id];
                    
                    server.queue.push(args[1]);
                    
                    if(!message.guild.voiceConnection) {
                        message.member.voiceChannel.join().then(function(connection) {
                            //if(YTDL.apply.validateLink(message)) {
                                play(connection, message);
                            //}
                        });
                    }
                }
            } else if(args[0].toLowerCase() == "skip") {
                var server = servers[message.guild.id];
                
                if(server.dispatcher) {
                    server.dispatcher.end();
                }
            } else if(args[0].toLowerCase() == "stop") {
                var server = servers[message.guild.id];
                
                if(message.guild.voiceConnection) {
                    message.guild.voiceConnection.disconnect();
                }
            } else if(args[0].toLowerCase() == "does_babak_like_collin?") {
                message.channel.sendMessage("Yes.");
            } else {
                message.channel.sendMessage("Invalid Command");
            }
        }
    }
});

bot.login(TOKEN);
