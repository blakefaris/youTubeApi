(function () {
	angular.module('youTubeDataApiApp').controller('YouTubeDataApiController', ['$scope', 'authService', function($scope, authService) {
		$scope.authorize = function() {
			authService.authorize();
		}
	}]);
})();