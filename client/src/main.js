var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/dashboard/view.html'
        })
        .when('/about', {
            controller: 'AboutCtrl',
            templateUrl: '/about/view.html'
        })
        .otherwise('/');
}]);

app.controller('NavCtrl', ['$scope', function ($scope) {
    $scope.navbarItems = [
        {
            text: 'Dashboard',
            url: ''
        },
        {
            text: 'About',
            url: 'about'
        }
    ];
}]);