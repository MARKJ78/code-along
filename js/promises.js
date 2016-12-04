//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        Fetch data object from API                                                //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function fetch(url) {
    return new Promise(function(resolve) {
        var rawData, data;
        var fetch = new XMLHttpRequest();
        fetch.open('GET', url, true);
        fetch.onload = function() {
            if (fetch.status >= 200 && fetch.status < 400) {
                rawData = this.response;
                response = JSON.parse(this.response);
                resolve(response); //back to you
            } else {
                console.log('Not found / not working or something like that');
            }
        };
        fetch.send();
    }); //end promise
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        CONTINUE WHERE LEFT OFF                                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Activated when continue where you left off clicked, builds API url to fetch the vdeos
 ////////////////////////////////////////*/
function getLastPlaylistVideos(playlistId) {
    return new Promise(function(sendBack) {
        //build url, get response then return promise for video build.
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        fetch(url).then(function(response) {
            responseBin = response; //update response bin & Length
            binLength = responseBin.items.length - 1;
            Cookies.set('responseBin', responseBin);
            Cookies.set('binLength', binLength);
            sendBack(response); //back to you
        });
    });
}









function getPlaylists(channelId) {
    return new Promise(function(playlists) {
        var channel = "&channelId=" + channelId;
        var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&maxResults=50" + channel + apik;
        fetch(url).then(function(response) {
            playlists(response); //back to you
        });
    }); //end promise
}

function getPlaylistVids(playlistId) {
    return new Promise(function(videos) {
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        fetch(url).then(function(response) {
            responseBin = response;
            binLength = response.items.length - 1;
            Cookies.set('responseBin', responseBin);
            Cookies.set('binLength', binLength);
            videos(response); //back to you
        });
    }); //end promise
}









/*////////////////////////////////////////
Public Key
 ////////////////////////////////////////*/
var apik = "&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
