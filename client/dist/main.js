var app = angular.module('immiviz', [
    'ngRoute',
    'ngResource'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .otherwise('/');
}]);

app.controller('NavCtrl', ['$scope', function ($scope) {
    $scope.navbarItems = [
        {
            text: 'Actions 1',
            url: '/#/action1'
        },
        {
            text: 'Actions 2',
            url: '/#/action2'
        }
    ];
}]);