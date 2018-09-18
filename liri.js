require("dotenv").config();
var fs = require("fs");
var keys = require('./key.js');
var Spotify = require('node-spotify-api');
//var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");



// Grab search command line argument
var search = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var term = process.argv.slice(3).join(" ");

//function that call for a spotify search.
spotifysearch = function() {
  var spotify = new Spotify(keys.spotify);
  
    spotify.search({type: 'track', query: term}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
        }
    //This part of code came off of the internet. This was the only one that I could get to work.    
    var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						log(spotifyResults); // calling log function
					}
        }
      });

}

moviesearch = function() {
  //This code came from homwork 18 in Nodesjs
  var queryURL = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";
  request(queryURL, function(error, response, body) {
    var moviequery = JSON.parse(body);
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Ratings: " + JSON.parse(body).imdbRating);

  //Had to add this part in to account for the movies that don't have Rotten Tomato score i.e. Friday

  /*for (var i = 0; JSON.parse(body).Ratings.length; i++)
      if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[i].Value);
        if (JSON.parse(body).Ratings[i].Website !== undefined) {
          console.log("Rotten Tomatoes URL: " + JSON.parse(body).Ratings[i].Website);
        }
      }*/
  //This way works best for tv movies like New Editon that doesn't have a Rotten Tomatoe score.    
      for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
      if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
        console.log("Rotten Tomatoes Ratings: " + JSON.parse(body).Ratings[i].Value);
      } 
    } 

  //continuing on with the code    
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Plot: " + JSON.parse(body).Plot);
      log("Title: " + JSON.parse(body).Title + "\r\n" +
          "Release Year: " + JSON.parse(body).Year + "\r\n" +
          "IMDB Rating: " + JSON.parse(body).imdbRating + "\r\n" + 
          //"Rotten Tomatoes Ratings: " + JSON.parse(body).Ratings[i].Value + "\r\n" +
          "Country: " + JSON.parse(body).Country + "\r\n" +
          "Language: " + JSON.parse(body).Language + "\r\n" +
          "Actors: " + JSON.parse(body).Actors + "\r\n" +
          "Plot: " + JSON.parse(body).Plot + "\r\n" +
         "---------------------------------------------------------------------------------" + "\r\n");
        

    }

  });
}


concertsearch = function() {
  var queryURL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
  request(queryURL, function (error, response, body) {
    if (error) console.log(error);
    var result  =  JSON.parse(body)[0];
    console.log("Venue name " + result.venue.name);
    console.log("Venue location " + result.venue.city);
    console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));
  log("Searching for " + term + "\r\n" +  
      "Vanue name " + result.venue.name + "\r\n" +
      "Venue location " + result.venue.city + "\r\n" +
      "Date of Event " +  moment(result.datetime).format("MM/DD/YYYY") + "\r\n"  +
      "------------------------------------------------------------------------" + "\r\n");
  //log(result);
  });
}

//log function for appending to the log file
log = function(logresults) {
  fs.appendFile("log.txt", logresults, function(err) {
    if (err) throw err;
    console.log("The file has been saved!");
  })
}




// Print whether searching for a concert, song, movie, or ??
if (search === "concert-this") {
  console.log("Searching " + term);
  concertsearch();
 


 //Spotify section 
} else if (search === "spotify-this-song") {
  console.log("Searching " + term);
  //If no search is provide then it will default to "the sign"
  if (!term) {
    term = "The Sign";
    console.log("Searching for " + term);
  }
  //Calls function spotifysearch
  spotifysearch();
  

//Movie search call the function for searching movies.   
} else if (search === "movie-this") {
    console.log("Searching " + term);
    moviesearch();

    
//do-what-it-says section
} else if (search ==="do-what-it-says") {
    console.log("");
    
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
     
      if (data.indexOf(",") != -1) {
        var fileContent = data.split(",");
        search = fileContent[0];
        term = fileContent[1];

      }else {
        search = data;
      } 

      if (search === "spotify-this-song") {
        spotifysearch(term)
      } else if (search === "movie-this") {
        moviesearch(term);
      } else if (search === "concert-this") {
        concertsearch();
      }

      
    });
}






