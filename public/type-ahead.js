// Function to find matches, takes in the word to match and the array of quotes
function findMatches(wordToMatch, quotes) {
  return quotes.filter(quote => {  // Using filter to iterate over array and filter out non-matching quotes
    const regex = new RegExp(wordToMatch, 'gi');  // Creating a regex, which is global and case-insensitive
    return quote.author.match(regex) || quote.text.match(regex);  // Returning matches of regex against author and text on array elements
  })
}

function displayMatches() {
  const searchValue = this.value;
  const apiUrl = `/api/quotes?searchTerm=${searchValue}`;
  $.get(apiUrl, function(data) {
    const matchArray = findMatches(searchValue, data);
    const html = matchArray.map((quote) => {
      const regex = new RegExp(searchValue, 'gi');
      const quoteText = quote.text.replace(regex, `<span class="hl">${searchValue}</span>`);
      const authorName = quote.author.replace(regex, `<span class="hl">${searchValue}</span>`);
      return `
      <div class="result">
        <p>${authorName}: </p>
        <div><p>${quoteText}</p></div>
      </div>
      `;
    }).join('');
    $('.suggestions').html(html);
  });
}



// Selecting search and suggestions elements using jQuery selectors
const searchInput = $('.search');
const suggestions = $('.suggestions');

// Event listeners for when search box value is changed or when a key is released

searchInput.on('change keyup', displayMatches);