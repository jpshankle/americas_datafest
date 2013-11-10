app.controller('StoriesCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $rootScope.immivizContentAnimateClass = 'back-button';
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
    $http({
    	method: 'GET',
    	url: '/stories/stories.json'
    }).success(function(data) {
    	$scope.stories = data;
	    $rootScope.$watch('countries.selectedCountry', function() {
	    	var i, storiesLength, story;
          if ($rootScope.countries.selectedCountry) {
			storiesLength = $scope.stories.length;
			for (i = 0; i < storiesLength; i++) {
				if ($scope.stories[i].country === $rootScope.countries.selectedCountry.name) {
					story = $scope.stories[i];
					break;
				}
			}
	    	if (story) {
	    		$scope.story = story;
	    	} else {
	    		$scope.story = {
	    			country: 'Not Found',
	    			story: 'Sorry but we do not have a story for that country at this time.'
	    		}
	    	}
          }
	    }, true);
	});
}]);