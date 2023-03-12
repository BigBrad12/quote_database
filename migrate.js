const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'brad',
  host: 'localhost',
  database: 'brad',
  password: 'poespoesface123!',
  port: '5432',
});

fs.readFile('stoic-quotes.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const quotes = JSON.parse(data);
  const insertQueries = quotes.map(quote => {
    return {
      text: 'INSERT INTO quotes (author, text) VALUES ($1, $2)',
      values: [quote.author, quote.text]
    };
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error(err);
      return;
    }

    client.query('BEGIN', (err) => {
      if (err) {
        console.error(err);
        return;
      }

      insertQueries.forEach((query, index) => {
        client.query(query.text, query.values, (err) => {
          if (err) {
            console.error(err);
            client.query('ROLLBACK', (err) => {
              release();
            });
            return;
          }

          if (index === insertQueries.length - 1) {
            client.query('COMMIT', (err) => {
              if (err) {
                console.error(err);
              }
              release();
              console.log('Data imported successfully.');
            });
          }
        });
      });
    });
  });
});