//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                        SEARCH  &  RESULTS                                        //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////
Activates the search when user hits enter.
 ////////////////////////////////////////*/
var searchBox = document.getElementById('searchYoutube');
searchBox.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        var term = searchBox.value;
        //if 'youtube' is selected
        searchYoutube(term);
        //if 'notes' is selected
        //searchNotes(term);
    }
});
/*////////////////////////////////////////
fetches an API call from step 0 in main.js and waits for response.
 ////////////////////////////////////////*/
//returns and object of results. Each result is an array.
//Since the search api call only accepts snippet as the part (argument),
//getChannelDetails() is required to get the channel branding and content
function searchYoutube(term) {
    var q = "&q=" + term;
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&limit=50&type=channel" + q + apik;
    fetch(url).then(function(results) {
        /*////////////////////////////////////////
        Loops through returned search results and sends each i (channel) to an API fetch
         ////////////////////////////////////////*/
        //URL asks for object with one result array containing branding, content details & snippet.
        var response = results.items;
        panel.innerHTML = '';
        for (var i = 0; i < response.length; i++) { // build url for each channel
            var thisChannel = "&id=" + response[i].id.channelId;
            var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet%2CbrandingSettings%2CcontentDetails" + thisChannel + apik;
            fetchSearchChannels(url);
        }
    });
}
/*////////////////////////////////////////
fetchs an API call from step 0 in main.js and waits for response.
 ////////////////////////////////////////*/
//recieves and object from API call with one result array containing branding, content details & snippet.
function fetchSearchChannels(url) {
    fetch(url).then(function(response) {
        buildChannelCard(response);
    });
}
//Recieves an object containing one result array containing branding, content details & snippet of a channel.
function buildChannelCard(response) {
    //call the result a channel so we know what we are dealing with
    var channel = response.items[0];
    var channelId = channel.id; //store the channel id
    var channelCard = []; //create an empty array to store the channel card
    //store some of the data for use later
    var channelBanner = channel.brandingSettings.image.bannerImageUrl;
    var channelTitle = channel.brandingSettings.channel.title;
    var descriptionLong = channel.brandingSettings.channel.description;
    var descriptionShort = "";
    if (descriptionLong) {
        descriptionShort = truncateString(descriptionLong, 180); //shorten the description
    }
    var flag = false; //reset channel already owned flag
    //check if found channel is already in favorites - this is used to change the add/remove button
    if (channelsList.indexOf(channelId) >= 0) {
        flag = true;
    }
    //Build channel cards
    channelCard = [
        '<div class="channel-container">',
        '<div id="' + channelTitle + '" class="channel-banner"><img src="' + channelBanner + '"></div>',
        '<div class="channel-details">',
        '<div class="channel-title">',
        '<h2><a href="https://www.youtube.com/channel/' + channelId + '" target="_blank">' + channelTitle + '</a></h2>',
        '</div>',
        '<div class="channel-buttons">',
        '<div id="showPlaylists' + channelId + '" class="btn2" onclick="showPlaylists(\'' + channelId + '\')"><i class="fa fa-list" aria-hidden="true"></i>&nbsp;Playlists</div>',
        '<div id="removeChannel' + channelId + '" class="btn2 hide danger" onclick="removeChannel(\'' + channelId + '\')"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;Remove Channel</div>',
        '<div id="addChannel' + channelId + '" class="btn2 good" onclick="addChannel(\'' + channelId + '\')"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Channel</div>',
        '</div>',
        '</div>',
        '<div class="channel-description">',
        '<p>' + descriptionShort + '</p>',
        '</div>',
        '<div id="channelPlaylists' + channelId + '" class="channel-playlists-container hide"></div>',
        '<div id="playlistVideos' + channelId + '" class="channel-playlists-container hide"></div>',
        '</div>'
    ].join('\n');
    //inserts each channel into the main panel
    panel.insertAdjacentHTML('beforeend', channelCard);
    //changes the add or remove button depending on weather its already a fave, based on the flag value.
    var removeChannel = document.getElementById('removeChannel' + channelId); //get the remove button from the channel card
    var addChannel = document.getElementById('addChannel' + channelId); //get the remove button from the channel card
    if (flag) {
        removeChannel.classList.remove('hide');
        addChannel.classList.add('hide');
    }
}
