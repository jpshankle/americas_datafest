app.controller('AboutCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	$rootScope.immivizContentAnimateClass = 'back-button';
    $rootScope.countries.selectedCountry = null;
}]);