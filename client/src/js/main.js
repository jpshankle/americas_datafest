var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: MainCtrl,
            templateUrl: 'main.html'
        })
        .otherwise('/');
}]);

function MainCtrl () {
    
} 