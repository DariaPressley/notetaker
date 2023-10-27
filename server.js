const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', async (req, res) => {
  const notes = JSON.parse(await fs.promises.readFile('./db/db.json'))
  console.info(`${req.method} request received to get notess`);
  return res.json(notes);
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.post('/api/notes', async (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    const db = await fs.promises.readFile('./db/db.json', 'utf8')
    const parsedNotes = JSON.parse(db);

    parsedNotes.push(newNote);

    await fs.promises.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4))

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

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/index.html'))
);

app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}`)
);

