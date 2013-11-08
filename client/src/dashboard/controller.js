app.controller('DashboardCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.$watch('countries.selectedCountry', function() {
       $scope.lineData = $scope.countries.countryData[$rootScope.countries.selectedCountry.id];
    }, true);
}]);