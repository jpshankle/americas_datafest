app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		scope: {
			lines: '='
		},
		templateUrl: '/directives/ofrickshaw-directive/view.html',
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			}
			scope.$watchCollection('lines', function (newValues, oldValues) {
				console.log(newValues);
				/*
				if (typeof newValues === 'object') {
					element.empty();

					var scale1 = d3.scale.linear().domain(d3.extent(newValues, function (value) {
							return value[scope.lines[0]['attr']];
						})),
						scale2 = d3.scale.linear().domain(d3.extent(newValues, function (value) {
							return value[scope.lines[1]['attr']];
						}));
					var graph = new Rickshaw.Graph({
						element: element[0],
						width: 400,
						renderer: 'line',
						series: [
							{
								color: 'steelblue',
								data: scope.lines[0].data,
								name: scope.lines[0].name,
								scale: scale1
							},
							{
								color: 'red',
								data: scope.lines[1].data,
								name: scope.lines[1].name,
								scale: scales2
							}
						]
					});
					new Rickshaw.Graph.Axis.Y.Scaled({
					  element: document.getElementById('axis0'),
					  graph: graph,
					  orientation: 'left',
					  scale: scales1,
					  tickFormat: Rickshaw.Fixtures.Number.formatKMBT
					});

					new Rickshaw.Graph.Axis.Y.Scaled({
					  element: document.getElementById('axis1'),
					  graph: graph,
					  grid: false,
					  orientation: 'right',
					  scale: scales2,
					  tickFormat: Rickshaw.Fixtures.Number.formatKMBT
					});

					new Rickshaw.Graph.Axis.Time({
					  graph: graph
					});

					new Rickshaw.Graph.HoverDetail({
					  graph: graph
					});

					graph.render();
				}*/
			});
		}
	};
}]);