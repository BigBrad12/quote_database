const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let quotes = [];

fs.readFile('stoic-quotes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    quotes = JSON.parse(data);
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

app.get('/quotes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  const regex = new RegExp(searchTerm, 'gi');
  const matchingQuotes = quotes.filter(quote => regex.test(quote.text) || regex.test(quote.author));
  res.json(matchingQuotes);
  res.end();
});

app.get('/quotes', (req, res) => {
    res.setHeader('Connection', 'keep-alive'); // Add this line to keep the connection alive
    const searchTerm = req.query.searchTerm;
    const regex = new RegExp(searchTerm, 'gi');
    const matchingQuotes = quotes.filter(quote => regex.test(quote.text) || regex.test(quote.author));
    res.json(matchingQuotes);
    res.end();
  });

app.use(express.static(__dirname, { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/quote_database.html');
  });