var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MapCtrl',
            templateUrl: '/map/main.html'
        })
        .when('/about', {
            controller: 'AboutCtrl',
            templateUrl: '/about/main.html'
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
            text: 'About',
            url: 'about'
        }
    ];
}]);;app.controller('MapCtrl', ['$scope', function ($scope) {

}]);;app.controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
    
}]);