app.controller('NumbersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
    
	$rootScope.immivizContentAnimateClass = 'back-button';
    $rootScope.$watch('countries.selectedCountry', function() {
      if ($rootScope.countries.selectedCountry) {
        
        $rootScope.countries.selectedCountry.costPercent = 10;
        $scope.pieDataArray = [
          100 - $rootScope.countries.selectedCountry.costPercent,
          $rootScope.countries.selectedCountry.costPercent
        ];
        $scope.averageCost = $rootScope.countries.selectedCountry.costPercent * 2;
        var numberInExtremePoverty = Math.floor($scope.averageCost / 1.25);
        $scope.numberLivingInExtremePovertyForCost = new Array(numberInExtremePoverty);
      }
    }, true);
}]);