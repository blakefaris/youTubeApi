(function () {
	angular.module('youTubeDataApiApp')
	.controller('PageController', 
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
		var pageController = this;

		function activate() {
			pageController.isPlaylistProcessing = true;
			playlistService.get()
			.then(function(response){
				pageController.playlists = response.playlists;
				pageController.selectedPlaylistId = response.playlists ? response.playlists[0].id : null;
				pageController.isPlaylistProcessing = false;
			});
		}

		pageController.isAuthorized = false;
		pageController.isSearchDisabled = true;
		pageController.isSearchProcessing = false;

		pageController.keywords = '';
		pageController.sortBy = 'relevance';
		pageController.zipCode;
		pageController.videos;

		pageController.video = {};

		pageController.isPlaylistProcessing = true;
		pageController.newPlaylistTitle;
		pageController.playlists;
		pageController.selectedPlaylistId;
		pageController.playlistVideos;

		/*
		 * Called external to Angular
		 */
		$scope.authorize = function() {
			authService.authorize()
			.then(function(response){
				pageController.isSearchDisabled = !response.authenticated;	
				pageController.isAuthorized = response.authenticated;

				activate();
			});

			// Wo wo wo, gross, this is happening because this method is called by googleApiClientReady which is on the global namespace and out of Angular's environment.
			// $timeout will not generate a $digest already in progress
			$timeout();
		};

		$scope.search = function() {
			pageController.isSearchDisabled = true;
			pageController.isSearchProcessing = true;

			return searchService.search({
				keywords: pageController.keywords,
				order: pageController.sortBy,
				zipCode: pageController.zipCode
			})
			.then(function(response){
				pageController.videos = response.videos;
			})
			.finally(function(){
				pageController.isSearchDisabled = false;
				pageController.isSearchProcessing = false;
			});
		};

		// TODO: Video functions, future extraction
		$scope.play = function(videoId) {
			videoService.details({
				videoId: videoId
			})
			.then(function(response){
				pageController.video = response.video;

				//TODO: faster, simpler, and easier than pulling in iframe_api.  However, look at using a custom directive or ng-bind-html
				// Manipulating the DOM within an Angular controller using jQuery, hand slap.
				$('#video-player').html(pageController.video.player.embedHtml);
			});

			videoService.comments({
				videoId: videoId
			})
			.then(function(response){
				pageController.video.comments = response.comments;
			});
		};

		// TODO: Playlist functions, future extraction
		$scope.addPlaylist = function() {
			playlistService.add({
				title: pageController.newPlaylistTitle
			})
			.then(function(response){
				// TODO: handle error and success messages
				if (!response.error) {
					pageController.playlists.push(response);
				}
			});
		};

		$scope.addToPlaylist = function(videoId) {
			playlistItemsService.add({
				videoId: videoId,
				playlistId: pageController.selectedPlaylistId
			})
			.then(function(response){
				// TODO: display success message
				console.log(response);
			});
		};

		$scope.removeFromPlaylist = function(video) {
			if (confirm('Are you sure?')) {
				playlistItemsService.remove({
					playlistItemId: video.id
				})
				.then(function(response){
					if (response.success) {
						var index = pageController.playlistVideos.indexOf(video);
						if (index != -1) {
							pageController.playlistVideos.splice(index, 1);
						}
					}
				});
			}
		};

		$scope.showPlaylist = function(playlistId) {
			playlistItemsService.get({
				playlistId:playlistId
			})
			.then(function(response){
				// TODO: marshall response into same object that is used for search results
				pageController.playlistVideos = response.videos;
			});
		};

	}]);
})();
