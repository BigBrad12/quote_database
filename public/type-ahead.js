var currentPage = 0;
var pageSize = 100;

function getSearchValue() {
  return $('.search').val().trim();
}

function displayMatches() 
{
  const searchValue = getSearchValue();

  console.log(searchValue);

  if (!searchValue) {
    $('.suggestions').html("");
    return;
  }

  const apiUrl = `/api/quotes?searchTerm=${searchValue}`;
  $.get(apiUrl, function (data) {
    // check if the current page is more than the num of pages for data returned
    console.log(data.length)
    const numPages = Math.ceil(data.length / pageSize);
    console.log(currentPage)
    if (currentPage > numPages){
      currentPage = 0;
    }

    // Calculate the start and end indices for the current page
    var startIndex = currentPage * pageSize;
    var endIndex = Math.min(startIndex + pageSize, data.length);

    

    const html = data.slice(startIndex, endIndex).map(quote => {
      return `
        <div class="result">
          <p>${quote.author}: </p>
          <div><p>"${quote.text}"</p></div>
        </div>
      `;
    }).join('');
    $('.suggestions').html(html);

    // Update the state of the pagination buttons
    $('#previous-btn').prop('disabled', currentPage === 0);
    $('#next-btn').prop('disabled', endIndex >= data.length);
  }).fail(function () {
    // Handle AJAX failure
    $('.suggestions').html('<div class="error">Failed to fetch results.</div>');
  });
}
// Event listener for previous button click
$('#previous-btn').on('click', function() {
  currentPage--;
  displayMatches();
});

// Event listener for next button click
$('#next-btn').on('click', function() {
  currentPage++;
  displayMatches();
});

// Event listeners for when search box value is changed or when a key is released
const searchInput = $('.search');
const suggestions = $('.suggestions');
searchInput.on('change keyup', displayMatches);