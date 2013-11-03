app.directive('ofD3Line', [function () {
	return {
		restrict: 'E',
		scope: {
			slices: '='
		},
		templateUrl: '/directives/d3line-directive/view.html',
		link: function (scope, element, attrs) {
			scope.$watchCollection(function () {
				return scope.slices;
			}, function (newValues, oldValues) {
				element.empty();
				var width = 600,
					height = 400,
					x = d3.time.scale().range([0, width]),
					y = d3.scale.linear().range([height, 0]),
					xAxis = d3.svg.axis().scale(x).orient('bottom'),
					yAxis = d3.svg.axis().scale(y).orient('left'),
					svg = d3.select(element[0]);
				svg.append('svg')
					.attr('width', width)
					.attr('height', height);


			});
		}
	};
}]);