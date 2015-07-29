(function () {
	angular.module('youTubeDataApiApp')
	.controller('YouTubeDataApiController', 
		['$scope', 
		'$timeout', 
		'authService', 
		function(
			$scope, 
			$timeout, 
			authService) {

		// assign context
		var youTubeDataApiController = this;

		youTubeDataApiController.isAuthorized = false;
		youTubeDataApiController.isSearchDisabled = true;
		youTubeDataApiController.isSearchProcessing = false;

		/*
		 * Called external to Angular
		 */
		$scope.authorize = function() {
			authService.authorize()
			.then(function(response){
				youTubeDataApiController.isSearchDisabled = !response.authenticated;	
				youTubeDataApiController.isAuthorized = response.authenticated;

				// TODO: Yikes, calling global functions. This will be solved with Angular services
				requestUserLikesPlaylistId();
				requestUserPlaylists();
			});

			// Wo wo wo, gross, this is happening because this method is called by googleApiClientReady which is on the global namespace and out of Angular's environment.
			// $timeout will not generate a $digest already in progress
			$timeout();
		};

		$scope.search = function() {
			// TODO Yikes, calling global function. This will be solved with Angular searchService which will return a promise
			// youTubeDataApiController.isSearchDisabled = true;
			// youTubeDataApiController.isSearchProcessing = true;
			search();
		}

	}]);
})();