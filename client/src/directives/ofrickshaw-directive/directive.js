app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		templateUrl: '/directives/ofrickshaw-directive/view.html',
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			}
			element.empty();

		}
	};
}]);