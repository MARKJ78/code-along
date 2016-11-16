var url = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.channels.list?&key=AIzaSyBY_GdF-Y0PGDs6navN3K00aZFUUQbOAYspart=id&forUsername=thenetninja";
var channel = "thenetninja";

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
                console.log(response);
                response = JSON.parse(this.response);
                resolve(response);
                console.log(channel + ' fetch request successful');
                /*console.log(response);
                console.log(' in request');*/
            } else {
                // if result is an error, (single channel only) turn icon red in faves list
                $('#fave-' + channel).addClass('c-not-found');
                console.log(channel + ' is no longer with us, please remove the channel from your favorites list.');
            }
        };
        request.send();
    });
}


request(url, channel);
