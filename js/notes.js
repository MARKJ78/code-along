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
    //console.log(myNotes);
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
    var mySavedNote = document.createElement("li");
    var myNotesList = mySavedNotesPanel.getElementsByTagName("ul")[0];
    myNotesList.innerHTML = "";
    for (var i = 0; i < myNotes.length; i++) {
        var noteTitle = myNotes[i].title;
        var note = myNotes[i].note;
        var noteDate = myNotes[i].date;
        myNoteslistItem = [
            '<p class="saved-notes-list-item">' + noteTitle + '</p>',
            '<p class="time">' + noteDate + '</p>',
            '<span class="delete-fave" id="delete-' + noteTitle + '">',
            '<i class="fa fa-trash-o" aria-hidden="true"></i>',
            '</span>'
        ].join('\n');
        myNotesList.appendChild(mySavedNote);
        /*var newClass = document.createAttribute("class");
        newClass.value = "my-notes-list-item";
        mySavedNote.setAttributeNode(newClass);*/
        mySavedNote.innerHTML = myNoteslistItem;
        myNotesList.appendChild(mySavedNote);
    }
    mySavedNotesPanel.classList.add('notes-open');
};
/*////////////////////////////////////////
close saved notes panel
 ////////////////////////////////////////*/
var closeSavedNotes = document.getElementById('close-saved-notes');
closeSavedNotes.onclick = function(e) {
    e.preventDefault();
    mySavedNotesPanel.classList.remove('notes-open');
};
