const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:postgres@localhost:5432/lsp_sem8');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Gateway, nothing to see here!');
});

app.post('/api/auth/login', (req, res) => {
  console.log(req.body);

  // Handle login logic here, e.g., validate credentials, generate token, etc.
  db.one('SELECT * FROM users WHERE username = $1', [req.body.username])
  .then((data) => {
    console.log('DATA:', data);
    bcrypt.compare(req.body.password, data.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ success: false, message: 'Error occurred while logging in.' });
        return;
      }

      if (data.approved === false) {
        res.status(403).json({ success: false, message: 'Your account is pending approval by the database admin.' });
        return;
      }

      if (isMatch) {
        res.json({ success: true, message: 'Login successful!' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
    });
  })
  .catch((error) => {
    console.log('ERROR:', error);
  });
});

app.post('/api/auth/signup', (req, res) => {
  console.log(req.body);

  // Handle signup logic here, e.g., create user account, etc.
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ success: false, message: 'Error occurred while signing up.' });
      return;
    }

    db.one('INSERT INTO users (username,password) VALUES ($1, $2) RETURNING *', [req.body.username, hashedPassword])
    .then((data) => {
      console.log('DATA:', data);
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
  });

  res.json({ success: true, message: 'Signup successful! Please wait for database admin approval.' });
});



app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});