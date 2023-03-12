const express = require('express');
const $ = require('jquery');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/brad`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // only set ssl to true if using Heroku's database
});

client.connect()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Failed to connect to database', err));

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/quotes', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  console.log('searchTerm:', searchTerm);
  if (!searchTerm) {
    const result = await client.query('SELECT * FROM quotes');
    res.json(result.rows);
    return;
  }

  try {
    const result = await client.query('SELECT * FROM quotes WHERE text ILIKE $1 OR author ILIKE $1', [`%${searchTerm}%`]);
    const searchResults = result.rows.map(row => {
      return { text: row.text, author: row.author };
    });

    res.json(searchResults);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    app.use(express.static(__dirname + '/public', {
      setHeaders: (res, path, stat) => {
        const extension = path.split('.').pop();
        switch (extension) {
          case 'js':
            res.set('Content-Type', 'application/javascript');
            break;
          case 'css':
            res.set('Content-Type', 'text/css');
            break;
          case 'jpeg':
          case 'jpg':
            res.set('Content-Type', 'image/jpeg');
            break;
          default:
            res.set('Content-Type', 'text/plain');
            break;
        }
      }
    }));
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/quote_database.html');
    });
  });