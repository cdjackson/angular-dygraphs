/**
 * dygraph directive for AngularJS
 *
 * Author: Chris Jackson
 *
 * License: MIT
 */
angular.module("angular-dygraphs", [])
    .directive('ngDygraphs', function ($window) {
        return {
            restrict: 'E',
            scope: { // Isolate scope
                data: '=',
                options: '=',
                legend: '=?'
            },
            template: "<div></div><div></div>",
            link: function (scope, element, attrs) {
                var graph = new Dygraph(element.children()[0], scope.data, scope.options);
                scope.$watch("data", function () {
                    var options = scope.options;
                    if(options === undefined) {
                        options = {};
                    }
                    options.file = scope.data;
                    options.highlightCallback = scope.highlightCallback;

                    graph.updateOptions(options);
                    graph.resetZoom();
                }, true);

                /*       scope.highlightCallback = function (e, x, pts, row, seriesName) {
                 var legend = $('div.graph div.legend span b span');
                 legend.each(function () {
                 var span_parent = $(this).parent().parent();
                 var name = $(this).contents()[0].wholeText;
                 var color = $(this).css('color');

                 span_parent.contents().remove();
                 $("<div></div>", {
                 "style": "display: inline-block; " +
                 "position: relative; " +
                 "bottom: .5ex; " +
                 "padding-left: 1em; " +
                 "height: 1px; " +
                 "border-bottom: 2px solid " + color + ";"
                 }).appendTo(span_parent);

                 span_parent.append(" " + name);
                 span_parent.css('font-weight', 'bold');
                 span_parent.css('color', color);
                 });
                 };*/

                var e = element.parent();
                graph.resize(e.width(), e.height());
                var w = angular.element($window);
                w.bind('resize', function () {
                    graph.resize(e.width(), e.height());
                    scope.$apply();
                });
            }
        };
    });