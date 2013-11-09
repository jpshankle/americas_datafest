app.controller('NumbersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	$rootScope.immivizContentAnimateClass = 'back-button';
    $rootScope.countries.selectedCountry = null;
    $rootScope.$watch('countries.selectedCountry', function() {
    	function numberOfRiceIcons (items) {
        	return new Array(items);
    	}
    	$scope.rice = numberOfRiceIcons(Math.ceil(Math.random()*10));
    	$scope.percent = Math.ceil(Math.random()*100);
    	$scope.cost = Math.ceil(Math.random()*10);
       $scope.lineData = $scope.countries.countryData[$rootScope.countries.selectedCountry.id];
    }, true);
}]);