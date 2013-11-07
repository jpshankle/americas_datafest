var body = $('body');
body.height(window.innerHeight);

var app = angular.module('immiviz', [
    'ngRoute',
    'google-maps'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/dashboard/view.html'
        })
        .when('/map', {
            controller: 'MapCtrl',
            templateUrl: '/map/view.html'
        })
        .otherwise('/');
}]);