var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MapCtrl',
            templateUrl: '/partials/map.html'
        })
        .when('/contact', {
            controller: 'ContacCtrl',
            templateUrl: '/partials/contact.html'
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
}]);