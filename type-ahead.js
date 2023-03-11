// URL for the endpoint to fetch
const endpoint = 'https://gist.githubusercontent.com/BigBrad12/18658a8bb8555aac3cd5672f0468704a/raw/ea8ca8abee66fa7aab393e25534bd82877b704b5/stoic-quotes.json';

// Empty array to store fetched quotes
const quotes = [];

// Fetching quotes using 'fetch'
fetch(endpoint, {
  method: 'GET',  // Setting HTML request type for fetch
  headers: {      // Setting headers to fetch
    'Accept': 'application/json',
  },
})
.then(response => response.json())  // Convert response to JSON
.then(response => quotes.push(...response));  // Push the response into empty array using spread operator

// Function to find matches, takes in the word to match and the array of quotes
function findMatches(wordToMatch, quotes) {
  return quotes.filter(quote => {  // Using filter to iterate over array and filter out non-matching quotes
    const regex = new RegExp(wordToMatch, 'gi');  // Creating a regex, which is global and case-insensitive
    return quote.author.match(regex) || quote.text.match(regex);  // Returning matches of regex against author and text on array elements
  })
}

// Function to display matched quotes on the webpage
function displayMatches() {
  const matchArray = findMatches(this.value, quotes);  // Storing matched quotes in an array and calling findMatches function to get the matches 
  const html = matchArray.map(quote => {  // Mapping through matched quotes to prepare them for displaying on the DOM
    if (this.value) {  // Checking if something is inside the search box
      return `                                                                    
        <div class="result">
          <p>${quote.author}: </p>
          <div><p>${quote.text}</p></div>
        </div>
      `;  // Returning each matched dataset into the html var
    } else {                
      return '';  // If search box is empty, return nothing to clear the page
    }
  }).join('');  // Joining the mapped quotes with no separator to remove the comma or array format 
  suggestions.innerHTML = html;  // Populating the inner HTML of the suggestions element with the prepared HTML string
}

// Selecting search and suggestions elements
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

// Event listeners for when search box value is changed or when a key is released
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);