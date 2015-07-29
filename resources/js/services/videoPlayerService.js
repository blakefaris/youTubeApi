/**
 * Thanks Google.
 * Copied from https://developers.google.com/youtube/iframe_api_reference
 */
(function () {
	angular.module('youTubeDataApiApp').factory('videoPlayerService', ['$q', function($q) {

		// assign context
		var videoPlayerService = this;

		// private
		var player;

		// public

		/*
		 * Load and play video using YouTube Data API.
		 *
		 * Params:
		 	videoId: String Video ID to play
		 */
		window.play = videoPlayerService.play = function(videoId) {
			var deferred = $q.defer();

			// Creates an <iframe> (and YouTube player)
			player = new YT.Player('player', {
				height: '390',
				width: '640',
				videoId: videoId,
				events: {
					'onReady': function(event){
						event.target.playVideo();
						deferred.resolve({
							loaded: true
						});
					},
					'onStateChange': $.noop
				}
			});
			return deferred.promise;
		};

		videoPlayerService.stopVideo = function() {
			if (player) {
				player.stopVideo();
			}
		}

		return videoPlayerService;
	}]);
})();