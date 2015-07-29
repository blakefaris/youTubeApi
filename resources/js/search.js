/**
 * Thanks Google.
 * Copied from https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword
 *
 * Everything is on the global namespace... help, having a heart atta____________________________
 */

// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet',
    order: 'date', // date, rating, relevance
    //pageToken: nextPageToken prevPageToken
    maxResults: 10
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  });
}