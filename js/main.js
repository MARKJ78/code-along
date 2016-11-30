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
    CodeSchool: "UCUFbBYzSUafxMpUbTmroGhg",
    MindSpace: "UCSJbGtTlrDami-tDGPUV9-w",
    codeman: "UCJUmE61LxhbhudzUugHL2wQ"
        //BradTraversy: "TechGuyWeb"
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
function getChannelsList() {
    for (var key in channelsList) {
        /*console.log(key + " " + channelsList[key]);*/
        var channel = "&id=" + channelsList[key];
        var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet" + channel + apik;
        fetchChannelsList(url);
    }
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response. called as many times as there are channels
 ////////////////////////////////////////*/
function fetchChannelsList(url) {
    //console.log(url);
    request(url).then(function(response) {
        parseChannelsList(response);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in channels list
 ////////////////////////////////////////*/
function parseChannelsList(response) {
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
        //this.classList.add('active');
        getPlaylists(channelId);
    };
}
/*////////////////////////////////////////
 initialise script
 ////////////////////////////////////////*/
getChannelsList();
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
    //console.log(response);
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
            '<div class="playlist-title">',
            '<p>' + playlistTitle + '</p>',
            '<p class="video-num">' + videoNum + ' Video\'s</p>',
            '</div>',
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
//       3: Load playlists videos into main panel  + configure iframe for insertion on click        //
//                        set up next / last video functionality                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
var listProgress; //This variable corresponds to the Array index in response to allow for playlist control
var responseBin; //this variable allows playlist control without passing response around
var binLength; //required for if statement on next video buttons
var currentPlaylist; // for thisPlaylist button line 272
/*////////////////////////////////////////
Activated when playlist thumbnail is clicked, builds API url to fetch the vdeos
 ////////////////////////////////////////*/
function getPlaylistVideos(playlistId) {
    currentPlaylist = playlistId;
    Cookies.set('lastPlaylist', currentPlaylist);
    var playlistVids = "&playlistId=" + playlistId;
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
    fetchPlaylistVids(url);
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response.
 ////////////////////////////////////////*/
function fetchPlaylistVids(url) {
    request(url).then(function(response) {
        console.log('Fetch PlaylistVids Initiated');
        responseBin = response;
        binLength = responseBin.items.length - 1;
        parsePlaylistVids(responseBin);
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
        createVideo(response, i); // i will be used to record a the current video's index, to allow configure the video controls
    }
}
/*////////////////////////////////////////
Set up playlist thumbnail to bring up video
////////////////////////////////////////*/
function createVideo(response, i) {
    var videoId = response.items[i].snippet.resourceId.videoId;
    var playlistEntry = document.getElementById(videoId);
    playlistEntry.onclick = function() {
        insertVid(response, i);
    };
}
/*////////////////////////////////////////
Insert a/the video into video panel.
////////////////////////////////////////*/
function insertVid(response, i) {
    listProgress = i;
    Cookies.set('listItem', listProgress);
    var videoId = response.items[i].snippet.resourceId.videoId;
    panel.innerHTML = "";
    var video = [
        '<iframe',
        'id="' + i + '"',
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
    Cookies.set('lastViewedVideo', videoId);
    title.value = response.items[i].snippet.title;
}
/*////////////////////////////////////////
Set up Video controls
////////////////////////////////////////*/
//This playlist
var thisPlaylist = document.getElementById('allPlaylistVid');
thisPlaylist.addEventListener('click', function() {
    getPlaylistVideos(currentPlaylist);
});
//Previous video in playlist
var previousVid = document.getElementById('lastPlaylistVid');
previousVid.addEventListener('click', function() {
    if (listProgress > 0) {
        insertVid(responseBin, listProgress - 1);
        previousVid.classList.remove('flash');
        nextPlaylistVid.classList.remove('flash');
    } else {
        previousVid.classList.toggle('flash');
        console.log('Begining of playlist');
    }
});
//Next video in playlist
var nextPlaylistVid = document.getElementById('nextPlaylistVid');
nextPlaylistVid.addEventListener('click', function() {
    if (listProgress < binLength) {
        insertVid(responseBin, listProgress + 1);
        previousVid.classList.remove('flash');
        nextPlaylistVid.classList.remove('flash');
    } else {
        nextPlaylistVid.classList.toggle('flash');
        console.log('End of playlist');
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                        OTHER FEATURES                                            //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//CONTINUE WHERE LEFT OFF
/*////////////////////////////////////////
Activated when continue where you left off clicked, builds API url to fetch the vdeos
 ////////////////////////////////////////*/
function getLastPlaylistVideos(playlistId) {
    return new Promise(function(sendBack) {
        //build url, get response then return promise to block below for video build.
        console.log('getLastPlaylistVideos Promise Initiated');
        currentPlaylist = playlistId;
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        request(url).then(function(response) {
            console.log('Fetch LastPlaylistVids Initiated');
            responseBin = response; //update response bin & Length
            binLength = responseBin.items.length - 1;
            sendBack(response);
        });
    });
}
/*////////////////////////////////////////
 Configure Continue Button
 ////////////////////////////////////////*/
var lastVidPlayed = document.getElementById('lastVid');
lastVidPlayed.onclick = function() {
    //check if visitor has used the site before
    if (typeof Cookies('lastViewedVideo') !== 'undefined') {
        var lastPlaylistId = Cookies.get('lastPlaylist');
        listProgress = Cookies.getJSON('listItem');
        var lastVideo = Cookies.get('lastViewedVideo');
        //when continue button is clicked, go and get the playlist, then load the last video (uses cookies)
        getLastPlaylistVideos(lastPlaylistId).then(function(response) {
            console.log('Promise Returned');
            insertVid(responseBin, listProgress);
        });
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
//shows menu on load if above 1024px
window.onload = function() {
    var width = window.innerWidth;
    if (width > 1024) {
        rightPanel.classList.add('menu-open');
        leftPanel.classList.add('menu-open');
    }
};
//hides menu on resize if below 1024px
window.onresize = function() {
    var width = window.innerWidth;
    if (width <= 1024) {
        rightPanel.classList.remove('menu-open');
        leftPanel.classList.remove('menu-open');
    } else if (width > 1024) {
        rightPanel.classList.add('menu-open');
        leftPanel.classList.add('menu-open');
    }
};
//handle functionality
var handle = document.getElementById('menu-handle');
var rightPanel = document.getElementById('right-panel');
var leftPanel = document.getElementById('left-panel');
handle.addEventListener('click', function() {
    handle.classList.toggle('menu-open');
    rightPanel.classList.toggle('menu-open');
    leftPanel.classList.toggle('menu-open');
});
