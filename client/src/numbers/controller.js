app.controller('NumbersCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
    
	$rootScope.immivizContentAnimateClass = 'back-button';
    $http({
      method: 'GET',
      url: '/data/country_data.json'
    }).success(function(data) {

      var countriesWithData = _.map(data, function(value, key){
          return parseInt(key.slice(1));
      });
      console.log(countriesWithData);
      $rootScope.setTourCountries(countriesWithData);
      $rootScope.highlightCountries(countriesWithData);

      $rootScope.$watch('countries.selectedCountry', function() {
        var costs;
        if ($rootScope.countries.selectedCountry) {
          costs = data['x' + $rootScope.countries.selectedCountry.id];
          if (costs) {
            $scope.averageCost = costs.fee;
            $scope.averagePercent = costs.average;
            $scope.numberInExtremePoverty = Math.floor(costs.people);
            $scope.numberLivingInExtremePovertyForCost = new Array($scope.numberInExtremePoverty);
          }     
        }
      }, true);
    });
}]);