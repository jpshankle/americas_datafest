app.controller('DashboardCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  
    $scope.rice = 12;
    $scope.numberOfItems = function (items) {
        return new Array(items);
    };
    $rootScope.$watch('countries.selectedCountry', function() {
       $scope.lineData = $scope.countries.countryData[$rootScope.countries.selectedCountry.id];
    }, true);
}]);