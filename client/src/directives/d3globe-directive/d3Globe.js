app.directive('d3Globe', [function () {
	return {
		restrict: 'E',
		template: '<div class="globeElement"></div>',
		scope: {
			selectedCountry: '='
		},
		link: function (scope, element, attrs) {

			var globeElement = element.children('.globeElement'),
				globeWidth = body.height() * 2,
				halfGlobeWidth = globeWidth / 2;

				console.log(globeWidth)
			globeElement.empty();
			globeElement.height(globeWidth);
			globeElement.css('left', '-' + halfGlobeWidth / 2 + 'px');
			var activeFeature = null;
			var feature, pathArcs;

			var projection = d3.geo.orthographic()
			    .scale(halfGlobeWidth)
			    .translate([halfGlobeWidth, halfGlobeWidth])
			    .rotate([100.00,-40])
			    .clipAngle(90)
			    .precision(.1);

			var circle = d3.geo.circle()
			    .origin(projection.rotate());

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


			function redrawEverything() {
				d3.csv("nasacenters.csv", function(error, data) {

			        // --- Helper functions (for tweening the path)
			        var lineTransition = function lineTransition(path) {
			            path.transition()
			                //NOTE: Change this number (in ms) to make lines draw faster or slower
			                .duration(5500)
			                .attrTween("stroke-dasharray", tweenDash)
			                .each("end", function(d,i) { 
			                    ////Uncomment following line to re-transition
			                    //d3.select(this).call(transition); 
			                    
			                    //We might want to do stuff when the line reaches the target,
			                    //  like start the pulsating or add a new point or tell the
			                    //  NSA to listen to this guy's phone calls
			                    //doStuffWhenLineFinishes(d,i);
			                });
			        };
			        var tweenDash = function tweenDash() {
			            //This function is used to animate the dash-array property, which is a
			            //  nice hack that gives us animation along some arbitrary path (in this
			            //  case, makes it look like a line is being drawn from point A to B)
			            var len = this.getTotalLength(),
			                interpolate = d3.interpolateString("0," + len, len + "," + len);

			            return function(t) { return interpolate(t); };
			        };

			        // --- Add paths
			        // Format of object is an array of objects, each containing
			        //  a type (LineString - the path will automatically draw a greatArc)
			        //  and coordinates 
			        var links = [
			            {
			                type: "LineString",
			                    coordinates: [
			                        [ data[0].lon, data[0].lat ],
			                        [ data[1].lon, data[1].lat ]
			                    ]
			            }
			        ];

			        // you can build the links any way you want - e.g., if you have only
			        //  certain items you want to draw paths between
			        // Alterntively, it can be created automatically based on the data
			        links = [];
			        for(var i=0, len=data.length-1; i<len; i++){
			            // (note: loop until length - 1 since we're getting the next
			            //  item with i+1)
			            links.push({
			                type: "LineString",
			                coordinates: [
			                    [ data[i].lon, data[i].lat ],
			                    [ data[i+1].lon, data[i+1].lat ]
			                ]
			            });
			        }

			        // Standard enter / update 
			        pathArcs = svg.selectAll(".arc")
			            .data(links);

			        //enter
			        pathArcs.enter()
			            .append("svg:path").attr({
			                'class': 'arc'
			            }).style({ 
			                fill: 'none',
			            });

			        //update
			        pathArcs.attr({
			                //d is the points attribute for this path, we'll draw
			                //  an arc between the points using the arc function
			                d: path
			            })
			            .style({
			                stroke: '#0000ff',
			                'stroke-width': '2px'
			            })
			            // Uncomment this line to remove the transition
			            .call(lineTransition); 

			        //exit
			        pathArcs.exit().remove();

			    });

			}


			function mousedown() {
			  m0 = [d3.event.pageX, d3.event.pageY];
			  o0 = projection.rotate();
			  d3.event.preventDefault();
			  pathArcs = null;
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
			    redrawEverything();
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
			      + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / globeWidth, (b[1][1] - b[0][1]) / globeWidth) + ")"
			      + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
			  pathArcs.transition().duration(750).attr("transform",
			      "translate(" + projection.translate() + ")"
			      + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / globeWidth, (b[1][1] - b[0][1]) / globeWidth) + ")"
			      + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
			}

			function reset() {
			  feature.selectAll(".active").classed("active", active = false);
			  feature.transition().duration(750).attr("transform", "");
			  pathArcs.transition().duration(750).attr("transform", "");
			}

			function refresh(duration) {
			  (duration ? feature.transition().duration(duration) : feature).attr("d", path);
			}

			makeShitHappen();
		}
	};
}]);