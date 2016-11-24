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
var relatedNotesButton = document.getElementById('relatedNotes');
var confirm = document.getElementsByName('note')[0];
var myNotesList = mySavedNotesPanel.getElementsByTagName("ul")[0];
var noteListItems;
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
On save, Assemble the note into an object and send on to be saved
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
/*////////////////////////////////////////
On save, Assemble the note into an object and send on to be saved
 ////////////////////////////////////////*/
function findRelatedNotes(thisNote) {
    console.log('findRelatedNotes has been called');
    if (myNotes.length > 0) {
        //console.log('case 1');
        var flag = false; //initialise flag / flag state reset
        // loop through exsisting notes. If note title exsists, then append note.
        for (var i = 0; i < myNotes.length; i++) {
            //console.log('loop started');
            if (myNotes[i].title == thisNote.title) {
                flag = true; //prevent note from being pushed as a new entry
                console.log('found match');
                console.log('appending to note');
                var currentNoteVal = myNotes[i].note;
                var newNoteVal = currentNoteVal + '<br/><br/><strong>' + dateString + '</strong> | ' + thisNote.note;
                //console.log(newNoteVal);
                myNotes[i].note = newNoteVal;
                Cookies.set('storedNotes', myNotes);
                //myNotes = Cookies.getJSON('storedNotes');
                console.log('Saved');
                confirm.placeholder = 'The note for this subject has been updated';
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

/*////////////////////////////////////////
If its a new subject, add to notes as an array item
 ////////////////////////////////////////*/
function pushNote(thisNote) {
    //console.log('push has been called');
    myNotes.push(thisNote);
    Cookies.set('storedNotes', myNotes);
    //myNotes = Cookies.getJSON('storedNotes');
    console.log('New Note Saved');
    confirm.placeholder = 'New note saved';
    note.value = "";
}


/*////////////////////////////////////////
Load all notes and trigger My Notes panel into view
 ////////////////////////////////////////*/
myNotesButton.onclick = function(e) {
    e.preventDefault();
    //create UL and add class

    var newUlClass = document.createAttribute("class");
    newUlClass.value = "saved-notes-list";
    myNotesList.setAttributeNode(newUlClass);
    //clear the list to allow regeneration
    myNotesList.innerHTML = "";
    //loop through notes array and create list items to append
    myNotes.reverse(); //Newest first
    for (var i = 0; i < myNotes.length; i++) {
        displayNotes(myNotes[i]);
    }
    myNotes.reverse(); //Put array back in correct order - required to save on sorting ID's when pushing new note.
    // add class to trigger panel show
    mySavedNotesPanel.classList.add('notes-open');
};

function displayNotes(noteToBuild) {
    //set up li
    var mySavedNote = document.createElement('li');
    //get note details to populate the li
    var noteTitle = noteToBuild.title;
    var note = noteToBuild.note;
    var noteDate = noteToBuild.date;
    var noteId = noteToBuild.id;
    myNoteslistItem = [
        '<p class="note-title">' + noteTitle + '</p>',
        '<p class="date">' + noteDate + '</p>',
        '<i id="' + noteId + '" class="fa fa-pencil-square fa-lg edit-note" aria-hidden="true"></i>',
        '<p class="saved-note">' + note + '</p>'
    ].join('\n');
    myNotesList.appendChild(mySavedNote);
    //add class to li's
    var newClass = document.createAttribute('class');
    newClass.value = "saved-notes-list-item";
    mySavedNote.setAttributeNode(newClass);
    //add id to li's
    var newId = document.createAttribute('id');
    newId.value = 'note-' + noteId;
    mySavedNote.setAttributeNode(newId);
    //push to list
    mySavedNote.innerHTML = myNoteslistItem;
    myNotesList.appendChild(mySavedNote);
    /////////////////////////////////////////////////////////////////////////////
    var editNote = document.getElementById(noteId);

    editNote.onclick = function(e) {
        e.preventDefault();
        console.log(editNote);
        var noteDetailPanel = document.getElementById('note-detail-panel');
        var noteId = this.id;
        console.log(noteId);
        for (var i = 0; i < myNotes.length; i++) {
            if (myNotes[i].id == noteId) {
                console.log(myNotes[i]);
                noteDetailPanel.innerHTML = myNotes[i].note;
            }
        }
        noteDetailPanel.classList.add('active');
    };
}
/*////////////////////////////////////////
close saved notes panel
 ////////////////////////////////////////*/
var closeSavedNotes = document.getElementById('close-saved-notes');
closeSavedNotes.onclick = function(e) {
    e.preventDefault();
    mySavedNotesPanel.classList.remove('notes-open');
};
/*////////////////////////////////////////
find notes relative to current notepad title
 ////////////////////////////////////////*/
relatedNotesButton.onclick = function(e) {
    e.preventDefault();
    var flag = false;
    var findThis = document.getElementById('noteTitle').value;
    for (var i = 0; i < myNotes.length; i++) {
        if (myNotes[i].title == findThis) {
            flag = true;
            myNotesList.innerHTML = "";
            console.log('Match Found');
            displayNotes(myNotes[i]);
            mySavedNotesPanel.classList.add('notes-open');
            break;
        }

    }
    if (flag === false) {
        console.log('No Related Notes Found');
    }
};
/*////////////////////////////////////////
Open a note from the saved notes panel
 ////////////////////////////////////////*/
/*var result = jsObjects.filter(function(obj) {
    return obj.b == 6;
});*/
