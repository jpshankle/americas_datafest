var app = angular.module('immiviz', [
    
])

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