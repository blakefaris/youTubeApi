/**
 * Thanks Google.
 * From https://developers.google.com/youtube/v3/code_samples/javascript#search_by_keyword
 */
(function () {
	angular.module('youTubeDataApiApp').factory('authService', ['$q', function($q) {

		// assign context
		var authService = this;

		// private
		var deferred = $q.defer();

		/* 
		The client ID is obtained from the Google Developers Console
		at https://console.developers.google.com/.
		If you run this code from a server other than http://localhost,
		you need to register your own client ID.
		*/
		// TODO: wipe API key after demo and replace with token that needs to be replaced.
		var OAUTH2_CLIENT_ID = '649255159208-1dp85vegiijvo7n9ugkoifmiolcm1iir.apps.googleusercontent.com';
		var OAUTH2_SCOPES = [
			'https://www.googleapis.com/auth/youtube.force-ssl'
		];

		/*
		Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
		If the currently logged-in Google Account has previously authorized
		the client specified as the OAUTH2_CLIENT_ID, then the authorization
		succeeds with no user intervention. Otherwise, it fails and the
		user interface that prompts for authorization needs to display.
		*/
		function checkAuth() {
			gapi.auth.authorize({
				client_id: OAUTH2_CLIENT_ID,
				scope: OAUTH2_SCOPES,
				immediate: true
			}, handleAuthResult);
		}

		// Handle the result of a gapi.auth.authorize() call.
		function handleAuthResult(authResult) {
			if (authResult && !authResult.error) {
				// TODO: remove jQuery selectors and events, use Angular
				// Authorization was successful. Hide authorization prompts and show content that should be visible after authorization succeeds.
				$('#sign-in').hide();
				$('#sign-out').show()
				.click(function(){    
					// NOTE: bpef: added hacky logout logic  
					var currentUrl = window.location.href;
					window.location.href = "https://accounts.google.com/logout?continue=https://appengine.google.com/_ah/logout?continue="+currentUrl;
				});
				loadAPIClientInterfaces();
			} else {
				// Attempt a non-immediate OAuth 2.0 client flow. The current function is called when that flow completes.
				$('#sign-out').hide();
				$('#sign-in').show()
				.click(function() {
					gapi.auth.authorize({
						client_id: OAUTH2_CLIENT_ID,
						scope: OAUTH2_SCOPES,
						immediate: false,
						cookie_policy: 'single_host_origin'
					}, function(){
						window.location.reload();
					});
				});
			}
			$('#sign-in-container').removeClass('hidden');
			$('#sign-in-loading').hide();
		}

		/*
		Load the client interfaces for the YouTube Analytics and Data APIs, which
		are required to use the Google APIs JS client. More info is available at
		http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
		*/
		function loadAPIClientInterfaces() {
			gapi.client.load('youtube', 'v3', function(){
				deferred.resolve({
					// TODO: handle user not authenticated
					authenticated: true
				});
			});
		}

		// public

		authService.authorize = function() {
			gapi.auth.init(checkAuth);
			return deferred.promise;
		};

		return authService;
	}]);
})();
