app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		template: '<div class="rickshawtwolines"></div>',
		scope: {
			lines: '='
		},
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			};

			var rickshawTwoLines = element.children('.rickshawtwolines');

			scope.$watchCollection('lines', function (newValues, oldValues) {
				var containingWidth = rickshawTwoLines.width() - 100;
				rickshawTwoLines.empty();
				rickshawTwoLines.html('<div class="leftaxis"></div><div class="chart"></div><div class="rightaxis"></div>')

				var leftAxis = rickshawTwoLines.find('.leftaxis')[0],
					chart = rickshawTwoLines.find('.chart')[0],
					rightAxis = rickshawTwoLines.find('.rightaxis')[0];

				if (typeof newValues === 'object') {
					var data = [];
					 for (var i in newValues) {
					 	var item = newValues[i];
						data.push({
							x: new Date(item.year,1,1).getTime() / 1000,
							y: item.gdp
						});
					};

					var second = data.map(function (thing) {
						return {
							x: thing.x,
							y: thing.y / 2
						};
					});

					var palette = new Rickshaw.Color.Palette({
						scheme: 'spectrum14'
					});

					var graph = new Rickshaw.Graph( {
					    element: chart, 
					    width: containingWidth,
					    height: 150,
                        renderer: 'line',
                        interpolation: 'linear',
					    series: [
					    	{
						        color: palette.color(),
						        data: data	
					    	},
					    	{
						        color: palette.color(),
						        data: second	
					    	}
					    ]
					});

					var yScale = new Rickshaw.Graph.Axis.Y.Scaled({
						graph: graph,
						grid: false,
						orientation: 'left',
						tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
						element: leftAxis,
						scale: d3.scale.linear(d3.extent(data, function (item) {
							return item.y; 
						}))
					});

					new Rickshaw.Graph.Axis.Y.Scaled({
						element: rightAxis,
						graph: graph,
						grid: false,
						orientation: 'right',
						scale: d3.scale.linear(d3.extent(second, function (item) {
							return item.y; 
						}))
					});

					var time = new Rickshaw.Graph.Axis.Time({
						graph: graph
					});


					var hover = new Rickshaw.Graph.HoverDetail({
						graph: graph
					});

					graph.render();
				}
			});

		}
	};
}]);