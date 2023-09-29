var Bot    = require('ttapi');
var AUTH   = 'auth+live+60338bc9242a56f0994fbac4367c9f733882d4a7';
var USERID = '4fd588b8aaa5cd1b3700017b';
var ROOMID = '60447c1147b5e3001f34ce27';
var repl = require('repl');
var currentRoom = ROOMID;
var bot = new Bot(AUTH, USERID, ROOMID);

repl.start('> ').context.bot = bot;
var steph = '4e9000e74fe7d04235046f2f';
var currentAvatar = 14;
var jbear = 14;
var allowAuto = false;
var greetings = [":wave: @", "ohai @", "soup @", "wat ", "wasabi "];

var songName; //name of currently playing song
var genre; //genre of currently playing song
var artist; //artist of currently playing song
var newSong; //ID of currently playing song
var albumName; //name of album
var albumDate; //date album was released
var bio; // bio of artist
var plistlength = undefined; // playlist length

bot.on('roomChanged', function (data) {
   console.log("I'm in " + data.room.name.toUpperCase());
   bot.stalk(steph, function(data) {
            if (data.roomId != currentRoom) {
               if (data.roomId === undefined) {
                  console.log('No E!');
               }
               else { 
                  console.log('Looking for E~'); 
                  bot.roomRegister(data.roomId);
                  currentRoom = data.roomId;
               }
            }
   });

   try {
      bot.playlistAll(function(data) { 
      plistlength = data.list.length;
      console.log('I have '+plistlength+' songs in my queue.\n');
      });
   }
   catch(err) {
      console.log('No songs in my queue.');
   }

   // log current playing info
   try {
      songName = data.room.metadata.current_song.metadata.song;
      genre = data.room.metadata.current_song.metadata.genre;
      artist = data.room.metadata.current_song.metadata.artist;
      console.log('>SONG INFO: "' + songName + '" by ', artist,'= ' + genre)
   }
   catch(err) {
      console.log("It's quiet. Why am I here?");
   }
});

bot.on('deregistered', function (data) {
   var user = data.user[0];
   console.log(user.name + " has left the room.");
});

bot.on('registered', function (data) {
   var user = data.user[0];
   console.log(user.name + " has entered the room!");
});

bot.on('newsong', function (data) {
   if (allowAuto === true)
      bot.bop();

   // for every new song, retrieve and store the metadata and log it to console
   songName = data.room.metadata.current_song.metadata.song;
   genre = data.room.metadata.current_song.metadata.genre;
   artist = data.room.metadata.current_song.metadata.artist;
   console.log('>>SONG INFO: "' + songName + '" by ', artist,' = ' + genre);
});

bot.on('pmmed', function (data) {
   pmSender = data.senderid;

   if (data.text.match(/go home/)) {
      bot.roomRegister('60447c1147b5e3001f34ce27');
      bot.pm("Went back home. :[");
      console.log("I went back to my party! :D");
      sleep(5000);
   }

   else if (data.text.match(/to ID/)) {
      bot.roomRegister('604078b63f4bfc001be4cab9');
      bot.pm("Went to yuppytown!");
      console.log("I went to Indie Discotheque.");
      sleep(5000);
   }

   else if (data.text.match(/playlist/i)) {
      var playlisttext = [];  
      bot.playlistAll(function(data) { 
         plistlength = data.list.length;
            for(var i = 0; i < plistlength; i++) {
               playlisttext.push((i+1) + ". " + data.list[i].metadata.artist + ' - ' + data.list[i].metadata.song + "\n"); 
            }
         bot.pm("This is what's in my playlist " + playlisttext, pmSender);
      });
   }
   else if (data.text.match(/q/)) {
      bot.roomInfo(true, function(data) {
         newSong = data.room.metadata.current_song._id;
         bot.playlistAdd(newSong, plistlength);
         bot.snag();
         plistlength++;
         bot.vote('up');
         bot.pm("Stolen!", pmSender);
         console.log("I took the currently playing song for my own queue.");
      });
   }
   else if (data.text.match(/^genre?$/)) {
      bot.pm("Yep, sounds like " + genre + " to me.", pmSender);
   }
});

bot.on('speak', function (data) {
   // get the data
   var name = data.name;
   var text = data.text;
   console.log(name + "(" + data.userid + "): " + text);
   var greeting = false;
   shuffle();
 
   // respond to greeting
   if ((text.match(/hi/i) || text.match(/ohai/i) || text.match(/hay/i)) && (text.match(/dolan/i))) {
         bot.speak(getRandomResponse(greetings)+name);
   }

   else if (text.match(/swag/i) || text.match(/dubstep/i) || text.match(/yolo/i) || text.match(/#YOLO/i)) {
      bot.speak("http://www.youtube.com/watch?v=YhkNLHictW8");
   }

   else if (text.match(/^gooby pls$/) && data.userid === steph) {
         bot.speak('y u so stupid');
         console.log("IS DOLAN");
         bot.vote('up');
   }

   else if (text.match(/^gtfu$/)) {
         console.log("I hopped up on decks.");
         bot.addDj();
   }

   else if (text.match(/^stfd$/)) {
         bot.speak('I do what I want! /tableflip');
         console.log("If I fits, I sits.");
         bot.remDj();
   }

   else if (text.match(/^skip$/)) {
            bot.skip();
   }

   else if (text.match(/^[*]yoink$/i) && data.userid === steph) {
      bot.roomInfo(true, function(data) {
         newSong = data.room.metadata.current_song._id;
         bot.playlistAdd(newSong, plistlength);
         bot.snag();
         plistlength++;
         bot.vote('up');
         console.log("I took the currently playing song for my own queue.");
       });
   }

   else if (text.match(/^nomnom$/) && data.userid === steph) {
         if (allowAuto === false) {
            console.log("Start freebonus.");
            allowAuto = true;
            bot.vote('up');
            bot.speak('Cheaters!');
         }
         else {
            console.log("Stop freebonus.");
            allowAuto = false;
            bot.speak('Fine. /whatever');
         }
   }
   else if (text.match(/nigger/i)) {
         bot.boot(data.userid, "http://www.youtube.com/watch?v=YhkNLHictW8");
   }
   else if (text.match(/disco/i)) {
            if(text.match(/start/i)) {
               allowDiscoMode = true;
               var discoTimer= setInterval(function() {
                  if( !allowDiscoMode ) {
                     clearInterval(discoTimer);
                     return;
                  }
                  if( currentAvatar < 17 ) {
                     currentAvatar++;
                  } 
                  else {
                     currentAvatar = 10;
                  }
                  bot.setAvatar(currentAvatar);
               },600);
            }
            else if (text.match(/stop/i)){
               allowDiscoMode = false;
               bot.setAvatar(jbear);
            }
         }
   
});

function sleep(ms) {
   var dt = new Date();
   dt.setTime(dt.getTime() + ms);
   while (new Date().getTime() < dt.getTime());
}

sayRandomResponse = function(responses) {
   bot.speak(responses[Math.floor(Math.random()*responses.length)]);
};

getRandomResponse = function(responses) {
   return responses[Math.floor(Math.random()*responses.length)];
};

shuffle = function () {
   bot.playlistReorder(Math.floor(Math.random()*plistlength),0);
};