/*
 * Everything is on the global namespace... help, having a heart atta____________________________
 */

function requestUserPlaylists() {
  var request = gapi.client.youtube.playlists.list({
    mine: true,
    part: 'snippet'
  });
  request.execute(function(response) {
  	$('#playlists-container').html('');
    var playlistItems = response.result.items;
    if (playlistItems) {
      $.each(playlistItems, function(index, item) {
        displayPlaylistsResult(item);
      });
    } else {
      $('#playlists-container').html('Sorry you have no playlists.');
    }
  });
}

function displayPlaylistsResult(playlist) {
  var playlistId = playlist.id;
  var title = playlist.snippet.title;
  $('#playlists-container').append('<p>' + title + ' - ' + playlistId + '</p>');
}