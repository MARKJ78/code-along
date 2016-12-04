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
} else { //load users faves from cookie if available.
    channelsList = Cookies.getJSON('channelFaves');
    console.log("Favorites loaded from cookies");
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
        fetchChannelsList(url);
    }
}
//promise me this




function fetchChannelsList(url) {
    fetch(url).then(function(response) {
        loadChannelsList(response);
    });
}
