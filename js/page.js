/*////////////////////////////////////////
Global Variables
 ////////////////////////////////////////*/
var panel = document.getElementById("video-panel");
var editor = document.getElementById('editor-panel');
var playlistLength; //required to calculate when the video controls should 'bump'
var listProgress; //represented by an index # and paired with currentPlaylist.
var currentChannel; // for thisPlaylist button
var currentPlaylist; //updated everytime a new play list is loaded (the videos). this variable allows playlist control without passing response around
var playlistContent; // holds raw html to loaded back into 'panel' when user clicks playlist button when watching vid
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    CONTINUE WHERE YOU LEFT OFF                                   //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*/////////////////////////////////////////
Activates the iFrame when user hits enter.
 ////////////////////////////////////////*/
//function loadUserIframe(url) {
//  panel.innerHTML = ""; //clear the main panel to insert video
/*var iframe = document.createElement("iframe");
iframe.src = url;
iframe.width = "100%";
iframe.height = "100%";*/

/*  var iframe = [ //build video iframe
        '<iframe',
        '  src="' + url + '"',
        '  width="100%"',
        '  height="100%"',
        '  frameborder="0"',
        '  allowfullscreen>',
        '</iframe>'
    ].join('\n');

    scrollTo(panel, panel.offsetTop, 0); //make sure we're at the top of the panel
    panel.insertAdjacentHTML('beforeend', iframe); //insert vid into main panel
    //title.value = videoTitle; // give the note the right title - important for notes.js functions
    //relatedVidLink = [playlistId, index];
    if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
        iframe.onreadystatechange = function() {
            if (iframe.readyState == "complete") {
                alert("Iframe is now loaded.");
            }
        };
    } else {
        iframe.onload = function() {
            alert("Iframe is now loaded.");
        };
    }
    if (!editorIsOpen) { //check if the editor panel is closed
        vidDefault.click(); //bring up editor/notes panel
    }

}
var userIframe = document.getElementById('user-iFrame-URL');
userIframe.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        var url = userIframe.value;
        loadUserIframe(url);
    }
});*/
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                           Load User iframe                                       //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
var pickUpLeftOffButton = document.getElementById('lastVid');
pickUpLeftOffButton.onclick = function() {
    //check if visitor has used the site before
    if ((currentPlaylist !== undefined) && (listProgress !== undefined)) {
        insertVid(currentPlaylist, listProgress);
    } else {
        alert('You can\'t continue what you havn\'t started. Choose a playlist and watch a video to get started.');
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    Load a favorite channel                                        //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
//URL asks for object with one result array containing branding,
//content details & snippet. For building single fave channel card without going through youtube search api,
//which can create duplicate entry bug
function loadFaveChannelCard(id) {
    panel.innerHTML = '';
    var thisChannel = "&id=" + id;
    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet%2CbrandingSettings%2Cstatistics" + thisChannel + apik;
    fetch(url).then(function(response) {
        buildChannelCard(response);
    });
}
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
        //hide editor panel (with the classes removed, the video panel is 100% height)
        closeEditor();
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
                '<div>' + playlistTitle + '</div>',
                '<div class="video-num">' + videoNum + ' Video\'s</div>',
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
    getPlaylistVids(playlistId).then(function(response) { //call api for data
        var videoCardStore = []; //empty array to store video cards as provided by loop below (required to prevent video pile up, cannot clear html from inside loop whilst appending)
        var videos = response.items; // shorted the path
        for (var i = 0; i < videos.length; i++) { //loop through playlist to get videos
            //get required properties
            var channelId = videos[i].snippet.channelId;
            var videoId = videos[i].snippet.resourceId.videoId;
            var thumbnail = videos[i].snippet.thumbnails.medium.url;
            var videoTitle = videos[i].snippet.title;
            videoCard = [ //build video cards
                '<div class="video-container" onclick="insertVid(\'' + playlistId + '\',' + '\'' + i + '\')">', //'\'' + videoTitle + '\',' +
                '<div id="' + videoId + '" class="thumbnail"><img src="' + thumbnail + '"></div>',
                '<div class="video-title">' + videoTitle + '</div>',
                '</div>'
            ].join('\n');
            var channelPlaylists = document.getElementById('channelPlaylists' + channelId); //get element that displays the playlists
            var playlistVideos = document.getElementById('playlistVideos' + channelId); //get element that displays the videos
            var showPlaylist = document.getElementById('showPlaylists' + channelId); //get the show playlist button
            //make sure the channel playlists display panel is hidden (because its been toggled so unsure if already has hide class)
            channelPlaylists.classList.remove('hide');
            channelPlaylists.classList.add('hide');
            playlistVideos.classList.remove('hide'); //show the playlist vid's element (hidden by default)
            showPlaylist.classList.remove('active'); //show playlist button as inactive
            //////////////////////////////////////
            videoCardStore.push('playlistVideos' + channelId); //push each string.channelId to the array - this is the same value for each loop
            videoCardStore.push(videoCard); //push this single video card to storage until all iterations are complete
        }
        var videoCardPanel = document.getElementById(videoCardStore[0]); //could be any odd numbered index in array as they are all the same data
        videoCardPanel.innerHTML = ""; //clear playlist vids card panel
        for (var j = 1; j < videoCardStore.length; j += 2) {
            videoCardPanel.insertAdjacentHTML('beforeend', videoCardStore[j]); //loop through the video card storage array and,
            // insert each (even number index) one into the playlist vids panel
        }
        playlistContent = panel.innerHTML; //save the raw html from the playlist view to be re-inserted into main panel on click of back to playlist button(too much data for cookie storage)
    });
}
//////////////////////////////////////////////////////////////////
//LOAD VIDEO INTO MAIN PANEL
////////////////////////////////////////////////////////////////
function insertVid(playlistId, index) {
    getPlaylistVids(playlistId).then(function(response) { //call api for data
        //update global var with current position in playlist (for use in controls & pickUpLeftOffButton)
        listProgress = index;
        Cookies.set('progress', listProgress);
        //update global var with current channel (for use in controls & pickUpLeftOffButton)
        currentChannel = response.items[index].snippet.channelId;
        Cookies.set('lastChannel', currentChannel);
        //get required properties
        var videoId = response.items[index].snippet.resourceId.videoId;
        var videoTitle = response.items[index].snippet.title;
        currentVideo = videoId; //update global var with current position in playlist (for use in controls & pickUpLeftOffButton). not cookied.
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
        panel.insertAdjacentHTML('beforeend', video); //insert vid into main panel
        title.value = videoTitle; // give the note the right title - important for notes.js functions
        relatedVidLink = [playlistId, index];
        if (!editorIsOpen) { //check if the editor panel is closed
            vidDefault.click(); //bring up editor/notes panel
        }
    });
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
    var addChannel = document.getElementById('addChannel' + channelId); //get the add button from the channel card
    var removeChannel = document.getElementById('removeChannel' + channelId); //get the remove button from the channel card
    channelsList.push(channelId); //push this channel id to the favorite channels array
    removeChannel.classList.remove('hide'); //show the remove channel button
    addChannel.classList.add('hide'); //hide the add channel button
    Cookies.set('channelFaves', channelsList); //set user faves cookie
    fetchFaveChannels(); //repopulate favorites list on webpage
}
/*////////////////////////////////////////
Remove Channel from faves
 ////////////////////////////////////////*/
function removeChannel(channelId) {
    var addChannel = document.getElementById('addChannel' + channelId); //get the addChannel button from the channel card
    var removeChannel = document.getElementById('removeChannel' + channelId); //get the remove button from the channel card
    for (var i = 0; i < channelsList.length; i++) { //loop through channels list
        if (channelsList[i] === channelId) { //to find this channel id
            channelsList.splice(i, 1); //remove the channel form array
            removeChannel.classList.add('hide'); //hide the remove button
            addChannel.classList.remove('hide'); //display the add button
            Cookies.set('channelFaves', channelsList); //set user faves cookie
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
    if (playlistContent) {
        //hide editor panel (withthese classes removed, the video panal is 100% height)
        panel.classList.remove('small', 'default', 'large');
        editor.classList.remove('small', 'default', 'large');
        //remove active from resize buttons - as the editor panel is now hidden
        vidDefault.classList.remove('active');
        vidLarge.classList.remove('active');
        vidSmall.classList.remove('active');
        panel.innerHTML = playlistContent; // slap in stored html page

    } else {
        searchYoutube(currentChannel);
        bump(thisPlaylist).then(function(animationDone) {
            thisPlaylist.classList.remove('bump-stop');
        });
    }
});
//Next video in playlist
var nextPlaylistVid = document.getElementById('nextPlaylistVid');
nextPlaylistVid.addEventListener('click', function() {
    if (listProgress < CurrentPlaylistLength) {
        listProgress++;
        insertVid(currentPlaylist, listProgress);
    } else {
        bump(nextPlaylistVid).then(function(animationDone) {
            nextPlaylistVid.classList.remove('bump-stop');
        });
    }
});
//Previous video in playlist
var previousVid = document.getElementById('lastPlaylistVid');
previousVid.addEventListener('click', function() {
    if (listProgress > 0) {
        listProgress--;
        insertVid(currentPlaylist, listProgress);
    } else {
        bump(previousVid).then(function(animationDone) {
            previousVid.classList.remove('bump-stop');
        });
    }
});


/*////////////////////////////////////////
Menu slide control
 ////////////////////////////////////////*/
//shows menu on load if above 1024px
window.onload = function() {
    var width = window.innerWidth;
    if (width > 768) {
        rightPanel.classList.add('menu-open');
        leftPanel.classList.add('menu-open');
    }
};
//hides menu on resize if below 1024px
window.onresize = function() {
    var width = window.innerWidth;
    if (width <= 768) {
        rightPanel.classList.remove('menu-open');
        leftPanel.classList.remove('menu-open');
    } else if (width > 768) {
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
/*////////////////////////////////////////
panel sizing
 ////////////////////////////////////////*/
var editorIsOpen = false; //reset flag - for showing note editor panel
var vidLarge = document.getElementById('videoLarge');
var vidDefault = document.getElementById('videoDefault');
var vidSmall = document.getElementById('videoSmall');
vidLarge.onclick = function() {
    editorIsOpen = true;
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
    editorIsOpen = true;
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
    editorIsOpen = true;
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

function closeEditor() {
    editorIsOpen = false;
    panel.classList.remove('small');
    panel.classList.remove('large');
    panel.classList.remove('default');
    editor.classList.remove('large');
    editor.classList.remove('default');
    editor.classList.remove('small');
    vidDefault.classList.remove('active');
    vidLarge.classList.remove('active');
    vidSmall.classList.remove('active');
}


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
