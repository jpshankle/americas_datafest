app.controller('MapCtrl', ['$scope', function ($scope) {
        angular.extend($scope, {
                center: {
                        latitude: 19.0000, // initial map center latitude
                        longitude: -102.3667 // initial map center longitude
                },
                markers: [], // an array of markers,
                zoom: 5, // the zoom level
        });
}]);