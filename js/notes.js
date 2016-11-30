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
var month = date.getMonth() + 1;
var dateString = date.getDate() + "/" + month + "/" + date.getFullYear();
var title = document.getElementById('noteTitle');
var note = document.getElementById('note');
var saveNoteButton = document.getElementById('saveNote');
var mySavedNotesPanel = document.getElementById('mySavedNotes');
var myNotesButton = document.getElementById('myNotes');
var relatedNotesButton = document.getElementById('relatedNotes');
var confirm = document.getElementsByName('note')[0];
var myNotesList = mySavedNotesPanel.getElementsByTagName("ul")[0];
var noteListItems;
var noteDetailPanel = document.getElementById('note-detail-panel');
var width = window.innerWidth;
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
On save, Assemble the note into an object and send on to be saved
 ////////////////////////////////////////*/
saveNoteButton.onclick = function(e) {
    e.preventDefault();
    if (note.value !== "") {
        var thisNote = {};
        thisNote.id = new Date().getTime();
        thisNote.date = dateString;
        thisNote.note = note.value.replace(/\n/g, '<br/>');
        thisNote.title = title.value;
        findRelatedNotes(thisNote);
        good(note).then(function(animationDone) {
            note.classList.remove('ohYeh');
        });
    } else {
        confirm.placeholder = 'Nothing To Save';
        bad(note).then(function(animationDone) {
            note.classList.remove('heyNo');
        });
    }
};

function good(el) {
    return new Promise(function(animate) {
        note.classList.add('ohYeh');
        setTimeout(function() {
            animate();
        }, 1000);
    });
}

function bad(el) {
    return new Promise(function(animate) {
        note.classList.add('heyNo');
        setTimeout(function() {
            animate();
        }, 1000);
    });
}
/*////////////////////////////////////////
called on save, checks for exsisting note
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
                var newNoteVal = currentNoteVal + '<br/><br/>' + dateString + ' | ' + thisNote.note;
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
        '<i id="' + noteId + '" class="fa fa-pencil-square fa-lg edit-note" aria-hidden="true"></i>',
        '<p class="date">' + noteDate + '</p>',
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
    /*/////////////////////////////////////////////////////////////////////////////////////
    Set up note editing features
     //////////////////////////////////////////////////////////////////////////////////////*/
    var editNote = document.getElementById(noteId);
    editNote.addEventListener('click', function(e) {
        e.preventDefault();
        var noteId = this.id;
        /*/////////////////////////////////////////////////////
        loop through notes to find the right note based id: value
         ////////////////////////////////////////////////////*/
        for (var i = 0; i < myNotes.length; i++) {
            //console.log(myNotes[i]);
            if (myNotes[i].id == noteId) {
                //console.log(myNotes[i]);
                /*/////////////////////////////////////////////////////
                Set up the editor panel
                 ////////////////////////////////////////////////////*/
                var editNoteContent = [
                    '<div class="edit-note-container">',
                    '<header class="edit-note-header">',
                    '<div class="edit-note-header-item" id="edit-note-id">Note ID: ' + noteId + '</div>',
                    '<div class="edit-note-header-item" id="edit-note-title"><h3 class="edit-note-title">' + myNotes[i].title + '</h3></div>',
                    '<div class="edit-note-header-item" id="edit-note-controls">',
                    '     <div class="btn2" id="save-saved-notes"><i class="fa fa-check-circle fa-lg edit-note-control" aria-hidden="true"></i> &nbsp; Close &amp; Save &nbsp;</div>',
                    '     <div class="btn2" id="close-edit-notes"><i class="fa fa-times-circle fa-lg edit-note-control" aria-hidden="true"></i> &nbsp; Cancel&nbsp;</div>',
                    '</div>',
                    ' </header>',
                    ' <div contenteditable id="edit-panel-' + noteId + '" class="edit-note-text"></div>',
                    '</div>'
                ].join('\n');
                noteDetailPanel.innerHTML = editNoteContent;
                var editPanel = document.getElementById('edit-panel-' + noteId);
                editPanel.innerHTML = myNotes[i].note + '<br/><br/>' + dateString + ' | ';
                handle.classList.remove('menu-open');
                rightPanel.classList.remove('menu-open');
                leftPanel.classList.remove('menu-open');
                mySavedNotesPanel.classList.remove('notes-open'); //var is declaired in notes.js
                if (width < 768) {
                    document.getElementById('video-panel').classList.add('edit-note-open');
                    document.getElementById('editor-panel').classList.add('edit-note-open');
                    document.getElementById('note-detail-panel').classList.add('edit-note-open');
                }


            }
        }
        /*/////////////////////////////////////////////////////
        Set up note editing panel buttons
         ////////////////////////////////////////////////////*/
        //save and close button setup
        document.getElementById('save-saved-notes').addEventListener('click', function() {
            var newContent = editPanel.innerHTML.replace(/(<([^>]+)>)/ig, '<br/>'); //regex removes and html elements present and replaces them with a line break
            //console.log(newContent);
            for (var i = 0; i < myNotes.length; i++) {
                if (myNotes[i].id == noteId) {
                    //console.log(myNotes[i].note);
                    myNotes[i].note = newContent;
                    //console.log(myNotes[i].note);
                    Cookies.set('storedNotes', myNotes);
                    noteDetailPanel.classList.remove('show');
                }
            }
            if (width > 1024) {
                rightPanel.classList.toggle('menu-open');
                leftPanel.classList.toggle('menu-open');
            }
            //Quickly added to enable notes on smaller screens - need to sort this out.
            document.getElementById('video-panel').classList.remove('edit-note-open');
            document.getElementById('editor-panel').classList.remove('edit-note-open');
            document.getElementById('note-detail-panel').classList.remove('edit-note-open');
        });

        //cancel and close panel setup
        document.getElementById('close-edit-notes').addEventListener('click', function() {
            e.preventDefault();
            noteDetailPanel.classList.remove('show');
            if (width > 1024) {
                rightPanel.classList.toggle('menu-open');
                leftPanel.classList.toggle('menu-open');
            }
            //Quickly added to enable notes on smaller screens - need to sort this out.
            document.getElementById('video-panel').classList.remove('edit-note-open');
            document.getElementById('editor-panel').classList.remove('edit-note-open');
            document.getElementById('note-detail-panel').classList.remove('edit-note-open');
        });
        //
        noteDetailPanel.classList.add('show');
        mySavedNotesPanel.classList.remove('notes-open');
    });
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
        confirm.placeholder = 'You have no related notes to this video';
        bad(note).then(function(animationDone) {
            note.classList.remove('heyNo');
        });
    }
};
