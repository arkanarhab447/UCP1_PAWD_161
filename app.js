// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Import database connection

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (CSS, JS, images, etc.)
app.use(express.static('public'));

// Route for homepage (Display records)
app.get('/', (req, res) => {
  db.query('SELECT * FROM rekam_medis', (err, results) => {
    if (err) throw err;
    res.render('index', { records: results });
  });
});

// Route for adding new record (Create operation)
app.post('/add', (req, res) => {
  const { nomor_rm, nama, alamat } = req.body;
  const query = 'INSERT INTO rekam_medis (nomor_rm, nama, alamat) VALUES (?, ?, ?)';
  
  db.query(query, [nomor_rm, nama, alamat], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route for updating an existing record (Update operation)
app.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM rekam_medis WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.render('edit', { record: results[0] });
  });
});

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nomor_rm, nama, alamat } = req.body;
  const query = 'UPDATE rekam_medis SET nomor_rm = ?, nama = ?, alamat = ? WHERE id = ?';

  db.query(query, [nomor_rm, nama, alamat, id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route for deleting a record (Delete operation)
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM rekam_medis WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
