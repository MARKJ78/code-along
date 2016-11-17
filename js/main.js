//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        0: Fetch data object from API                                             //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

function request(url) {
    //console.log("request initiated");
    return new Promise(function(resolve) {
        //console.log("promise initiated");
        var rawData, data;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            //console.log("request.onload initiated");
            if (request.status >= 200 && request.status < 400) {
                rawData = this.response;
                response = JSON.parse(this.response);
                resolve(response);

                //console.log(channel + ' fetch request successful');
                //console.log(' in request');
            } else {
                // if result is an error, (single channel only) turn icon red in faves list
                /*$('#fave-' + channel).addClass('c-not-found');*/
                console.log('no longer with us, please remove the channel from your favorites list.');
            }
        };
        request.send();
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        1: Set up favorite channels on page load                                  //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
 Hardcoded channels
 ////////////////////////////////////////*/
var channelsList = {
    freeCodeCamp: "UC8butISFwT-Wl7EV0hUK0BQ",
    TheNetNinja: "UCW5YeuERMmlnqo4oq8vwUpg"
};

/*////////////////////////////////////////
 Loops through channelsList and builds url for each channel to send to fetchChannels
 ////////////////////////////////////////*/
function getChannels() {
    for (var key in channelsList) {
        /*console.log(key + " " + channelsList[key]);*/
        var apik = "&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
        var channel = "&id=" + channelsList[key];
        var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet" + channel + apik;
        fetchChannels(url);
    }
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response. called as many times as there are channels
 ////////////////////////////////////////*/
function fetchChannels(url) {
    //console.log(url);
    request(url).then(function(response) {
        //
        parseChannels(response);
    });
}

/*////////////////////////////////////////
 Creates & configures entries in channels list
 ////////////////////////////////////////*/
function parseChannels(response) {
    var channelId = response.items[0].id;
    var title = response.items[0].snippet.title;
    var logo = response.items[0].snippet.thumbnails.default.url;
    var listItem = [
        '<div class="list-item">',
        '<p class="channel-title">' + title + '</p>',
        '<span class="channel-logo" id="logo-' + channelId + '"><img src="' + logo + '"></span>',
        '</div>'
    ].join('\n');
    var newLi = document.createElement("li");
    var list = document.getElementById("channels").getElementsByTagName("ul")[0];
    list.appendChild(newLi);
    var newId = document.createAttribute("id");
    newId.value = channelId;
    newLi.setAttributeNode(newId);
    var newClass = document.createAttribute("class");
    newClass.value = "li-channel";
    newLi.setAttributeNode(newClass);
    newLi.innerHTML = listItem;
    creatPlaylistLinks(channelId);
}

/*////////////////////////////////////////
 Set up list item to bring up playlists
 ////////////////////////////////////////*/
function creatPlaylistLinks(channelId) {
    var channelListEntries = document.getElementById(channelId);
    //console.log(showPlaylists);
    channelListEntries.onclick = function() {
        getPlaylists(channelId);
    };
}
/*////////////////////////////////////////
 initialise script
 ////////////////////////////////////////*/
getChannels();


//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        2: Load channel playlists into main panel                                 //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Activated when channel is clicked, builds API url to fetch those playlists
 ////////////////////////////////////////*/
function getPlaylists(channelId) {
    var apik = "&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
    var channel = "&channelId=" + channelId;
    var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&maxResults=50" + channel + apik;
    fetchPlaylists(url);
    //console.log("yay" + channelId);
}

/*////////////////////////////////////////
requests an API call from step 0 waits for response.
 ////////////////////////////////////////*/
function fetchPlaylists(url) {
    //console.log(url);
    request(url).then(function(response) {
        parsePlaylists(response);

    });
}

/*////////////////////////////////////////
 Creates & configures entries in main panel. Playlists.
 ////////////////////////////////////////*/
function parsePlaylists(response) {
    //console.log(response);
    var playListContainer = [];
    var playLists = response.items;
    for (var i = 0; i < playLists.length; i++) {
        var thumbnail = response.items[i].snippet.thumbnails.medium.url;
        var playlistTitle = response.items[i].snippet.localized.title;
        //console.log(playlistTitle);
        playListContainer = [
            '<div class="play-list-container">',
            '<div class="thumbnail"><img src="' + thumbnail + '"></div>',
            '<div class="playlist-title">' + playlistTitle + '</div>',
            '</div>'
        ].join('\n');
        var panel = document.getElementById("video-panel");
        panel.insertAdjacentHTML('beforeend', playListContainer);
    }
}


//var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI&playlistId="//Variable; //for getting video list from playlist
//var url = "https://www.googleapis.com/youtube/v3/videos?id=qzaBVoti3U0&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI&part=snippet,contentDetails,statistics,status";
//var url = "https://www.googleapis.com/youtube/v3/youtube.channels.list?&part=id&forUsername=";
