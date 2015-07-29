(function () {
	angular.module('youTubeDataApiApp',[]);
})();


/**
 * Onload callback for apis.google.com/js/client.js
 *
 * TODO: This seems cluggy, is there a cleaner way to do this? (Better Angular solution?, don't use JavaScript API client?)
 */
function googleApiClientReady() {
	// Calls youTubeDataApiContorller.authorize()
	angular.element(document.body).scope().authorize();
}

/**
 * Onload callback for https://www.youtube.com/iframe_api
 */
function onYouTubeIframeAPIReady() {
	// TODO: notify that the API code has downloaded
}