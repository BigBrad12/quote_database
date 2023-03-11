const express = require('express');
const fs = require('fs');
const $ = require('jquery')

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  }); 

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
    res.setHeader('Connection', 'keep-alive'); // Add this line to keep the connection alive
    const searchTerm = req.query.searchTerm;
    const regex = new RegExp(searchTerm, 'gi');
    const matchingQuotes = quotes.filter(quote => regex.test(quote.text) || regex.test(quote.author));
    res.json(matchingQuotes);
  });

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