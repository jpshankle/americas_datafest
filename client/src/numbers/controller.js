app.controller('NumbersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
    
	$rootScope.immivizContentAnimateClass = 'back-button';
    $rootScope.$watch('countries.selectedCountry', function() {
      if ($rootScope.countries.selectedCountry) {
    	function numberOfRiceIcons (items) {
        	return new Array(items);
    	}
    	$scope.rice = numberOfRiceIcons(Math.ceil(Math.random()*10));
    	$scope.percent = Math.ceil(Math.random()*100);
    	$scope.cost = Math.ceil(Math.random()*10);
      }
    }, true);
}]);