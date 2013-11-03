app.controller('DashboardCtrl', ['$scope', function ($scope) {
    $scope.somethingOnScope = [
    	{
    		title: 'hello',
    		data: 'world'
    	},
    	{
    		title: 'world',
    		data: 'hello'
    	}
    ];
    $scope.changeSomething = function () {
        $scope.somethingOnScope = [
        {
            title: 'something',
            data: 'world'
        },
        {
            title: 'else',
            data: 'hello'
        }
    ];
    }
}]);