app.directive('ofD3Line', [function () {
	return {
		restrict: 'E',
		scope: {
			lines: '='
		},
		templateUrl: '/directives/d3line-directive/view.html',
		link: function (scope, element, attrs) {
			scope.$watchCollection(function () {
				return scope.lines;
			}, function (newValues, oldValues) {
				if (newValues instanceof Array) {
					element.empty();
					var width = 600,
						height = 400,
						x = d3.time.scale().range([0, width]),
						y = d3.scale.linear().range([height, 0]),
						xAxis = d3.svg.axis().scale(x).orient('bottom'),
						yAxis = d3.svg.axis().scale(y).orient('left'),
						line = d3.svg.line()
							.x(function (value) {
								return x(value[attrs.x]);
							})
							.y(function (value) {
								return y(value[attrs.y]);
							}),
						svg = d3.select(element[0]).append('svg')
							.attr('width', width)
							.attr('height', height);
					x.domain(d3.extent(newValues, function (value) {
						return value[attrs.x];
					}));
					y.domain(d3.extent(newValues, function (value) {
						return value[attrs.y];
					}));
					svg.append('g')
						.attr('class', 'x axis')
						.attr('transform', 'translate(0,' + height + ')')
						.call(xAxis);

					svg.append('g')
						.attr('class', 'y axis')
						.attr('transform', 'translate(0,' + height + ')')
						.call(yAxis);

					svg.append('path')
						.datum(newValues)
						.attr('class', 'line')
						.attr('d', line)
				}
			});
		}
	};
}]);