app.directive('d3Globe', [function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			selectedCountry: '='
		},
		templateUrl: '/directives/d3line-directive/view.html',
		link: function (scope, element, attrs) {
			element.empty();
			var activeFeature = null;
			var feature;

			var projection = d3.geo.azimuthal()
			    .scale(380)
			    .origin([-71.03,42.37])
			    .mode("orthographic")
			    .translate([640, 400]);

			var circle = d3.geo.greatCircle()
			    .origin(projection.origin());

			// TODO fix d3.geo.azimuthal to be consistent with scale
			var scale = {
			  orthographic: 380,
			  stereographic: 380,
			  gnomonic: 380,
			  equidistant: 380 / Math.PI * 2,
			  equalarea: 380 / Math.SQRT2
			};

			var path = d3.geo.path()
			    .projection(projection);

			var svg = d3.select(element[0]).append("svg:svg")
			    .attr("width", 1280)
			    .attr("height", 800)
			    .on("mousedown", mousedown);

			d3.json("world-countries.json", function(collection) {
			  feature = svg.selectAll("path")
			    .data(collection.features)
			    .enter().append("svg:path")
			    .attr("d", clip);

			  feature.append("svg:title")
			      .text(function(d) { return d.properties.name; });
			  feature.append("id")
			      .text(function(d) { return d.id; });
			  feature.on("click", function(){
			  	if (activeFeature !== null) {
			  		activeFeature.style("fill", "#8399b0");
			  	}
			  	activeFeature = d3.select(this);
			  	scope.selectedCountry = activeFeature.select("id")[0][0].textContent;
			  	activeFeature.style("fill", "magenta");
			  });
			});

			d3.select(window)
			    .on("mousemove", mousemove)
			    .on("mouseup", mouseup);

			d3.select("select").on("change", function() {
			  projection.mode(this.value).scale(scale[this.value]);
			  refresh(750);
			});

			var m0,
			    o0;

			function mousedown() {
			  m0 = [d3.event.pageX, d3.event.pageY];
			  o0 = projection.origin();
			  d3.event.preventDefault();
			}

			function mousemove() {
			  if (m0) {
			    var m1 = [d3.event.pageX, d3.event.pageY],
			        o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
			    projection.origin(o1);
			    circle.origin(o1)
			    refresh();
			  }
			}

			function mouseup() {
			  if (m0) {
			    mousemove();
			    m0 = null;
			  }
			}

			function refresh(duration) {
			  (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
			}

			function clip(d) {
			  return path(circle.clip(d));
			}
		}
	};
}]);