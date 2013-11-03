app.controller('MapCtrl', ['$scope', function ($scope) {
	angular.extend($scope, {
		center: {
			latitude: 38.8951, // initial map center latitude
			longitude: -77.0367, // initial map center longitude
		},
		markers: [], // an array of markers,
		zoom: 8, // the zoom level
	});
	//https://www.google.com/fusiontables/DataSource?docid=1YIungSkFi1TvtLpNKYh81KJqK81XrNHqfq_zSrI
	//

}]);