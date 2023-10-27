const express = require('express');
const path = require('path');
// const api = require('./server.js');
const notes = require('./db/db');

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
  let response;


  if (req.body && req.body.product) {
    response = {
      data: req.body,
    };
    res.json(`Review for ${response.data.product} has been added!`);
  } else {
    res.json('Request body must at least contain a product name');
  }


  console.log(req.body);
});
app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}`)
);

