const express = require('express');
const path = require('path');
// const api = require('./server.js');
const fs = require('fs');
const notes = require('./db/db');
const uuid = require('../helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get notess`);
  return res.json(notes);
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/index.html'))
);

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      review_id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}`)
);

