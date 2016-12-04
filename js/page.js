/*////////////////////////////////////////
Global Variables
 ////////////////////////////////////////*/
var panel = document.getElementById("video-panel");
var editor = document.getElementById('editor-panel');

var responseBin; //updated everytime a new play list is loaded. this variable allows playlist control without passing response around
var binLength; //required for if statement on next video buttons
var listProgress; //represented by an index # and paired with response bin.
var currentChannel; // for thisPlaylist button line 272
var currentPlaylist; // for thisPlaylist button line 272
var currentVideo; //video id
var currentVideoTitle; //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        Set up favorite channels on page load                                     //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function loadChannelsList(response) {
    var list = document.getElementById("channels").getElementsByTagName("ul")[0]; //get the list element from the right hand panel
    //get required properties
    var channelId = response.items[0].id;
    var title = response.items[0].snippet.title;
    var logo = response.items[0].snippet.thumbnails.default.url;
    listItem = [ //build list item contents
        '<div class="list-item button" onclick="  searchYoutube(\'' + channelId + '\')">', //load channel into main view
        '<p class="channel-title">' + title + '</p>',
        '<span class="channel-logo" id="logo-' + channelId + '"><img src="' + logo + '"></span>',
        '</div>'
    ].join('\n');
    var newLi = document.createElement("li"); //create new li
    list.appendChild(newLi); //append new li to fave channels list
    var newId = document.createAttribute("id"); //create a new ID attribute for the li
    newId.value = channelId; //assign new id value
    newLi.setAttributeNode(newId); // and asign its value as the channel id
    var newClass = document.createAttribute("class"); //create a new class attribute for the li
    newClass.value = "li-channel"; //assign new class a value
    newLi.setAttributeNode(newClass); //asign class to li
    newLi.innerHTML = listItem; //populate this li (one for each channel in faves)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    CONTINUE WHERE YOU LEFT OFF                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
