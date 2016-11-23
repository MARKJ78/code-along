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
        findRelatedNotes(thisNote);
    } else {
        alert("Nothing to save");
    }
};

function findRelatedNotes(thisNote) {
    console.log('findRelatedNotes has been called');
    if (myNotes.length > 0) {
        //console.log('case 1');
        var flag = false;
        for (var i = 0; i < myNotes.length; i++) {
            //console.log('loop started');
            if (myNotes[i].title == thisNote.title) {
                flag = true;
                console.log('found match');
                console.log('appending to note');
                var currentNoteVal = myNotes[i].note;
                var newNoteVal = currentNoteVal + '<br/><br/>' + thisNote.note;
                console.log(newNoteVal);
                myNotes[i].note = newNoteVal;
                Cookies.set('storedNotes', myNotes);
                //myNotes = Cookies.getJSON('storedNotes');
                console.log('Saved');
                note.value = "";
            }
        }
        if (flag === false) {
            pushNote(thisNote);
        }
    } else if (myNotes.length === 0) {
        //console.log('case 2');
        pushNote(thisNote);
    }
}


function pushNote(thisNote) {
    //console.log('push has been called');
    myNotes.push(thisNote);
    Cookies.set('storedNotes', myNotes);
    myNotes = Cookies.getJSON('storedNotes');
    note.value = "";
    console.log('New Note Saved');
}


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
        var mySavedNote = document.createElement('li');
        //get note details to populate the li
        var noteTitle = myNotes[i].title;
        var note = myNotes[i].note;
        var noteDate = myNotes[i].date;
        var noteId = myNotes[i].id;
        myNoteslistItem = [
            '<p class="note-title">' + noteTitle + '</p>',
            '<p class="date">' + noteDate + '</p>',
            '<p class="note">' + note + '</p>'
        ].join('\n');
        myNotesList.appendChild(mySavedNote);
        //add class to li's
        var newClass = document.createAttribute('class');
        newClass.value = "saved-notes-list-item";
        mySavedNote.setAttributeNode(newClass);
        //add id to li's
        var newId = document.createAttribute('id');
        newId.value = noteId;
        mySavedNote.setAttributeNode(newId);
        //push to list
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
closeSavedNotes.onclick = function(e) {
    e.preventDefault();
    mySavedNotesPanel.classList.remove('notes-open');
};

/*////////////////////////////////////////
Open a note from the saved notes panel
 ////////////////////////////////////////*/
/*var result = jsObjects.filter(function(obj) {
    return obj.b == 6;
});*/
