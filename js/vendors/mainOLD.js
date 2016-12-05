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
var channelsList = [
    "UC8butISFwT-Wl7EV0hUK0BQ",
    "UCW5YeuERMmlnqo4oq8vwUpg",
    "UCJbPGzawDH1njbqV-D5HqKw",
    "UCwHrYi0GL6dmYaRB0StEbEA",
    "UCSJbGtTlrDami-tDGPUV9-w",
    "UCJUmE61LxhbhudzUugHL2wQ"
];

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
    var list = document.getElementById("channels").getElementsByTagName("ul")[0];
    list.innerHTML = "";
    for (var i = 0; i < channelsList.length; i++) {
        var channel = "&id=" + channelsList[i];
        var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings" + channel + apik;
        fetchChannelsList(url);
    }
}
/*////////////////////////////////////////
requests an API call from step 0 waits for response. called as many times as there are channels
 ////////////////////////////////////////*/
function fetchChannelsList(url) {
    request(url).then(function(response) {
        parseChannelsList(response);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in channels list
 ////////////////////////////////////////*/
function parseChannelsList(response) {
    var list = document.getElementById("channels").getElementsByTagName("ul")[0];
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
        searchYoutube(channelId); //search.js
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
    //hide editor panel
    currentChannel = channelId;
    panel.classList.remove('small', 'default', 'large');
    editor.classList.remove('small', 'default', 'large');
    //remove active from buttons
    vidDefault.classList.remove('active');

    vidLarge.classList.remove('active');
    vidSmall.classList.remove('active');
    //fetch
    var channel = "&channelId=" + channelId;
    var url = "https://www.googleapis.com/youtube/v3/playlists?part=id%2C+contentDetails%2C+player%2C+snippet&maxResults=50" + channel + apik;
    request(url).then(function(response) {
        parsePlaylists(response);
    });
}

/*////////////////////////////////////////
 Creates & configures entries in main panel. Playlists.
 ////////////////////////////////////////*/
function parsePlaylists(response) {
    //panel.innerHTML = "";
    var playListContainer = [];
    var playLists = response.items;
    var channelPlaylists = document.getElementById("channelPlaylists" + playLists[i].snippet.channelId);
    channelPlaylists.innerHTML = "";
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
        //prevent playlist pileup
        console.log(channelPlaylists);
        channelPlaylists.innerHTML = "";
        console.log(channelPlaylists);

        channelPlaylists.insertAdjacentHTML('beforeend', playListContainer);
        var channelId = playLists[i].snippet.channelId;
        createPlaylistVideos(channelId, playlistId);
    }
}
/*////////////////////////////////////////
 Set up playlist thumbnail to bring up video's
 ////////////////////////////////////////*/
function createPlaylistVideos(channelId, playlistId) {
    var playlistEntry = document.getElementById(playlistId);
    currentPlaylist = playlistId;
    playlistEntry.onclick = function() {
        var channelPlaylists = document.getElementById('channelPlaylists' + channelId);
        var playlistVideos = document.getElementById('playlistVideos' + channelId);
        var showPlaylist = document.getElementById('showPlaylist' + channelId);
        //make sure channelPlaylists panel is shown
        channelPlaylists.classList.remove('hide');
        channelPlaylists.classList.add('hide');
        //make sure playlist vid's are hidden
        playlistVideos.classList.remove('hide');
        //show playlist buttons as active
        showPlaylist.classList.remove('active');
        thisPlaylist.classList.remove('active');
        //get vids
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
var currentChannel; // for thisPlaylist button line 272
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
        responseBin = response;
        binLength = responseBin.items.length - 1;
        parsePlaylistVids(responseBin);
    });
}
/*////////////////////////////////////////
 Creates & configures entries in main panel. Playlists individual videos.
 ////////////////////////////////////////*/
function parsePlaylistVids(response) {
    var videoContainer = [];
    var videos = response.items;
    for (var i = 0; i < videos.length; i++) {
        var channelId = videos[i].snippet.channelId;
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
        var plv = document.getElementById('playlistVideos' + channelId);
        //console.log(channelId);
        //console.log(plv);
        plv.insertAdjacentHTML('beforeend', videoContainer);
        createVideo(response, i); // i will be used to record a the current video's index, to allow configure the video controls
    }
}
/*////////////////////////////////////////
Set up playlist thumbnail to bring up video
////////////////////////////////////////*/
function createVideo(response, i) {
    currentPlaylist = response.items[i].snippet.playlistId;
    var videoId = response.items[i].snippet.resourceId.videoId;
    var playlistEntry = document.getElementById(videoId);
    playlistEntry.onclick = function() {
        Cookies.set('lastPlaylist', currentPlaylist);
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
    vidDefault.click();
}
/*////////////////////////////////////////
Set up Video controls
////////////////////////////////////////*/
//This playlist
var thisPlaylist = document.getElementById('allPlaylistVid');
thisPlaylist.addEventListener('click', function() {
    if (currentPlaylist !== undefined) {
        console.log(currentPlaylist);
        searchYoutube(currentChannel);
        getPlaylistVideos(currentPlaylist);


    } else {
        bump(thisPlaylist).then(function(animationDone) {
            thisPlaylist.classList.remove('bump-stop');
        });
    }
});
//Previous video in playlist
var previousVid = document.getElementById('lastPlaylistVid');
previousVid.addEventListener('click', function() {
    if (listProgress > 0) {
        insertVid(responseBin, listProgress - 1);
    } else {
        bump(previousVid).then(function(animationDone) {
            previousVid.classList.remove('bump-stop');
        });
    }
});

//Next video in playlist
var nextPlaylistVid = document.getElementById('nextPlaylistVid');
nextPlaylistVid.addEventListener('click', function() {
    if (listProgress < binLength) {
        insertVid(responseBin, listProgress + 1);
    } else {
        bump(nextPlaylistVid).then(function(animationDone) {
            nextPlaylistVid.classList.remove('bump-stop');
        });
    }
});

function bump(el) {
    return new Promise(function(animate) {
        el.classList.add('bump-stop');
        setTimeout(function() {
            animate(); //back to you
        }, 1000);
    });
}
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
        var playlistVids = "&playlistId=" + playlistId;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet%2Cstatus&maxResults=50" + playlistVids + apik;
        fetch(url).then(function(response) {
            responseBin = response; //update response bin & Length
            binLength = responseBin.items.length - 1;
            sendBack(response); //back to you
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
    panel.classList.remove('default');
    panel.classList.add('large');
    editor.classList.remove('large');
    editor.classList.remove('default');
    editor.classList.add('small');
    vidDefault.classList.remove('active');
    vidSmall.classList.remove('active');
    vidLarge.classList.add('active');
};
vidDefault.onclick = function() {
    panel.classList.remove('small');
    panel.classList.remove('large');
    panel.classList.add('default');
    editor.classList.remove('large');
    editor.classList.remove('small');
    editor.classList.add('default');
    vidSmall.classList.remove('active');
    vidLarge.classList.remove('active');
    vidDefault.classList.add('active');
};
vidSmall.onclick = function() {
    panel.classList.add('small');
    panel.classList.remove('large');
    panel.classList.remove('default');
    editor.classList.add('large');
    editor.classList.remove('default');
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
