app.directive('pieChart', [function () {
        return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                        pieData: '='
                },
                link: function (scope, element, attrs) {
                    element.empty();
                      var wh = 150, radius = wh / 2,
                          color = d3.scale.ordinal()
                            .range(['#f00', '#0f0']),
                          arc = arc = d3.svg.arc()
                            .outerRadius(radius)
                            .innerRadius(0)
                          pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                              return d.pieData;
                            });

                        scope.$watchCollection('lines', function (newValues, oldValues) {
                          var svg = d3.select("body").append("svg")
                                .attr("width", width)
                                .attr("height", height)
                                .append("g")
                                .attr("transform", "translate(" + radius + "," + radius + ")"),
                              g = svg.selectAll('.arc')
                                .data(pie(scope.pieData))
                                .enter()
                                .append('g')
                                .attr('class', 'arc');
                          g.append('path')
                            .attr('d', arc)
                            .style('fill', function (d, i) {
                              return color(i);
                            })             
                        });

                }
        };
}]);