var lastVidPlayed = document.getElementById('lastVid');
lastVidPlayed.onclick = function() {
    console.log('click');
    //check if visitor has used the site before
    if (typeof Cookies('lastViewedVideo') !== 'undefined') {
        currentPlaylist = Cookies.get('lastPlaylist');
        currentVideo = Cookies.get('lastViewedVideo');
        currentVideoTitle = Cookies.get('lastVideoTitle');
        responseBin = Cookies.get('responseBin');
        listProgress = Cookies.get('progress');
        binLength = Cookies.get('binLength');
        //when continue button is clicked, go and get the playlist, then load the last video (uses cookies)
        getLastPlaylistVideos(currentPlaylist).then(function(response) {
            insertVid(currentVideo, currentVideoTitle, listProgress);
        });
    } else {
        alert('You can\'t continue what you havn\'t started. Choose a playlist and watch a video to get started.');
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                  CHANNEL CARD BUTTONS                                            //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//shows playlists under channel card - button activated
/////////////////////////////////////////////////////
function showPlaylists(channelId) {
    getPlaylists(channelId).then(function(response) { //call api for data
        var channelPlaylists = document.getElementById('channelPlaylists' + channelId); //get element that displays the playlists
        var playlistVideos = document.getElementById('playlistVideos' + channelId); //get element that dispalys the videos
        var showPlaylistsButton = document.getElementById('showPlaylists' + channelId); //get the show playlist button
        showPlaylistsButton.classList.toggle('active'); //add active class to playlist button
        channelPlaylists.classList.toggle('hide'); //show the playlist element (hidden by default)
        //make sure the playlist video's display panel is hidden (because its been toggled so unsure if already has hide class)
        playlistVideos.classList.remove('hide');
        playlistVideos.classList.add('hide');
        //set current playlist var
        currentChannel = channelId; //update the global current channel with current channel in playlist (for use in continue where you left off button)
        //hide editor panel (withthese classes removed, the video panal is 100% height)
        panel.classList.remove('small', 'default', 'large');
        editor.classList.remove('small', 'default', 'large');
        //remove active from resize buttons - as the editor panel is now hidden
        vidDefault.classList.remove('active');
        vidLarge.classList.remove('active');
        vidSmall.classList.remove('active');
        var playLists = response.items; //shorten the path
        channelPlaylists.innerHTML = ""; //prevent playlist pileup
        for (var i = 0; i < playLists.length; i++) { //loop through array of playlists
            //get required properties
            var playlistId = playLists[i].id;
            var thumbnail = playLists[i].snippet.thumbnails.medium.url;
            var playlistTitle = playLists[i].snippet.localized.title;
            var videoNum = playLists[i].contentDetails.itemCount;
            //create playlist card
            playListCard = [
                '<div class="play-list-container">',
                '<div id="' + playlistId + '" class="thumbnail"><img src="' + thumbnail + '" onclick="showVideos(\'' + playlistId + '\')"></div>',
                '<div class="playlist-title">',
                '<p>' + playlistTitle + '</p>',
                '<p class="video-num">' + videoNum + ' Video\'s</p>',
                '</div>',
                '</div>'
            ].join('\n');
            scrollTo(panel, panel.offsetTop, 0); //scroll to top of main panel
            channelPlaylists.insertAdjacentHTML('beforeend', playListCard); //insert each card one after another into the channel playlist container
        }
    });
}
//////////////////////////////////////////////////////////////////
//Available if playlists are loaded - onclick of playlist image
////////////////////////////////////////////////////////////////
function showVideos(playlistId) {
    Cookies.set('lastPlaylist', playlistId);
    getPlaylistVids(playlistId).then(function(response) { //call apy for data

        var videoCardStore = []; //empty array to store video cards as provided by loop below (required to prevent video pile up, cannot use clear html from inside loop)
        var videos = response.items; // shorted the path
        for (var i = 0; i < videos.length; i++) { //loop through playlist to get videos
            //get required properties
            var channelId = videos[i].snippet.channelId;
            var videoId = videos[i].snippet.resourceId.videoId;
            var thumbnail = videos[i].snippet.thumbnails.medium.url;
            var videoTitle = videos[i].snippet.title;
            videoCard = [ //build video cards
                '<div class="video-container" onclick="return insertVid(\'' + videoId + '\',' + '\'' + videoTitle + '\',' + '\'' + i + '\')">',
                '<div id="' + videoId + '" class="thumbnail"><img src="' + thumbnail + '"></div>',
                '<div class="video-title">' + videoTitle + '</div>',
                '</div>'
            ].join('\n');
            var channelPlaylists = document.getElementById('channelPlaylists' + channelId); //get element that displays the playlists
            var playlistVideos = document.getElementById('playlistVideos' + channelId); //get element that displays the videos
            videoCardStore.push('playlistVideos' + channelId); //push each string.channelId to the array - this is the same value for each loop
            var showPlaylist = document.getElementById('showPlaylists' + channelId); //get the show playlist button
            //make sure the channel playlists display panel is hidden (because its been toggled so unsure if already has hide class)
            channelPlaylists.classList.remove('hide');
            channelPlaylists.classList.add('hide');
            playlistVideos.classList.remove('hide'); //show the playlist vid's element (hidden by default)
            showPlaylist.classList.remove('active'); //show playlist buttons as inactive
            //////////////////////////////////////
            videoCardStore.push(videoCard); //push video card to storage for next loop
        }
        var videoCardPanel = document.getElementById(videoCardStore[0]); //could be any odd numbered index in array as they are all the same
        videoCardPanel.innerHTML = ""; //clear playlist vids card panel
        for (var j = 1; j < videoCardStore.length; j += 2) {
            videoCardPanel.insertAdjacentHTML('beforeend', videoCardStore[j]); //loop through the video card storage array and,
            // insert each (even number index) one into the playlist vids panel
        }
    });
}
//////////////////////////////////////////////////////////////////
//LOAD VIDEO INTO MAIN PANEL
////////////////////////////////////////////////////////////////
function insertVid(videoId, videoTitle, index) {
    //console.log(typeof videoTitle);
    //console.log(videoTitle);
    console.log(index);
    listProgress = index;
    console.log(listProgress);
    Cookies.set('progress', listProgress);
    console.log(Cookies('progress'));
    currentVideo = videoId; //update global var with current position in playlist (for use in continue where you left off button)
    currentVideoTitle = videoTitle; //update global var with current position in playlist (for use in continue where you left off button)
    panel.innerHTML = ""; //clear the main panel to insert video
    var video = [ //build video iframe
        '<iframe',
        '  src="//www.youtube.com/embed/' + currentVideo + '"',
        '  width="100%"',
        '  height="100%"',
        '  frameborder="0"',
        '  scrolling="no"',
        '  allowfullscreen>',
        '</iframe>'
    ].join('\n');
    scrollTo(panel, panel.offsetTop, 0); //make sure we're at the top of the panel
    panel.insertAdjacentHTML('beforeend', video); //insert
    Cookies.set('lastViewedVideo', videoId); //set cookies with current video ID
    currentVideoTitle = videoTitle; //set current video title global var
    Cookies.set('lastVideoTitle', currentVideoTitle); //set cookies with current Title
    title.value = videoTitle; // to give the note the right title - important for notes.js functions
    vidDefault.click(); //bring up editor/notes panel
}




//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                       Page Buttons                                               //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Add Channel to faves
 ////////////////////////////////////////*/
function addChannel(channelId) {
    var addChannel = document.getElementById('addChannel' + channelId); //get the remove button from the channel card
    var removeChannel = document.getElementById('removeChannel' + channelId); //get the remove button from the channel card
    channelsList.push(channelId); //push this channel id to the favorite channels array
    removeChannel.classList.remove('hide'); //show the remove channel button
    addChannel.classList.add('hide'); //hide this add channel button
    Cookies.set('channelFaves', channelsList); //set use faves cookie
    fetchFaveChannels(); //repopulate favorites list on webpage
}
/*////////////////////////////////////////
Remove Channel from faves
 ////////////////////////////////////////*/
function removeChannel(channelId) {
    var addChannel = document.getElementById('addChannel' + channelId); //get the remove button from the channel card
    var removeChannel = document.getElementById('removeChannel' + channelId); //get the remove button from the channel card
    for (var i = 0; i < channelsList.length; i++) { //loop through channels list
        if (channelsList[i] === channelId) { //to find this channel id
            channelsList.splice(i, 1); //remove the channel form array
            removeChannel.classList.add('hide'); //hide the remove button
            addChannel.classList.remove('hide'); //display the add button
            Cookies.set('channelFaves', channelsList); //set use faves cookie
            fetchFaveChannels(); //repopulate favorites list on webpage
        }
    }
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
    console.log(listProgress);
    if (listProgress > 0) {
        insertVid(currentVideo, currentVideoTitle, listProgress - 1);
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
        insertVid(currentVideo, currentVideoTitle, listProgress + 1);
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




//Just to truncate anything thats too long if needed
function truncateString(str, num) {
    var truncated = "";
    if (str.length > num && num > 3) {
        truncated = str.slice(0, num - 3) + "...";
        return truncated;
    } else if (str.length > num && num <= 3) {
        truncated = str.slice(0, num) + "...";
        return truncated;
    } else {
        return str;
    }
}
