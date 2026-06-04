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

//Middleware

const AuthJWTMiddleware = function(req,res,next) {
  let TokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

  try {
    const token = req.header(TokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
        console.log({success: true, message: "Successfully Verified"});
        next()
    } else {
        return res.status(401).send({success: false, message: "Access Denied"});
    }
  } catch (err) {
    return res.status(401).json({success: false, message: "Error verifying JWT", error: err});
  }
}

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

app.get('/api/get/dashboard',AuthJWTMiddleware, async (req,res) => {
  async function getDashboardData() {
    let dashboard_data = {
      total_barang: null,
      total_stok_masuk: null,
      total_stok_keluar: null,
      total_stok_tertinggi: null,
      total_stok_terendah: null
    }

    await db.any("SELECT i.id_item, i.id_products, i.name_products, i.stocks , p.category FROM item_stocks i LEFT JOIN products p ON i.id_products = p.id_products")
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

    await db.any("SELECT i.id_item, i.id_products, i.name_products, i.stocks , p.category FROM item_stocks i LEFT JOIN products p ON i.id_products = p.id_products WHERE stocks > 0 ORDER BY stocks DESC")
    .then((data) => {
      dashboard_data.total_stok_tertinggi = data;
    })
    .catch((err) => {
      console.err('Error getting highest item_stocks:',err);
    })

    await db.any("SELECT i.id_item, i.id_products, i.name_products, i.stocks , p.category FROM item_stocks i LEFT JOIN products p ON i.id_products = p.id_products WHERE stocks < 10 ORDER BY stocks ASC")
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



app.get('/api/get/persediaan-barang', AuthJWTMiddleware, (req,res) => {
  db.any("SELECT * FROM item_stocks ORDER BY stocks ASC")
  .then((data) => {
    res.status(200).json({success:true,persediaanBarang_data:data})
  }).catch((err) => {
    console.error("Error getting data for persediaan barang:",err);
    res.status(500).json({success:false,message:"Error fetching data"})
  })
})

app.get('/api/get/persediaan-barang/nama-barang-from-id-barang/:id_barang_masuk', AuthJWTMiddleware, (req,res) => {
  const id_barang_masuk = req.params.id_barang_masuk
  db.one('SELECT name_products FROM products WHERE id_products = $1',id_barang_masuk)
  .then((data) => {
    res.status(200).json({success:true,message:"nama produk berhasil di ambil",data:data})
  }).catch((err) => {
    console.log('Error mengambil nama produk dari id untuk persediaan barang:',err);
    res.status(500).json({success:false,message:"terjadi error ketika mengambio nama produk:",error:err})
    console.log(err)
  })
})



app.get('/api/get/master-data/kategori-barang/:kategori', AuthJWTMiddleware, (req,res) => {
  const kategori = req.params.kategori;

  db.any('SELECT p.name_products, p.category, i.stocks  FROM products p LEFT JOIN item_stocks i ON p.id_products = i.id_products WHERE p.category = $1',kategori)
  .then((data) => {
    res.status(200).json({success:true,message:'Barang berdasarkan kategori berhasil di ambil',data})
  }).catch((err) => {
    console.error("Error getting products by category:",err);
    res.status(500).json({success:false,message:'Error getting products by category',error:err})
  })
})


//Put

app.put('/api/update/persediaan-barang', AuthJWTMiddleware, (req, res) => {
  const { type, id_products, name_products, amount, date } = req.body;
  console.log(req.body);

  // Using the transaction context 't' for all queries executed within this block
  db.tx(async (t) => {
    // 1. Insert into transactions
    await t.none(
      'INSERT INTO transactions (type, id_products, name_products, amount, date) VALUES ($1, $2, $3, $4, $5)',
      [type, id_products, name_products, amount, date]
    );

    // 2. Update item stocks conditionally using the same transaction object 't'
    if (type === 'out') {
      // Changed .one() to .none() because standard UPDATE doesn't return rows
      await t.none(
        'UPDATE item_stocks SET stocks = stocks - $1 WHERE id_products = $2',
        [amount, id_products]
      );
      console.log('Item stocks successfully decremented');
    } else {
      await t.none(
        'UPDATE item_stocks SET stocks = stocks + $1 WHERE id_products = $2',
        [amount, id_products]
      );
      console.log('Item stocks successfully incremented');
    }
  })
  .then(() => {
    console.log("Persediaan barang form handling succeeded");
    res.status(200).json({ success: true, message: 'Data transaksi berhasil di input' });
  })
  .catch((err) => {
    console.error("Error handling persediaan barang form: ", err);
    res.status(500).json({ success: false, message: 'Internal server error during transaction' });
  });
});

//Done

app.get('/', (req, res) => {
  res.send('API Gateway, nothing to see here!');
});

app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});