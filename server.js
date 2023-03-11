const express = require('express');
const fs = require('fs');
const $ = require('jquery')
const = require('elasticlunr')

const app = express();
const PORT = process.env.PORT || 3000;

const quotesFilePath = 'stoic-quotes.json';
let quotesData;
let idx;

fs.readFile(quotesFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  quotesData = JSON.parse(data);
  console.log(`Loaded ${quotesData.length} quotes from ${quotesFilePath}`);

  idx = elasticlunr(function () {
    this.addField('author');
    this.addField('text');

    quotesData.forEach(function (quote) {
      this.addDoc(quote);
    }, this);
  });

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

app.get('/api/quotes', (req, res) => {
  res.setHeader('Connection', 'keep-alive'); // Add this line to keep the connection alive

  const searchTerm = req.query.searchTerm;
  if (!searchTerm) {
    // Return all quotes if no search term is provided
    res.json(quotesData);
    return;
  }

  const searchResults = idx.search(searchTerm);
  const matchingQuotes = searchResults.map(function (result) {
    return quotesData.find(function (quote) {
      return quote.id === result.ref;
    });
  });

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

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/quote_database.html');
});