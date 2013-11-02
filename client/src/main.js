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
}]);