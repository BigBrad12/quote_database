// Function to find matches, takes in the word to match and the array of quotes
function findMatches(wordToMatch, quotes) {
  return quotes.filter(quote => {  // Using filter to iterate over array and filter out non-matching quotes
    const regex = new RegExp(wordToMatch, 'gi');  // Creating a regex, which is global and case-insensitive
    return quote.author.match(regex) || quote.text.match(regex);  // Returning matches of regex against author and text on array elements
  })
}

function displayMatches() {
  const matchArray = findMatches(this.value, quotes);
  const html = matchArray
    .map((quote) => {
      const regex = new RegExp(this.value, 'gi');
      const quoteText = quote.text.replace(regex, `<span class="hl">${this.value}</span>`);
      const authorName = quote.author.replace(regex, `<span class="hl">${this.value}</span>`);
      return `
        <li>
          <span class="name">${authorName}</span>
          <span class="author">${quoteText}</span>
        </li>
      `;
    })
    .join('');
  suggestions.innerHTML = html;
}

// Event listeners for when search box value is changed or when a key is released
searchInput.addEventListener('input', function () {
  displayMatches.call(this, quotes);
});
searchInput.addEventListener('keyup', function () {
  displayMatches.call(this, quotes);
});