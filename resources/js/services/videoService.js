(function () {
	angular.module('youTubeDataApiApp').factory('videoService', ['$q', function($q) {

		// assign context
		var videoService = this;

		// public

		/*
		 * Load and details for a video using YouTube Data API.
		 *
		 * Params:
		 	videoId: String Video ID to play
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

		return videoService;
	}]);
})();