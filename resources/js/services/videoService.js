(function () {
	angular.module('youTubeDataApiApp').factory('videoService', ['$q', function($q) {

		// assign context
		var videoService = this;

		// public

		/*
		 * Get details for a video using YouTube Data API.
		 *
		 * params:
		 {
		 	videoId: String Video ID to get details for
		 }
		 */
		videoService.details = function(params) {
			var deferred = $q.defer();

			gapi.client.youtube.videos.list({
				id: params.videoId,
				part: 'snippet,statistics,player'
			})
			.then(function(response) {
				deferred.resolve({
					video: response.result.items ? response.result.items[0] : {}
				});
			});
			
			return deferred.promise;
		};

		/*
		 * Get comments for a video using YouTube Data API.
		 *
		 * params:
		 {
		 	videoId: String Video ID to get comments for
		 }
		 */
		videoService.comments = function(params) {
			var deferred = $q.defer();

			gapi.client.youtube.commentThreads.list({
				videoId: params.videoId,
				part: 'snippet'
			})
			.then(function(response) {
				deferred.resolve({
					comments: response.result.items
				});
			});
			
			return deferred.promise;
		};

		return videoService;
	}]);
})();