app.controller('NumbersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	$rootScope.immivizContentAnimateClass = 'back-button';
    $scope.rice = 12;
    $scope.numberOfItems = function (items) {
        return new Array(items);
    };
    $rootScope.$watch('countries.selectedCountry', function() {
       $scope.lineData = $scope.countries.countryData[$rootScope.countries.selectedCountry.id];
    }, true);
}]);