var myNotes = [];
var lastNote = 0;
var title = document.getElementById('noteTitle');
var note = document.getElementById('note');
var saveNoteButton = document.getElementById('saveNote');
if (typeof Cookies('storedNotes') !== 'undefined') {
    myNotes = Cookies.getJSON('storedNotes');
    lastNote = myNotes.length - 1;
    console.log(myNotes);
}
saveNoteButton.onclick = function() {
    var thisNote = {};
    thisNote.title = title.value;
    thisNote.note = note.value;
    console.log(thisNote);
    myNotes.push(thisNote);
    Cookies.set('storedNotes', myNotes);
    /*for (var i = 0; i < myNotes.length; i++) {
        //console.log(myNotes[i]);
        switch (thisNote) {
            case myNotes[i] === thisNote:
                alert("No changes to save");
                break;
            default:


        }
    }*/




};
