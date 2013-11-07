app.directive('d3Globe', [function () {
	return {
		restrict: 'E',
		template: '<div class="globeElement"></div>',
		scope: {
			selectedCountry: '='
		},
		link: function (scope, element, attrs) {

			var globeElement = element.children('.globeElement'),
				globeWidth = globeElement.width(),
				halfGlobeWidth = globeWidth / 2;
			globeElement.empty();
			globeElement.height(globeWidth);
			var activeFeature = null;
			var feature;

			var projection = d3.geo.orthographic()
			    .scale(halfGlobeWidth)
			    .translate([halfGlobeWidth, halfGlobeWidth])
			    .rotate([-71.03,42.37])
			    .clipAngle(90)
			    .precision(.1);

			var circle = d3.geo.circle()
			    .origin(projection.rotate());

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

			var svg = d3.select(globeElement[0]).append("svg:svg")
			    .attr("width", globeWidth)
			    .attr("height", globeWidth)
			    .on("mousedown", mousedown);

			function makeShitHappen(){


				d3.json("world-countries.json", function(collection) {
				  feature = svg.selectAll("path")
				    .data(collection.features)
				    .enter().append("svg:path")
				    .attr("d", path);

				  feature.append("svg:title")
				      .text(function(d) { return d.properties.name; });
				  feature.append("id")
				      .text(function(d) { return d.id; });
				  feature.on("click", click);
				  /*
				  feature.on("click", function(){
				  	if (activeFeature !== null) { 
				  		activeFeature.style("fill", "#8399b0");
				  	}
				  	activeFeature = d3.select(this);
				  	//console.log(scope);
				  	scope.$parent.changeCountry({name: activeFeature.select("id")[0][0].textContent, fullName: activeFeature.select("title")[0][0].textContent});
				  	//scope.selectedCountry.name = activeFeature.select("id")[0][0].textContent;
				  	activeFeature.style("fill", "magenta");
				  });
				  */
				});

				d3.select(window)
				    .on("mousemove", mousemove)
				    .on("mouseup", mouseup);

				d3.select("select").on("change", function() {
				  projection.mode(this.value).scale(scale[this.value]);
				  refresh(750);
				});

			}

			var m0,
			    o0;

			function mousedown() {
			  m0 = [d3.event.pageX, d3.event.pageY];
			  o0 = projection.rotate();
			  d3.event.preventDefault();
			}

			function mousemove() {
			  if (m0) {
			    var m1 = [d3.event.pageX, d3.event.pageY]
			      , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
			    projection.rotate(o1);
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

			function click(d) {
			  if (activeFeature === d) return reset();

			  activeFeature = d;
			  scope.$parent.changeCountry({name: d.id, fullName: d.properties.name});
			  svg.selectAll(".active").classed("active", false);
			  d3.select(this).classed("active", active = d);

			  var b = path.bounds(d);
			  feature.transition().duration(750).attr("transform",
			      "translate(" + projection.translate() + ")"
			      + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ")"
			      + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
			}

			function reset() {
			  feature.selectAll(".active").classed("active", active = false);
			  feature.transition().duration(750).attr("transform", "");
			}

			function refresh(duration) {
			  (duration ? feature.transition().duration(duration) : feature).attr("d", path);
			}

			makeShitHappen();
		}
	};
}]);