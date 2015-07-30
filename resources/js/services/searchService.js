(function () {
	angular.module('youTubeDataApiApp').factory('searchService', ['$q', 'zipCodeService', function($q, zipCodeService) {

		// assign context
		var searchService = this;

		// public

		/*
		 * Perform a search using YouTube Data API.
		 *
		 * Params:
		 {
			keywords: 	String containing keywords to search for
			order: 		(optional) String with possible values of date, rating, relevance),
			zipCode: 	(optional) int 5 digit zip code, if a lat/long is not found for it, it is ignored.
		 }
		 */
		searchService.search = function(params) {
			var deferred = $q.defer();

			var location = zipCodeService[params.zipCode];

			var searchParams = {
				q: params.keywords,
				part: 'snippet',
				order: params.order || 'relevance',
				type: 'video',
				videoEmbeddable: true,
				videoSyndicated: true, 
				maxResults: 10
			};

			if (location) {
				searchParams.location = location;
				searchParams.locationRadius = '50mi';
			}

			gapi.client.youtube.search.list(searchParams).execute(function(response) {
				deferred.resolve({
					videos: response.items
				});
			});

			return deferred.promise;
		};

		return searchService;
	}]);
})();
