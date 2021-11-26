Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json',
    // 'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json',
    topology => {

        // Create a dummy data value for each geometry
        const data = topology.objects.default.geometries.map((f, i) => i % 5);

        const click = function (e) {
            // `this` is either Series or Chart
            const chart = this.chart || this;

            // Get position in pre-projected units
            const pos = chart.mapView.pixelsToProjectedUnits({
                x: Math.round(e.chartX - chart.plotLeft),
                y: Math.round(e.chartY - chart.plotTop)
            });

            // Convert to latLon
            const p = chart.fromPointToLatLon(pos);
            p.name = '[N' + p.lat.toFixed(2) + ', E' + p.lon.toFixed(2) + ']';

            // Add point
            chart.get('clicks').addPoint(p);
        };

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: topology,
                plotBorderWidth: 1,
                events: {
                    click
                }
            },

            title: {
                text: 'TopoJSON in Highcharts Maps'
            },

            mapNavigation: {
                enabled: true
            },

            mapView: {
                projection: {
                    name: 'LambertConformalConic',
                    parallels: [33, 45],
                    rotation: [96]
                },

                //--- Schema for insets ---

                // Generic options for insets (like annotations.labelOptions and
                // shapeOptions)
                insetOptions: {
                    // borderColor: '',
                    borderWidth: 1,
                    // Maybe we need padding: [top, right, bottom, left]
                    padding: '5%',
                    relativeTo: 'mapBoundingBox',
                    units: 'percent' // 'pixels' | 'percent'
                },

                // The collection of insets. Consider an object with named
                // children in order to make merging easier. Each item inherits
                // from `insetOptions`.
                insets: {
                    alaska: {

                        // borderColor: '',

                        // Path for the rendered border, subject to units.
                        // Defaults to the outline of the `field`.
                        borderPath: {
                            type: 'MultiLineString',
                            coordinates: [
                                [
                                    [0, 66],
                                    [20, 78],
                                    [20, 100]
                                ]
                            ]
                        },

                        // borderWidth: 1,

                        // What coordinates to render in the center of the
                        // bounding box. Defaults to the center of the planar
                        // projection.
                        center: void 0,

                        // Placement of the inset in the map, a polygon subject
                        // to units
                        field: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [0, 72],
                                    [20, 80],
                                    [20, 100],
                                    [0, 100]
                                ]
                            ]
                        },

                        // Geometries within this geometry are removed from the
                        // default map view and rendered in the inset.
                        geoBounds: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [-179.5, 50],
                                    [-129, 50],
                                    [-129, 72],
                                    [-179.5, 72]
                                ]
                            ]
                        },

                        // Optionally ties in features/geometries
                        id: 'us-all-alaska',

                        // Padding inside the frame, like mapView.padding
                        padding: 10,

                        // Projection to use within the inset, defaults to best
                        // guess based on geo bounds
                        projection: {
                            name: 'LambertConformalConic',
                            parallels: [55, 65],
                            rotation: [154]
                        },

                        // units: 'percent', // 'pixels' | 'percent'

                        // Auto fitted to the bounding box
                        zoom: void 0
                    },
                    hawaii: {
                        borderPath: {
                            type: 'LineString',
                            coordinates: [
                                [
                                    [20, 78],
                                    [35, 87]
                                ]
                            ]
                        },
                        field: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [20, 82.5],
                                    [35, 87.5],
                                    [35, 100],
                                    [20, 100]
                                ]
                            ]
                        },
                        geoBounds: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [-162, 23],
                                    [-152, 23],
                                    [-152, 18],
                                    [-162, 18]
                                ]
                            ]
                        },
                        projection: {
                            name: 'LambertConformalConic',
                            parallels: [8, 18],
                            rotation: [157]
                        }
                    }
                }
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#900037'
            },

            series: [{
                data,
                joinBy: null,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                },
                events: {
                    click
                }
            }, {
                colorAxis: false,
                type: 'mappoint',
                id: 'clicks',
                name: 'Clicks',
                data: [],
                tooltip: {
                    pointFormat: '{point.name}'
                }
            }/*, {
                mapData: Object.values(topology.objects
                    .default['hc-recommended-transform']),
                type: 'mapline',
                nullColor: 'blue'
            }*/]
        });
    }
);
