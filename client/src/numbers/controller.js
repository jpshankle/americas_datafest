app.controller('NumbersCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
    
	$rootScope.immivizContentAnimateClass = 'back-button';
    $http({
      method: 'GET',
      url: '/data/country_data.json'
    }).success(function(data) {
      $rootScope.$watch('countries.selectedCountry', function() {
        var costs;
        console.log($rootScope.countries.selectedCountry);
        if ($rootScope.countries.selectedCountry) {
          costs = data['x' + $rootScope.countries.selectedCountry.id];
          if (costs) {
            $scope.averageCost = costs.fee;
            var numberInExtremePoverty = Math.floor(costs.people);
            $scope.numberLivingInExtremePovertyForCost = new Array(numberInExtremePoverty);
          }
          // $scope.pieDataArray = [
          //   100 - $rootScope.countries.selectedCountry.costPercent,
          //   $rootScope.countries.selectedCountry.costPercent
          // ];
          
        }
      }, true);
    });
}]);