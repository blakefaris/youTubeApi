(function () {
	angular.module('youTubeDataApiApp').factory('playlistItemsService', ['$q', function($q) {

		// assign context
		var playlistItemsService = this;

		// public

		/*
		 * Gets the videos for the specified playlist using YouTube Data API.
		 *
		 * params:
		 {
		 	playlistID: String ID of the playlist to get the videos for
		 }
		 */
		playlistItemsService.get = function(params) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.playlistItems.list({
				part: 'snippet,contentDetails',
				playlistId: params.playlistId,
				maxResults: 10
			});

			request.execute(function(response) {
				deferred.resolve({
					videos: response.items
				});
			});
			
			return deferred.promise;
		};

		/*
		 * Add a video to a playlist.
		 *
		 * params:
		 {
		 	playlistId: String Playlist ID for the playlist that will have the video added to it
		 	videoId: 	String Video ID of the video to add
		 }
		 */
		playlistItemsService.add = function(params) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.playlistItems.insert({
				part: 'snippet',
				snippet: {
					playlistId: params.playlistId,
					resourceId: {
						kind: "youtube#video",
						videoId: params.videoId
					}
				}
			});

			request.execute(function(response) {
				deferred.resolve({
					success: !response.error,
					message: response.error ? response.error.message : ''
				});
			});
			
			return deferred.promise;
		};

		/*
		 * Remove a video to a playlist.
		 *
		 * params:
		 {
		 	playlistItemId: String vidoe's unque ID for playlists
		 }
		 */
		playlistItemsService.remove = function(params) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.playlistItems.delete({
				id: params.playlistItemId
			});

			request.execute(function(response) {
				deferred.resolve({
					success: !response.error,
					message: response.error ? response.error.message : ''
				});
			});
			
			return deferred.promise;
		};

		return playlistItemsService;
	}]);
})();