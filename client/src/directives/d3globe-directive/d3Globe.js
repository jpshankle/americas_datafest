app.directive('d3Globe', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'E',
            template: '<div class="globeElement"></div>',
            scope: {
                countries: '='
            },
            link: function(scope, element, attrs) {

                var globeElement = element.children('.globeElement'),
                    vertBuffer = 30,
                    height = window.innerHeight - vertBuffer,
                    width = height,
                    sens = 0.25,
                    focused;

                globeElement.empty();
                d3.select(globeElement[0])
                    .style('width', width + 'px')
                    .style('height', height + 'px');
                globeElement.css('left', +vertBuffer + 'px');
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
                            var rotate = projection.rotate();
                            projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                            svg.selectAll("path").attr("d", path);
                            svg.selectAll(".focused").classed("focused", focused = false);
                        }));

                var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");

                queue()
                    .defer(d3.json, "/world-110m.json")
                    .defer(d3.tsv, "/world-110m-country-names.tsv")
                    .await(ready);

                //Main function

                function ready(error, world, countryData) {

                    var countryById = {},
                        countries = topojson.feature(world, world.objects.countries).features;
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
                        countryById[d.id] = d.name;
                        var newCountry = {
                            name: d.name,
                            value: d.id
                        };
                        typeaheadData.push(newCountry);
                    });

                    $rootScope.countries.countryData = allCountriesData;

                    $('.typeahead').typeahead({
                        name: 'countries',
                        local: typeaheadData,
                        valueKey: 'name'
                    })
                        .on('typeahead:selected', function(event, selectedItem) {
                            selectCountry(selectedItem);
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
                        .on("click", selectCountry)

                    	//Mouse events
	                    .on("mouseover", function(d) {
	                        countryTooltip.text(countryById[d.id])
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
                        });;

                    d3.select("select").on("change", selectCountry);

                    function selectCountry(c) {
                        var item = (typeof c === 'undefined') ? this : d3.select(c)[0][0];
                        var itemId = (item.value) ? item.value : item.id;
                        var rotate = projection.rotate(),
                            focusedCountry = country(countries, item),
                            p = d3.geo.centroid(focusedCountry);

                        svg.selectAll(".active").classed("active", focused = false);

                        $rootScope.countries.selectedCountry = {
                            id: itemId,
                            name: countryById[itemId]
                        };
                        $rootScope.$apply();

                        //Globe rotating

                        (function transition() {
                            d3.transition()
                                .duration(2500)
                                .tween("rotate", function() {
                                    var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                                    return function(t) {
                                        console.log();
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

                    console.log("resize called!");
                    // adjust things when the window size changes
                    height = window.innerHeight - vertBuffer,
                    width = height;
                    console.log(height);
                    // update projection
                    projection
                        .translate([width / 2, height / 2])
                        .scale(width / 2);

                    // resize the map container
                    d3.select(globeElement[0])
                        .style('width', width + 'px')
                        .style('height', height + 'px');
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