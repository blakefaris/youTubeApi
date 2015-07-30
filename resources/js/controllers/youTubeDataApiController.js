(function () {
	angular.module('youTubeDataApiApp')
	.controller('YouTubeDataApiController', 
		['$scope', 
		'$timeout', 
		'authService',
		'searchService',
		'videoService',
		function(
			$scope, 
			$timeout, 
			authService,
			searchService,
			videoService) {

		// assign context
		var youTubeDataApiController = this;

		youTubeDataApiController.isAuthorized = false;
		youTubeDataApiController.isSearchDisabled = true;
		youTubeDataApiController.isSearchProcessing = false;

		youTubeDataApiController.keywords = '';
		youTubeDataApiController.sortBy = 'relevance';
		youTubeDataApiController.zipCode;
		youTubeDataApiController.videos;

		youTubeDataApiController.video;

		/*
		 * Called external to Angular
		 */
		$scope.authorize = function() {
			authService.authorize()
			.then(function(response){
				youTubeDataApiController.isSearchDisabled = !response.authenticated;	
				youTubeDataApiController.isAuthorized = response.authenticated;

				// TODO: Yikes, calling global functions. This will be solved with Angular services
				// requestUserLikesPlaylistId();
				requestUserPlaylists();
			});

			// Wo wo wo, gross, this is happening because this method is called by googleApiClientReady which is on the global namespace and out of Angular's environment.
			// $timeout will not generate a $digest already in progress
			$timeout();
		};

		$scope.search = function() {
			youTubeDataApiController.isSearchDisabled = true;
			youTubeDataApiController.isSearchProcessing = true;

			return searchService.search({
				keywords: youTubeDataApiController.keywords,
				order: youTubeDataApiController.sortBy,
				zipCode: youTubeDataApiController.zipCode
			})
			.then(function(response){
				youTubeDataApiController.videos = response.videos;
			})
			.finally(function(){
				youTubeDataApiController.isSearchDisabled = false;
				youTubeDataApiController.isSearchProcessing = false;
			});
		};

		$scope.play = function(videoId) {
			videoService.details(videoId)
			.then(function(response){
				youTubeDataApiController.video = response.video;

				//TODO: faster, simpler, and easier than pulling in iframe_api.  However, look at using a custom directive or ng-bind-html
				// Manipulating the DOM within an Angular controller using jQuery, hand slap.
				$('#video-player').html(youTubeDataApiController.video.player.embedHtml);
			});
		};

	}]);
})();
