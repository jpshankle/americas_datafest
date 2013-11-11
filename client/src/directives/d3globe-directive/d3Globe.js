app.directive('d3Globe', ['$rootScope', '$interval', '_',
    function($rootScope, $interval, _) {
        return {
            restrict: 'E',
            template: '<div class="globeElement"></div>',
            link: function(scope, element, attrs) {

            	var startTour = function(){}, 
            		stopTour = function(){},
            		globeTour;

                var globeElement = element.children('.globeElement'),
                	title=d3.select('.countryTitle'),
                    vertBuffer = 30,
                    height = window.innerHeight - vertBuffer,
                    width = height,
                    horizBuffer = ($('.immiviz-globe-spaceholder').width() - width) / 2,
                    sens = 0.25,
                    focused;

                d3.select(globeElement[0])
                    .style('width', width + 'px')
                    .style('height', height + 'px');
                globeElement.css('left', +horizBuffer + 'px');
                globeElement.css('top', +vertBuffer / 2 + 'px');

                //Setting projection

                var projection = d3.geo.orthographic()
                    .scale(width / 2)
                    .rotate([100.00, -40])
                    .translate([width / 2, height / 2])
                    .clipAngle(90)
                    .center([0, 0]);

                var path = d3.geo.path()
                    .projection(projection);

                //SVG container

                var svg = d3.select(globeElement[0]).append("svg:svg")
                    .attr("width", width)
                    .attr("height", height)
                    .call(d3.behavior.drag()
                        .origin(function() {
                            var r = projection.rotate();
                            return {
                                x: r[0] / sens,
                                y: -r[1] / sens
                            };
                        })
                        .on("drag", function() {
                        	stopTour();
                            var rotate = projection.rotate();
                            projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                            svg.selectAll("path").attr("d", path);
                            svg.selectAll(".focused").classed("focused", focused = false);
                        }));

                var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");

                queue()
                    .defer(d3.json, "/world-110m.json")
                    .defer(d3.tsv, "/world-110m-country-names.tsv")
                    .await(function(err, wd, cd){
                    	ready(err, wd, cd);
                    	startTour(4000);
                    });

                //Main function

                function ready(error, world, countryData) {
                    var countries = topojson.feature(world, world.objects.countries).features;
                 		$rootScope.tourCountries = _(countries).pluck('id').shuffle().value();

                    var typeaheadData = [],
                        i, c, year, allCountriesData = {};
                    //Adding countries to select
                    countryData.forEach(function(d) {
                        c = d.id;
                        allCountriesData[c] = {};
                        for (i = 0; i < 25; i++) {
                            year = i < 10 ? '200' : '20';
                            allCountriesData[c][i] = {
                                year: parseInt(year + i),
                                gdp: Math.random() * 10000
                            };
                        }
                        $rootScope.countryById[d.id] = d.name;
                        var newCountry = {
                            name: d.name,
                            value: d.id
                        };
                        typeaheadData.push(newCountry);
                    });

                    $rootScope.countries.countryData = allCountriesData;

                    var myDataset = new Dataset({
                        name: 'countries',
                        local: typeaheadData,
                        valueKey: 'name'
                    });
                    $('.typeahead').typeahead({
                    	autoselect: true,
                    	sections: {
    						hightlight: true,
    						source: myDataset
  						}
  					})
                    .on('typeahead:selected', function(event, selectedItem) {
                    	stopTour();
                        selectCountry(selectedItem);
                        event.currentTarget.value = '';
                    });

                    //Drawing countries on the globe

                    var world = svg.selectAll("path")
                        .data(countries)
                        .enter().append("svg:path")
                        .attr("class", "land")
                        .attr("value", function(d) {
                            return d.id;
                        })
                        .attr("d", path)
                        .on("click", function(item){
                        	stopTour();
                        	selectCountry(item);
                        })

                    	//Mouse events
	                    .on("mouseover", function(d) {
	                        countryTooltip.text($rootScope.countryById[d.id])
	                            .style("left", (d3.event.pageX + 7) + "px")
	                            .style("top", (d3.event.pageY - 15) + "px")
	                            .style("display", "block")
	                            .style("opacity", 1);
	                    })
                        .on("mouseout", function(d) {
                            countryTooltip.style("opacity", 0)
                                .style("display", "none");
                        })
                        .on("mousemove", function(d) {
                            countryTooltip.style("left", (d3.event.pageX + 7) + "px")
                                .style("top", (d3.event.pageY - 15) + "px");
                        });

                    

				    startTour = function(interval) {
				        globeTour = $interval(function() {
				            if ($rootScope.playTour === true) {
				            	var nextCountryId = null, iterations = 0;

				            	while ((nextCountryId === null) && (iterations < 20)) {
				            		if ($rootScope.tourIndex === $rootScope.tourCountries.length) $rootScope.tourIndex = 0;
				            		var cId = $rootScope.tourCountries[$rootScope.tourIndex];
				            		if (!$rootScope.countryById[cId]) {
				            			console.log("Invalid country code found: " + cId);
				            			$rootScope.tourIndex = $rootScope.tourIndex + 1;
				            			iterations = iterations + 1;
				            		} else {
				            			nextCountryId = cId;
				            		}
				            	}
				                selectCountry({value: nextCountryId});
				                $rootScope.tourIndex++;
				            }                
				        }, interval, false);
				    };
				    
				    stopTour = function() {
				    	title.classed('hidden', true);
				    	$rootScope.playTour = false;
				    	$rootScope.$apply();
				        //$interval.cancel(globeTour);
				    };
  
                    function selectCountry(c) {
                    	console.log(c);
                        var item = (typeof c === 'undefined') ? this : d3.select(c)[0][0];
                        var itemId = (item.value) ? item.value : item.id;
                        var rotate = projection.rotate(),
                            focusedCountry = country(countries, item),
                            p = d3.geo.centroid(focusedCountry);

                        svg.selectAll(".active").classed("active", focused = false);

                        $rootScope.countries.selectedCountry = {
                            id: itemId,
                            name: $rootScope.countryById[itemId]
                        };
                        //$rootScope.$apply();

                        //Globe rotating

                        (function transition() {
                            d3.transition()
                                .duration(2500)
                                .each("start", function() {
						        	title.text($rootScope.countryById[focusedCountry.id]);
						        	title.classed('hidden', false);
						        })
                                .tween("rotate", function() {
                                    var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                                    return function(t) {
                                        projection.rotate(r(t));
                                        svg.selectAll("path").attr("d", path)
                                            .classed("active", function(d, i) {
                                                return d.id == focusedCountry.id ? focused = d : false;
                                            });
                                    };
                                })
                        })();
                    }

                    function country(cnt, sel) {
                        for (var i = 0, l = cnt.length; i < l; i++) {
                            if (cnt[i].id == sel.value || cnt[i].id == sel.id) {
                                return cnt[i];
                            }
                        }
                    };
                };

                d3.select(window).on('resize', resize);

                function resize() {
                    // adjust things when the window size changes
                    height = window.innerHeight - vertBuffer,
                    width = height,
                    horizBuffer = ($('.immiviz-globe-spaceholder').width() - width) / 2;
                    // update projection
                    projection
                        .translate([width / 2, height / 2])
                        .scale(width / 2);

                    // resize the map container
                    d3.select(globeElement[0])
                        .style('left', +horizBuffer + 'px');
                    svg
                        .attr("width", width)
                        .attr("height", height)

                    // resize the map
                    svg.select('path').attr('d', path);
                }
            }
        };
    }
]);