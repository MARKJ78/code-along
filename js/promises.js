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
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                rawData = this.response;
                data = JSON.parse(this.response);
                resolve(data); //back to you fetcher
            } else {
                //console.log('Not found / not working or something like that');
            }
        };
        request.send();
    }); //end promise
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    Get playlists                                                 //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function getPlaylists(channelId) {
    return new Promise(function(playlists) {
        var channel = "&channelId=" + channelId;
        var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&maxResults=50" + channel + apik;
        fetch(url).then(function(response) {
            playlists(response); //back to you
        });
    }); //end promise
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                            Get playlist video's                                                  //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function getPlaylistVids(playlistId) {
    return new Promise(function(videos) {
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        fetch(url).then(function(response) {
            var length = response.items.length;
            currentPlaylist = playlistId;
            CurrentPlaylistLength = length;
            Cookies.set('playlist', playlistId);
            Cookies.set('listLength', length);
            videos(response); //back to you
        });
    }); //end promise
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                 Colour Animations                                                 //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//button flash
function bump(el) {
    return new Promise(function(animate) {
        el.classList.add('bump-stop');
        setTimeout(function() {
            animate(); //back to you
        }, 1000);
    });
}

function good(el) {
    return new Promise(function(animate) {
        el.classList.add('ohYeh');
        setTimeout(function() {
            animate();
        }, 1000);
    });
}

function bad(el) {
    return new Promise(function(animate) {
        el.classList.add('heyNo');
        setTimeout(function() {
            animate();
        }, 1000);
    });
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
/*function getLastPlaylistVideos(playlistId) {
    return new Promise(function(sendBack) {
        //build url, get response then return promise for video build.
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        fetch(url).then(function(response) {
            currentPlaylist = playlistId;
            playlistLength = length;
            Cookies.set('playlist', currentPlaylist);
            Cookies.set('listLength', playlistLength);
            sendBack(response); //back to you
        });
    });
}*/




/*////////////////////////////////////////
Public Key
 ////////////////////////////////////////*/
var apik = "&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
