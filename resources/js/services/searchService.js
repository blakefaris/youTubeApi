(function () {
	angular.module('youTubeDataApiApp').factory('searchService', ['$q', function($q) {

		// assign context
		var searchService = this;

		// public

		/*
		 * Perform a search using YouTube Data API.
		 *
		 * Params:
		 {
			keywords: String containing keywords to search for
			order: (optional) String with possible values of date, rating, relevance)
		 }
		 */
		searchService.search = function(params) {
			var deferred = $q.defer();

			var request = gapi.client.youtube.search.list({
				q: params.keywords,
				part: 'snippet',
				order: params.order || 'relevance',
				//pageToken: nextPageToken prevPageToken
				type: 'video',
				videoEmbeddable: true,
				videoSyndicated: true, 
				maxResults: 10
			});

			request.execute(function(response) {
				deferred.resolve({
					videos: response.items
				});
			});

			return deferred.promise;
		};

		return searchService;
	}]);
})();
