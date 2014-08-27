/**
 * dygraph directive for AngularJS
 *
 * Author: Chris Jackson
 *
 * License: MIT
 */
angular.module("angular-dygraphs", [
    'ngSanitize'
])
    .directive('ngDygraphs', function ($window, $sce) {
        return {
            restrict: 'E',
            scope: { // Isolate scope
                data: '=',
                options: '=',
                legend: '=?'
            },
            template: '<div class="ng-dygraphs">' +                     // Outer div to hold the whole directive
                '<div class="graph"></div>' +                           // Div for graph
                '<div class="legend" ng-if="LegendEnabled">' +          // Div for legend
                '<div class="series-container">' +
                '<div ng-repeat="series in legendSeries" class="series">' +
                '<a ng-click="selectSeries(series)">' +
                '<span ng-bind-html="seriesLine(series)"></span>' +
                '<span ng-style="seriesStyle(series)">{{series.label}}</span>' +
                '</a>' +
                '</div>' +                                              // Series Div
                '</div>' +
                '</div>' +                                              // Legend Div
                '<div style="width:100px;height:40px;" class="popover"></div>' +
                '</div>',                                               // Outer div
            link: function (scope, element, attrs) {
                scope.LegendEnabled = true;

                var parent = element.parent();
                var mainDiv = element.children()[0];
                var chartDiv = $(mainDiv).children()[0];
                var legendDiv = $(mainDiv).children()[1];

                var popover = element.find('.popover');

                var graph = new Dygraph(chartDiv, scope.data, scope.options);
                scope.$watch("data", function () {
                    var options = scope.options;
                    if (options === undefined) {
                        options = {};
                    }
                    options.file = scope.data;
                    options.highlightCallback = scope.highlightCallback;
                    options.unhighlightCallback = scope.unhighlightCallback;

                    if (scope.legend !== undefined) {
                        options.labelsDivWidth = 0;
                    }
                    graph.updateOptions(options);
                    graph.resetZoom();

                    resize();
                }, true);

                scope.$watch("legend", function () {
                    // Clear the legend
                    var colors = graph.getColors();
                    var labels = graph.getLabels();

                    scope.legendSeries = {};

                    if (scope.legend.dateFormat === undefined) {
                        scope.legend.dateFormat = 'MMMM Do YYYY, h:mm:ss a';
                    }

                    // If we want our own legend, then create it
                    if (scope.legend !== undefined && scope.legend.series !== undefined) {
                        var cnt = 0;
                        for (var key in scope.legend.series) {
                            scope.legendSeries[key] = {};
                            scope.legendSeries[key].color = colors[cnt];
                            scope.legendSeries[key].label = scope.legend.series[key].label;
                            scope.legendSeries[key].visible = true;
                            scope.legendSeries[key].column = cnt;

                            cnt++;
                        }
                    }

                    resize();
                });

                scope.highlightCallback = function (event, x, points, row, seriesName) {
                    var html = "<table><tr><th colspan='2'>";
                    if(typeof moment === "function") {
                        html += moment(x).format(scope.legend.dateFormat);
                    }
                    else {
                        html += x;
                    }
                    html += "</th></tr>";

                    angular.forEach(points, function (point) {
                        var label;
                        var color;
                        if (scope.legendSeries[point.name] !== undefined) {
                            label = scope.legendSeries[point.name].label;
                            color = "style='color:" + scope.legendSeries[point.name].color + ";'";
                        }
                        else {
                            label = point.name;
                            color = "";
                        }
                        html += "<tr " + color + "><td>" + label + "</td><td>" + point.yval + "</td></tr>";
                    });
                    html += "</table>";
                    popover.html(html);
                    var table = popover.find('table');
                    var width = table.width();
                    var height = table.height();
                    popover.show();
                    popover.css({left: (event.x + 20) + 'px', top: (event.y - (height / 2)) +
                        'px', width: width, height: height});
                };

                scope.unhighlightCallback = function (event) {
                    popover.hide();
                };

                scope.seriesLine = function (series) {
                    return $sce.trustAsHtml('<svg height="14" width="20"><line x1="0" x2="16" y1="8" y2="8" stroke="' +
                        series.color + '" stroke-width="3" /></svg>');
                };

                scope.seriesStyle = function (series) {
                    if (series.visible) {
                        return {color: series.color};
                    }
                    return {};
                };

                scope.selectSeries = function (series) {
                    console.log("Change series", series);
                    series.visible = !series.visible;
                    graph.setVisibility(series.column, series.visible);
                };

                resize();

                var w = angular.element($window);
                w.bind('resize', function () {
                    resize();
                });

                function resize() {
                    var maxWidth = 0;
                    element.find('div.series').each(function () {
                        var itemWidth = $(this).width();
                        maxWidth = Math.max(maxWidth, itemWidth)
                    });
                    element.find('div.series').each(function () {
                        $(this).width(maxWidth);
                    });

                    var legendHeight = element.find('div.legend').outerHeight(true);
                    console.log("Heights", legendHeight, parent.height(), parent.outerHeight(true),
                        $(mainDiv).outerHeight(), element.height(), $(legendDiv).height(),
                        $(legendDiv).outerHeight(true));
                    graph.resize(parent.width(), parent.height() - legendHeight);
                }
            }
        };
    });
