//npm run deploy//////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    Global Variables                                              //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Main Panel(top)
 ////////////////////////////////////////*/
var panel = document.getElementById("video-panel");
var editor = document.getElementById('editor-panel');
/*////////////////////////////////////////
Public Key
 ////////////////////////////////////////*/
var apik = "&key=AIzaSyC8RAHhZg50R3V9IRPE6SimzIx9Q9NgBkI";
/*////////////////////////////////////////
 Hardcoded channels
 ////////////////////////////////////////*/
var channelsList = {
    freeCodeCamp: "UC8butISFwT-Wl7EV0hUK0BQ",
    TheNetNinja: "UCW5YeuERMmlnqo4oq8vwUpg",
    DevTips: "UCyIe-61Y8C4_o-zZCtO4ETQ",
    LevelUpTuts: "UCJbPGzawDH1njbqV-D5HqKw",
    coderGuide: "UCwHrYi0GL6dmYaRB0StEbEA",
    easyDevTuts: "UCI-vEugj8uNGB_ZFuutlMYw",
    CodeSchool: "UCUFbBYzSUafxMpUbTmroGhg"
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        0: Fetch data object from API                                             //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function request(url) {
    return new Promise(function(resolve) {
        var rawData, data;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            //console.log("request.onload initiated");
            if (request.status >= 200 && request.status < 400) {
                rawData = this.response;
                response = JSON.parse(this.response);
                resolve(response);
            } else {
                console.log('Not found');
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
 Loops through channelsList and builds url for each channel to send to fetchChannels
 ////////////////////////////////////////*/
function getChannels() {
    for (var key in channelsList) {
        /*console.log(key + " " + channelsList[key]);*/
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
        parseChannels(response);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in channels list
 ////////////////////////////////////////*/
function parseChannels(response) {
    var listItem = [];
    var channelId = response.items[0].id;
    var title = response.items[0].snippet.title;
    var logo = response.items[0].snippet.thumbnails.default.url;
    listItem = [
        '<div class="list-item button">',
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
    channelListEntries.onclick = function() {
        getPlaylists(channelId);
        //this.classList.add('active');

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
    var channel = "&channelId=" + channelId;
    var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&maxResults=50" + channel + apik;
    fetchPlaylists(url);
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response.
 ////////////////////////////////////////*/
function fetchPlaylists(url) {
    request(url).then(function(response) {
        parsePlaylists(response);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in main panel. Playlists.
 ////////////////////////////////////////*/
function parsePlaylists(response) {
    panel.innerHTML = "";
    var playListContainer = [];
    var playLists = response.items;
    for (var i = 0; i < playLists.length; i++) {
        var playlistId = playLists[i].id;
        var thumbnail = playLists[i].snippet.thumbnails.medium.url;
        var playlistTitle = playLists[i].snippet.localized.title;
        var videoNum = playLists[i].contentDetails.itemCount;
        playListContainer = [
            '<div class="play-list-container">',
            '<div id="' + playlistId + '" class="thumbnail"><img src="' + thumbnail + '"></div>',
            '<div class="playlist-title"><p>' + playlistTitle + '</p><p class="video-num">' + videoNum + '</p><p>Video\'s</p></div>',
            '</div>'
        ].join('\n');
        scrollTo(panel, panel.offsetTop, 0);
        panel.insertAdjacentHTML('beforeend', playListContainer);
        createPlaylistVideos(playlistId);
    }
}
/*////////////////////////////////////////
 Set up playlist thumbnail to bring up video's
 ////////////////////////////////////////*/
function createPlaylistVideos(playlistId) {
    var playlistEntry = document.getElementById(playlistId);
    playlistEntry.onclick = function() {
        getPlaylistVideos(playlistId);
    };
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//       3: Load playlists entries into main panel  + configure iframe for insertion on click       //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Activated when playlist thumbnail is clicked, builds API url to fetch the vdeos
 ////////////////////////////////////////*/
function getPlaylistVideos(playlistId) {
    var playlistVids = "&playlistId=" + playlistId;
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
    fetchPlaylistVids(url);
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response.
 ////////////////////////////////////////*/
function fetchPlaylistVids(url) {
    request(url).then(function(response) {
        parsePlaylistVids(response);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in main panel. Playlists individual videos.
 ////////////////////////////////////////*/
function parsePlaylistVids(response) {
    panel.innerHTML = "";
    var videoContainer = [];
    var videos = response.items;
    for (var i = 0; i < videos.length; i++) {
        var videoId = videos[i].snippet.resourceId.videoId;
        var thumbnail = videos[i].snippet.thumbnails.medium.url;
        var videoTitle = videos[i].snippet.title;
        videoContainer = [
            '<div class="video-container">',
            '<div id="' + videoId + '" class="thumbnail"><img src="' + thumbnail + '"></div>',
            '<div class="video-title">' + videoTitle + '</div>',
            '</div>'
        ].join('\n');
        scrollTo(panel, panel.offsetTop, 0);
        panel.insertAdjacentHTML('beforeend', videoContainer);
        createVideo(videoId, videoTitle);
    }
}
/*////////////////////////////////////////
Set up playlist thumbnail to bring up video's
////////////////////////////////////////*/
function createVideo(videoId, videoTitle) {
    var playlistEntry = document.getElementById(videoId);
    playlistEntry.onclick = function() {
        panel.innerHTML = "";
        var video = [
            '<iframe',
            '  src="//www.youtube.com/embed/' + videoId + '"',
            '  width="100%"',
            '  height="100%"',
            '  frameborder="0"',
            '  scrolling="no"',
            '  allowfullscreen>',
            '</iframe>'
        ].join('\n');
        scrollTo(panel, panel.offsetTop, 0);
        panel.insertAdjacentHTML('beforeend', video);
        Cookies.set('LastViewedVideo', video);
        title.value = videoTitle;
    };
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                           FEATURES                                               //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
 Load Last video & Note
 ////////////////////////////////////////*/
var lastVidPlayed = document.getElementById('lastVid');
lastVidPlayed.onclick = function() {
    if (typeof Cookies('LastViewedVideo') !== 'undefined') {
        panel.innerHTML = Cookies('LastViewedVideo');
        title.value = myNotes[lastNote].title; //variable is declared in notes.js
    } else {
        alert('You can\'t continue what you havn\'t started. Choose a playlist and watch a video to get started.');
    }

};
/*////////////////////////////////////////
Resize Video panel
 ////////////////////////////////////////*/
var vidLarge = document.getElementById('videoLarge');
var vidDefault = document.getElementById('videoDefault');
var vidSmall = document.getElementById('videoSmall');
vidLarge.onclick = function() {
    panel.classList.remove('small');
    panel.classList.add('large');
    editor.classList.remove('large');
    editor.classList.add('small');
    vidDefault.classList.remove('active');
    vidSmall.classList.remove('active');
    vidLarge.classList.add('active');
};
vidDefault.onclick = function() {
    panel.classList.remove('small');
    panel.classList.remove('large');
    editor.classList.remove('large');
    editor.classList.remove('small');
    vidSmall.classList.remove('active');
    vidLarge.classList.remove('active');
    vidDefault.classList.add('active');
};
vidSmall.onclick = function() {
    panel.classList.add('small');
    panel.classList.remove('large');
    editor.classList.add('large');
    editor.classList.remove('small');
    vidDefault.classList.remove('active');
    vidLarge.classList.remove('active');
    vidSmall.classList.add('active');
};


/*////////////////////////////////////////
Menu slide control
 ////////////////////////////////////////*/

var handle = document.getElementById('menu-handle');
var rightPanel = document.getElementById('right-panel');
var leftPanel = document.getElementById('left-panel');
handle.addEventListener('click', function() {
    rightPanel.classList.toggle('menu-open');
    leftPanel.classList.toggle('menu-open');
});
