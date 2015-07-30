(function () {
	angular.module('youTubeDataApiApp').factory('videoService', ['$q', function($q) {

		// assign context
		var videoService = this;

		// public

		/*
		 * Get details for a video using YouTube Data API.
		 *
		 * Params:
		 	videoId: String Video ID to get details for
		 */
		videoService.details = function(videoId) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.videos.list({
				id: videoId,
				part: 'snippet,statistics,player'
			});

			request.execute(function(response) {
				deferred.resolve({
					video: response.items ? response.items[0] : {}
				});
			});
			
			return deferred.promise;
		};

		/*
		 * Get comments for a video using YouTube Data API.
		 *
		 * Params:
		 	videoId: String Video ID to get comments for
		 */
		videoService.comments = function(videoId) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.commentThreads.list({
				videoId: videoId,
				part: 'snippet'
			});

			request.execute(function(response) {
				deferred.resolve({
					comments: response.items
				});
			});
			
			return deferred.promise;
		};

		return videoService;
	}]);
})();