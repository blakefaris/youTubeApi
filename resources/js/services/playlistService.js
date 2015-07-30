(function () {
	angular.module('youTubeDataApiApp').factory('playlistService', ['$q', function($q) {

		// assign context
		var playlistService = this;

		// public

		/*
		 * Gets the user's playlists using YouTube Data API.
		 */
		playlistService.get = function() {
			var deferred = $q.defer();

			var request = gapi.client.youtube.playlists.list({
				part: 'snippet',
				mine: true
			});

			request.execute(function(response) {
				deferred.resolve({
					playlists: response.items
				});
			});
			
			return deferred.promise;
		};

		/*
		 * Creates a playlist for the use using YouTube Data API.
		 *
		 * params:
		 {
		 	title: String title of the new playlist
		 }
		 */
		playlistService.add = function(params) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.playlists.insert({
				part: 'snippet',
				snippet: {
					title: params.title
				}
			});

			request.execute(function(response) {
				deferred.resolve(response);
			});
			
			return deferred.promise;
		};

		return playlistService;
	}]);
})();