const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:postgres@localhost:5432/lsp_sem8');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

app.use(cors());
app.use(express.json());

//Auth

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
        let jwtSecretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';
        let jwtdata = {
          time: Date(),
          userId: data.id_users,
          username: data.username,
          role: data.role
        };
        const token = jwt.sign(jwtdata, jwtSecretKey, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful!', jwt: token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
    });
  })
  .catch((error) => {
    console.log('ERROR:', error);
    console.log('No accunt found with username:', req.body.username);
    res.status(401).json({ success: false, message: 'Invalid username or password.' });
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

    db.one('SELECT * FROM users WHERE username = $1', [req.body.username])
    .then((data) => {
      if(data) {
        console.error('Account already existed');
        res.status(500).json({ success: false, message: 'Account already exist, please Login instead'})
      } else {
        db.one('INSERT INTO users (username,password) VALUES ($1, $2) RETURNING *', [req.body.username, hashedPassword])
        .then((data) => {
          console.log('DATA:', data);
          res.json({ success: true, message: 'Signup successful! Please wait for database admin approval.' });
        })
        .catch((error) => {
          console.log('ERROR:', error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  });
});

app.post('/api/auth/verifyJwt', (req, res) => {
  let TokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

  try {
    const token = req.header(TokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
        return res.status(200).send({success: true, message: "Successfully Verified"});
    } else {
        // Access Denied
        return res.status(401).send({success: false, message: "Access Denied"});
    }
  } catch (err) {
    return res.status(401).json({success: false, message: "Error verifying JWT"});
  }
});

//Get

app.get('/api/get/dashboard', async (req,res) => {
  async function getDashboardData() {
    let dashboard_data = {
      total_barang: null,
      total_stok_masuk: null,
      total_stok_keluar: null,
      total_stok_tertinggi: null,
      total_stok_terendah: null
    }

    await db.any("SELECT * FROM item_stocks")
    .then((data) => {
      dashboard_data.total_barang = data;
    })
    .catch((err) => {
      console.err('Error getting item_stocks:',err);
    })

    await db.any("SELECT * FROM transactions WHERE type = 'in'")
    .then((data) => {
      dashboard_data.total_stok_masuk = data
    })
    .catch((err) => {
      console.err('Error getting type in transactions:',err);
    })

    await db.any("SELECT * FROM transactions WHERE type = 'out'")
    .then((data) => {
      dashboard_data.total_stok_keluar = data
    })
    .catch((err) => {
      console.err('Error getting type in transactions:',err);
    })

    await db.any("SELECT * FROM item_stocks WHERE stocks > 0 ORDER BY stocks DESC")
    .then((data) => {
      dashboard_data.total_stok_tertinggi = data;
    })
    .catch((err) => {
      console.err('Error getting highest item_stocks:',err);
    })

    await db.any("SELECT * FROM item_stocks WHERE stocks < 10 ORDER BY stocks ASC")
    .then((data) => {
      dashboard_data.total_stok_terendah = data;
    })
    .catch((err) => {
      console.err('Error getting highest item_stocks:',err);
    })

    return dashboard_data;
  }

  let dashboard_data = await getDashboardData()

  res.status(200).json({success: true, dashboard_data})
});

//Done

app.get('/', (req, res) => {
  res.send('API Gateway, nothing to see here!');
});

app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});