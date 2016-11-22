//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                     Global Variables                                             //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
var myNotes = [];
var lastNote = 0;
var date = new Date();
month = date.getMonth() + 1;

dateString = date.getDate() + "/" + month + "/" + date.getFullYear();
var title = document.getElementById('noteTitle');
var note = document.getElementById('note');
var saveNoteButton = document.getElementById('saveNote');
var mySavedNotesPanel = document.getElementById('mySavedNotes');
var myNotesButton = document.getElementById('myNotes');
/*////////////////////////////////////////
Sets the last note, for use in "pick up where you left off"  lastVidPlayed.onclick = function() in main.js
 ////////////////////////////////////////*/
if (typeof Cookies('storedNotes') !== 'undefined') {
    myNotes = Cookies.getJSON('storedNotes');
    lastNote = myNotes.length - 1;
    console.log(myNotes);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//                                                                                                  //
//                                    Button Functions                                              //
//                                                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////
Save current note into array as an object
 ////////////////////////////////////////*/
saveNoteButton.onclick = function(e) {
    e.preventDefault();
    if (note.value !== "") {
        var thisNote = {};
        thisNote.id = new Date().getTime();
        thisNote.date = dateString;
        thisNote.note = note.value;
        thisNote.title = title.value;
        console.log(thisNote);
        myNotes.push(thisNote);
        Cookies.set('storedNotes', myNotes);
        note.value = "";
    } else {
        alert("Nothing to save");
    }
};
/*////////////////////////////////////////
Load all notes and trigger My Notes panel into view
 ////////////////////////////////////////*/
myNotesButton.onclick = function(e) {
    e.preventDefault();
    //create UL and add class
    var myNotesList = mySavedNotesPanel.getElementsByTagName("ul")[0];
    var newUlClass = document.createAttribute("class");
    newUlClass.value = "saved-notes-list";
    myNotesList.setAttributeNode(newUlClass);
    //clear the list to allow regeneration
    myNotesList.innerHTML = "";
    //loop through notes array and create list items to append
    for (var i = 0; i < myNotes.length; i++) {
        //set up li
        var mySavedNote = document.createElement("li");
        //get note details to populate the li
        var noteTitle = myNotes[i].title;
        var note = myNotes[i].note;
        var noteDate = myNotes[i].date;
        myNoteslistItem = [
            '<p>' + noteTitle + '</p>',
            '<p class="time">' + noteDate + '</p>',
            '<span class="delete-fave" id="delete-' + noteTitle + '">',
            //'<i class="fa fa-trash-o" aria-hidden="true"></i>',
            '</span>'
        ].join('\n');
        myNotesList.appendChild(mySavedNote);
        //add class to li's
        var newClass = document.createAttribute("class");
        newClass.value = "saved-notes-list-item";
        mySavedNote.setAttributeNode(newClass);
        mySavedNote.innerHTML = myNoteslistItem;
        myNotesList.appendChild(mySavedNote);
    }
    // add class to trigger panel show
    mySavedNotesPanel.classList.add('notes-open');
};
/*////////////////////////////////////////
close saved notes panel
 ////////////////////////////////////////*/
var closeSavedNotes = document.getElementById('close-saved-notes');
closeSavedNotes.onclick = function(banana) {
    banana.preventDefault();
    mySavedNotesPanel.classList.remove('notes-open');
};
