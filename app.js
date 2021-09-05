//var request = require('request');
var http = require("http");
var fs = require("fs");
const { error, count } = require("console");
const { Client, Message, TeamMember } = require("discord.js");
const ytdl = require("ytdl-core");
var util = require("util");
const prefix = "_";
const client = new Client({ disableEveryone: true });
const abo_atash = [
  "Radio Javan\\Abo-Atash-78.mp3",
  "Radio Javan\\Abo-Atash-80.mp3",
  "Radio Javan\\Abo-Atash-81.mp3",
  "Radio Javan\\Abo-Atash-84.mp3",
  "Radio Javan\\Abo-Atash-88.mp3",
  "Radio Javan\\Abo-Atash-20130530_2.mp3",
  `Radio Javan\\Abo-Atash-20130906_2.mp3`,
  "Radio Javan\\Dj Taba - Abo Atash Episode 113.mp3",
];
const favname = ["divane"];
const faveaddtrss = ["fav\\divane_tina-yusefi.mp3"];
fav.set("divane", "fav\\divane_tina-yusefi.mp3");
client.on("ready", () => {
  console.log("hell yeah im in !!");
});
client.login("TOKEN");
let queue = [];
let queue_name = [];
let is_playing = false;
async function play_queue( voiceChannel) {
  console.log(queue);
  if (!is_playing) {
    var connection;
    try {
      connection =await voiceChannel.join();
    } catch (error) {
      console.log(
        `there was an error connection to voice channel ${error} `
      );
      message.channel.send(
        `there was an error connection to voice channel ${error} `
      );
    }
    var i = 0;
    for (i = 0; i < queue.length; i++) {
      console.log(`queue length:${queue.length}`);
      is_playing = true;

      if (queue[0] != undefined) {
        console.log(`now playing ${queue[0]}`);
        var dispatcher = await connection.play(queue[0]).on("finish", () => {
          queue_name.shift();
          queue.shift();
          i--;
          if (queue.length == 0) {
            is_playing = false;
            voiceChannel.leave();
          }
        });
      } else {
        console.log("undefined array error");
      }
    }
  }
}
async function queue_list(message) {
  if (queue.length == 0) {
    message.channel.send(`there is no audio in queue`);
  } else {
    message.channel.send(`now playing : ${queue_name[0]}`);
    for (i = 1; i < queue.length; i++) {
      message.channel.send(`${i}. ${queue_name[i]}`);
    }
  }
}
async function boro() {
  while (queue.length != 0) {
    queue.shift();
    queue_name.shift();
    is_playing = false;
  }
}
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  console.log(
    `author: -${message.author.username}- recived message : ${message.content}`
  );
  const args = message.content.substring(prefix.length).split(" ");
  if (
    message.content.startsWith(`${prefix}bia`)
  ) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        `you need be in voice channel ${message.author.username}`
      );
    const premission = voiceChannel.permissionsFor(message.client.user);
    if (!premission.has("CONNECT"))
      return message.channel.send(
        `bot dont have premission to join voice channel`
      );
    if (!premission.has("SPEAK"))
      return message.channel.send(
        `bot dont have premission to speak in voice channel`
      );

    try {
      var connection = await voiceChannel.join();
      let members = voiceChannel.guild.members;
      console.log(members.guild)
      let count = connection.listenerCount();

    } catch (error) {
      console.log(`there was an error connection to voice channel ${error} `);
      message.channel.send(
        `there was an error connection to voice channel ${error} `
      );
    }
    let dispatcher = connection
      .play("")
      .on("finish", () => {
      })
      .on("error", (error) => {
        console.log(error);
      });

    dispatcher.setVolumeLogarithmic(5 / 5);
  } else if (message.content.startsWith(`${prefix}boro`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        `you need be in voice channel ${message.author}`
      );
    message.member.voice.channel.leave();
    boro();
    return undefined;
  }  else if (message.content.startsWith(`${prefix}rj`)) {
    console.log("rj");
    const voiceChannel = message.member.voice.channel;
    var spawn = require("child_process").spawn;
    console.log(message.content.split(" ")[1]);
    var process = spawn("python", ["Rj.py ", message.content.split(" ")[1]]);

    util.log("readingin");
    var py_output;
    process.stdout.on("data", function (chunk) {
      py_output = chunk.toString("utf8");
      if (py_output != "somthing is wrong") {
        var connection;
        console.log("python process sucsessful");
        console.log(py_output.split(" spit "));
        var song_name = py_output.split(" spit ")[0];
        var song_artist = py_output.split(" spit ")[1];
        var song_link = py_output.split(" spit ")[2];
        var song_lyric = py_output.split(" spit ")[3];
        message.channel.send(`${song_name}\n${song_artist}\n\nlyrics:\n${song_lyric}`);
        queue.push(song_link);
        queue_name.push(song_name);
        play_queue( voiceChannel);
      } else {
        console.log("fail");
      }
    });
  }  else if (message.content.startsWith(`${prefix}music`)) {
    let name = message.content.substring(7);
    console.log("Radio Javan\\" + name + ".mp3");
    const voiceChannel = message.member.voice.channel;
    let song;
    if (abo_atash.includes("Radio Javan\\" + name + ".mp3")) {
      song = "Radio Javan\\" + name + ".mp3";
    } else {
      message.channel.send(
        `music did not found I play random by my self😉 ${message.client}`
      );
      const index = Math.floor(Math.random() * abo_atash.length);
      song = abo_atash[index];
      name = song.substring(12, song.length - 4);
      console.log(song.substring(12, song.length - 4));
      message.channel.send(
        `I choose ${song.substring(12)} I hope you enjoy it`
      );
    }

    console.log(song);
    try {
      var connection = await voiceChannel.join();
    } catch (error) {
      console.log(`there was an error connection to voice channel ${error} `);
      message.channel.send(
        `there was an error connection to voice channel ${error} `
      );
    }
    queue.push(song);
    queue_name.push(name);
    play_queue(connection, voiceChannel);
  } else if (message.content.startsWith(`${prefix}favorite`)) {
    let name = message.content.substring(10);

    console.log("-" + name + "-");
    const voiceChannel = message.member.voice.channel;
    let song;
    if (favname.includes(name)) {
      let index = favname.indexOf(name);
      song = faveaddtrss[index];
    } else {
      message.channel.send(
        `music did not found I play random by my self😉 @${message.author.username}`
      );
      const index = Math.floor(Math.random() * favname.length);
      //console.log(fav.keys(index));
      song = faveaddtrss[index];
      message.channel.send(`I choose ${song.substring(4)} I hope you enjoy it`);
    }

    console.log(song);
    try {
      connection = await voiceChannel.join();
    } catch (error) {
      console.log(`there was an error connection to voice channel ${error} `);
      message.channel.send(
        `there was an error connection to voice channel ${error} `
      );
    }
    queue.push(song);
    queue_name.push(song.substring(4));
    play_queue(connection, voiceChannel);
    dispatcher.setVolumeLogarithmic(5 / 5);
  } else if (message.content.startsWith(`${prefix}link`)) {
    const voiceChannel = message.member.voice.channel;
    let name = message.content.split(" ");
    let link = name[1];
    //message.channel.send(`${message.author.mentions}`);
    console.log(link);
    try {
      connection = await voiceChannel.join();
    } catch (error) {
      console.log(`there was an error connection to voice channel  ${error} `);
      message.channel.send(
        `there was an error connection to voice channel ${error} `
      );
    }
    queue.push(link);
    queue_name.push("from link");
    play_queue(connection, voiceChannel);
    // const dispatcher = connection.play(link)
    // .on('finish',()=>{
    //    voiceChannel.leave();
    //
    //})
  }
   else if (message.content.startsWith(`${prefix}queue`)) {
    queue_list(message);
  } else if (message.content.startsWith(`${prefix}yt`)) {
    const voiceChannel = message.member.voice.channel;
    let name = message.content.split(" ");
    let link = name[1];
    if (
      link.includes("www") &&
      link.includes(".com") &&
      (link.includes("youtube") || link.includes("youtu.be"))
    ) {
      const stream = ytdl(link, { filter: "audioonly", dlChunkSize: 0 });
      ytdl.getInfo(id).then((info) => {
        const tracks =
          info.player_response.captions.playerCaptionsTracklistRenderer
            .captionTracks;
        if (tracks && tracks.length) {
          console.log(
            "Found captions for",
            tracks.map((t) => t.name.simpleText).join(", ")
          );
          const track = tracks.find((t) => t.languageCode === lang);
          if (track) {
            name = track.name.simpleText;
            console.log("Retrieving captions:", track.name.simpleText);
            console.log("URL", track.baseUrl);
            const output = `${info.videoDetails.title}.${track.languageCode}.${format}`;
            console.log("Saving to", output);
            https.get(
              `${track.baseUrl}&fmt=${format !== "xml" ? format : ""}`,
              (res) => {
                res.pipe(fs.createWriteStream(path.resolve(__dirname, output)));
              }
            );
          } else {
            console.log("Could not find captions for", lang);
          }
        } else {
          console.log("No captions found for this video");
        }
      });
      queue.push(stream);
      queue_name.push(name);
      play_queue(connection, voiceChannel);
    }

  }
});

/*
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    console.log();

    const dispatcher = connection.play('audio_2020-11-28_02-55-39.ogg')
    dispatcher.setVolumeLogarithmic(5/5)
    if (oldUserChannel === undefined && newUserChannel !== undefined) {

        console.log("a new user joined\n");

        
    } else if (newUserChannel === undefined) {
        console.log("someone left");
        //const dispatcher = broadcast.play('');
        //console.log(newUserChannel.Id)
        // User leaves a voice channel

    }
})*/
