/**
 * Thanks Google.
 * Copied from https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword
 */

// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $('#search-button')
  .removeClass('disabled')
  .attr('disabled', false);
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  });
}