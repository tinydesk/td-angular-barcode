(function () {
    'use strict';

    var mod = angular.module('tdd.barcode', []);

    /**
     * TODO Doc
     */
    mod.directive('tddBarcode', [function() {
        return {
            restrict : 'E',
            scope : { config : '=' },
            template : '<canvas ng-show="!error.show"></canvas><span ng-if="error.show">Barcode error: {{error.msg}}</span>',
            link : function(scope, elem) {

                scope.error = {
                    show : false,
                    msg : null
                };

                var canvas = elem.children().eq(0);

                function parseOptions(bw, options) {
                    var tmp = options.split(' ');

                    var result = {};

                    for (var i = 0; i < tmp.length; i++) {
                        if (!tmp[i]) {
                            continue;
                        }

                        var eq = tmp[i].indexOf('=');
                        if (eq == -1) {
                            result[tmp[i]] = bw.value(true);
                        } else {
                            result[tmp[i].substr(0, eq)] = bw.value(tmp[i].substr(eq+1));
                        }
                    }

                    return result;
                }

                function handleError(err) {
                    if (typeof err === 'string') {
                        scope.error.msg = err;
                    } else if (err.stack) {
                        scope.error.msg = err.message + ' ' + err.stack;
                    } else {
                        var s = '';
                        if (err.fileName) {
                            s += err.fileName + ' ';
                        }
                        if (err.lineNumber) {
                            s += '[line ' + err.lineNumber + '] ';
                            scope.error.msg = s + (s ? ': ' : '') + err.message;
                        }
                    }
                    scope.error.msg = err;
                    scope.error.show = true;
                }

                scope.render = function() {
                    BWIPJS.ft_monochrome(0);

                    var bw = new BWIPJS();

                    bw.bitmap(new Bitmap());

                    var options = parseOptions(bw, scope.config.options);

                    if (scope.config.altTxt !== undefined) {
                        options.alttext = bw.value(scope.config.altTxt);
                    }

                    bw.push(scope.config.text);
                    bw.push(options);

                    bw.scale(scope.config.scale.x, scope.config.scale.y);

                    bw.call(scope.config.value, function(err) {
                        if (err) {
                            handleError(err);
                        } else {
                            scope.error.show = false;
                            bw.bitmap().show(canvas[0], 'N');
                        }
                    });
                };

                scope.$watch('config', function(newValue){
                    if(newValue !== null) { scope.render(); }
                }, true);
            }
        };
    }]);
})();