app.controller('StoriesCtrl', ['$scope', '$rootScope', '$http', '_', function ($scope, $rootScope, $http, _) {
    $rootScope.immivizContentAnimateClass = 'back-button';
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);

    $http({
    	method: 'GET',
    	url: '/data/stories.json'
    }).success(function(data) {
    	$scope.stories = data;
    	var countriesWithData = _.pluck($scope.stories, 'countryId');
    	$rootScope.setTourCountries(countriesWithData);

    	$rootScope.highlightCountries(countriesWithData)

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
	    		$scope.story = null;
	    	}
          }
	    }, true);
	});
}]);