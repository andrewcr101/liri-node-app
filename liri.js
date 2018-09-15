//require("/.env").config();

//var spotify = new Spotify(keys.spotify);
var request = require("request");
var BandsInTownEvents = require('bandsintown-events');
// Grab search command line argument
var search = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var term = process.argv.slice(3).join(" ");

//var Events = new BandsInTownEvents();

/* By default, if no search type is provided, search for a tv show
if (!search) {
  search = "show";
}

// By default, if no search term is provided, search for "Andy Griffith"
if (!term) {
  term = "Andy Griffith";
}*/

// Print whether searching for a concert, song, movie, or ??
if (search === "concert-this") {
  console.log("Searching " + term);
  var queryURL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
  request(queryURL, function (error, response, body) {
    if (error) console.log(error);
    var result  =  JSON.parse(body)[0];
    console.log("Venue name " + result.venue.name);
    console.log("Venue location " + result.venue.city);
    //console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));
  });

} else if (search === "spotify-this-song") {
  console.log("Searching Spotify");
  
} else if (search === "movie-this") {
    console.log("Searching OMDB")

} else if (search ==="do-what-it-says") {
    console.log("")
}


/*var concert = function() {
    //set options for instance
//app_id and artists are required
Events.setParams({
    "app_id":"myappname", //can be anything
    "artists":[ //accepts string for single artist or an array of artist names
      "Wilco",
      "Yeah Yeah Yeahs"
    ]
  });


    Events.getEvents(function( events ){
        for(var i = 0; i < events.length; i++){
          console.log( events[i].venue.city + ", " + events[i].venue.region );
        }
      },function( errors ){
        console.log(errors);
      });
}*/

