/*////////////////////////////////////////
Kick-off
 ////////////////////////////////////////*/
if (typeof Cookies('channelFaves') === 'undefined') { //if there is no cookie, load faves from default array
    var channelsList = [
        "UC8butISFwT-Wl7EV0hUK0BQ",
        "UCW5YeuERMmlnqo4oq8vwUpg",
        "UCJbPGzawDH1njbqV-D5HqKw",
        "UCwHrYi0GL6dmYaRB0StEbEA",
        "UCSJbGtTlrDami-tDGPUV9-w",
        "UCJUmE61LxhbhudzUugHL2wQ"
    ];
    Cookies.set('channelFaves', channelsList);
    console.log("Favorites loaded from defaults");
} else { //load users faves and progress from cookies if available.
    channelsList = Cookies.getJSON('channelFaves');
    listProgress = Cookies.getJSON('progress');
    currentPlaylist = Cookies.getJSON('playlist');
    playlistLength = Cookies.getJSON('listLength');
    currentChannel = Cookies.getJSON('lastChannel');
}
fetchFaveChannels();
/*////////////////////////////////////////
 Loops through channelsList and builds url for each channel to send on to fetchChannels
 ////////////////////////////////////////*/
function fetchFaveChannels() {
    var list = document.getElementById("channels").getElementsByTagName("ul")[0];
    list.innerHTML = "";
    for (var i = 0; i < channelsList.length; i++) {
        var channel = "&id=" + channelsList[i];
        var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings" + channel + apik;
        loadChannelsList(url);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                        Set up favorite channels on page load                                     //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
function loadChannelsList(url) {
    //promise me this
    fetch(url).then(function(response) {
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
    });
}
