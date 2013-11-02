var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MapCtrl',
            templateUrl: '/map/main.html'
        })
        .when('/contact', {
            controller: 'ContactCtrl',
            templateUrl: '/contact/main.html'
        })
        .otherwise('/');
}]);

app.controller('NavCtrl', ['$scope', function ($scope) {
    $scope.navbarItems = [
        {
            text: 'Map',
            url: ''
        },
        {
            text: 'Contact',
            url: 'contact'
        }
    ];
}]);;app.controller('MapCtrl', ['$scope', function ($scope) {

}]);;app.controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
    
}]);