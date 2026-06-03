const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Gateway, nothing to see here!');
});

app.post('/api/auth/login', (req, res) => {
  console.log(req.body);
  // Handle login logic here, e.g., validate credentials, generate token, etc.
  res.json({ success: true, message: 'Login successful!' });
});

app.post('/api/auth/signup', (req, res) => {
  console.log(req.body);
  // Handle signup logic here, e.g., create user account, etc.
  res.json({ success: true, message: 'Signup successful! Please wait for database admin approval.' });
});



app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});