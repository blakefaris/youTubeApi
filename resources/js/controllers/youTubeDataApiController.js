(function () {
	angular.module('youTubeDataApiApp')
	// TODO: this name is way too long, its making the index.html crazy
	.controller('YouTubeDataApiController', 
		['$scope', 
		'$timeout', 
		'authService',
		'searchService',
		'videoService',
		'playlistService',
		'playlistItemsService',
		function(
			$scope, 
			$timeout, 
			authService,
			searchService,
			videoService,
			playlistService,
			playlistItemsService) {

		// assign context
		var youTubeDataApiController = this;

		function activate() {
			youTubeDataApiController.isPlaylistProcessing = true;
			playlistService.get()
			.then(function(response){
				youTubeDataApiController.playlists = response.playlists;
				youTubeDataApiController.selectedPlaylistId = response.playlists ? response.playlists[0].id : null;
				youTubeDataApiController.isPlaylistProcessing = false;
			});
		}

		youTubeDataApiController.isAuthorized = false;
		youTubeDataApiController.isSearchDisabled = true;
		youTubeDataApiController.isSearchProcessing = false;

		youTubeDataApiController.keywords = '';
		youTubeDataApiController.sortBy = 'relevance';
		youTubeDataApiController.zipCode;
		youTubeDataApiController.videos;

		youTubeDataApiController.video = {};

		youTubeDataApiController.isPlaylistProcessing = true;
		youTubeDataApiController.newPlaylistTitle;
		youTubeDataApiController.playlists;
		youTubeDataApiController.selectedPlaylistId;
		youTubeDataApiController.playlistVideos;

		/*
		 * Called external to Angular
		 */
		$scope.authorize = function() {
			authService.authorize()
			.then(function(response){
				youTubeDataApiController.isSearchDisabled = !response.authenticated;	
				youTubeDataApiController.isAuthorized = response.authenticated;

				activate();
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

		// TODO: Video functions, future extraction
		$scope.play = function(videoId) {
			videoService.details({
				videoId: videoId
			})
			.then(function(response){
				youTubeDataApiController.video = response.video;

				//TODO: faster, simpler, and easier than pulling in iframe_api.  However, look at using a custom directive or ng-bind-html
				// Manipulating the DOM within an Angular controller using jQuery, hand slap.
				$('#video-player').html(youTubeDataApiController.video.player.embedHtml);
			});

			videoService.comments({
				videoId: videoId
			})
			.then(function(response){
				youTubeDataApiController.video.comments = response.comments;
			});
		};

		// TODO: Playlist functions, future extraction
		$scope.addPlaylist = function() {
			playlistService.add({
				title: youTubeDataApiController.newPlaylistTitle
			})
			.then(function(response){
				// TODO: handle error and success messages
				if (!response.error) {
					youTubeDataApiController.playlists.push(response);
				}
			});
		};

		$scope.addToPlaylist = function(videoId) {
			playlistItemsService.add({
				videoId: videoId,
				playlistId: youTubeDataApiController.selectedPlaylistId
			})
			.then(function(response){
				// TODO: display success message
				console.log(response);
			});
		};

		$scope.removeFromPlaylist = function(video) {
			playlistItemsService.remove({
				playlistItemId: video.id
			})
			.then(function(response){
				if (response.success) {
					youTubeDataApiController.playlistVideos.splice(video, 1);
				}
			});
		};

		$scope.showPlaylist = function(playlistId) {
			playlistItemsService.get({
				playlistId:playlistId
			})
			.then(function(response){
				// TODO: marshall response into same object that is used for search results
				youTubeDataApiController.playlistVideos = response.videos;
			});
		};

	}]);
})();
