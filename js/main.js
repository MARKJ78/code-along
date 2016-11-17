function showMyVideos(data) {
    var feed = data.feed;
    var entries = feed.entry || [];
    var html = ['<ul>'];
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = entry.title.$t;
        html.push('<li>', title, '</li>');
    }
    html.push('</ul>');
    document.getElementById('videos').innerHTML = html.join('');
}

function request(url, channel) {
    console.log("request initiated");
    return new Promise(function(resolve) {
        console.log("promise initiated");
        var rawData, data;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            console.log("request.onload initiated");
            if (request.status >= 200 && request.status < 400) {
                rawData = this.response;
                response = JSON.parse(this.response);
                resolve(response);
                console.log(response);
                console.log(channel + ' fetch request successful');
                console.log(' in request');
            } else {
                // if result is an error, (single channel only) turn icon red in faves list
                /*$('#fave-' + channel).addClass('c-not-found');*/
                console.log(channel + ' is no longer with us, please remove the channel from your favorites list.');
            }
        };
        request.send();
    });
}

//var url = "https://www.googleapis.com/youtube/v3/videos?id=qzaBVoti3U0&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI&part=snippet,contentDetails,statistics,status";
//var url = "https://www.googleapis.com/youtube/v3/youtube.channels.list?&part=id&forUsername=";
var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&channelId=UCW5YeuERMmlnqo4oq8vwUpg&maxResults=50&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
var channel = "GoogleDevelopers";
displayIn = "";

function fetch(displayIn, url, channel) {
    console.log('fetch ' + channel);
    request(url, channel).then(function(response) {
        /*parse(displayIn, response);*/
    });
}
fetch(displayIn, url, channel);
