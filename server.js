const express = require('express');
const uidv1 = require('uuid/v1');
const path = require('path');
const notes = require('./db/db.json');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const addNote = {
        title: req.body.title, 
        text: req.body.text, 
        id: uidv1()
    };
    notes.push(addNote);

    const createNote = JSON.stringify(notes);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), createNote, err => {
        if (err) { 
            res.status(500).json(err);
        };
        res.json(addNote);
    });

});
 
deleteNote = (id, notesArray) => {
    for (var i = 0; i < notesArray.length; i++) {
        const note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i);
            fs.writeFileSync(
                path.join(__dirname, 'db', 'db.json'),
                JSON.stringify(notesArray)
            );
        };
    };
};

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});