// Function to find matches, takes in the word to match and the array of quotes
function findMatches(wordToMatch, quotes) {
  return quotes.filter(quote => {  // Using filter to iterate over array and filter out non-matching quotes
    const regex = new RegExp(wordToMatch, 'gi');  // Creating a regex, which is global and case-insensitive
    return quote.author.match(regex) || quote.text.match(regex);  // Returning matches of regex against author and text on array elements
  })
}

function displayMatches() {
  const searchTerm = this.value;
  fetch(`/quotes?searchTerm=${searchTerm}`)
    .then(response => response.json())
    .then(matchingQuotes => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const html = matchingQuotes.map(quote => {
            return `
              <div class="result">
                <p>${quote.author}: </p>
                <div><p>${quote.text}</p></div>
              </div>
            `;
          }).join('');
          suggestions.innerHTML = html;
          resolve();
        }, 2000); // Wait for 500 milliseconds before rendering the quotes
      });
    })
    .catch(error => console.error(error));
}

// Selecting search and suggestions elements
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

// Event listeners for when search box value is changed or when a key is released
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);