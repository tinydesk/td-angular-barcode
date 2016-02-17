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

                function parseError(err) {
                    var msg = null;

                    if (typeof err === 'string') {
                        msg = err;
                    } else if (err.stack) {
                        msg = err.message + ' ' + err.stack;
                    } else {
                        var s = '';
                        if (err.fileName) { s += err.fileName + ' '; }

                        if (err.lineNumber) {
                            s += '[line ' + err.lineNumber + '] ';
                            msg = s + (s ? ': ' : '') + err.message;
                        }
                    }

                    return msg;
                }

                scope.render = function() {
                    BWIPJS.ft_monochrome(0);

                    var bw = new BWIPJS();

                    bw.bitmap(new Bitmap());

                    var options = parseOptions(bw, scope.config.options);

                    if (scope.config.altText !== undefined) {
                        options.alttext = bw.value(scope.config.altText);
                    }

                    bw.push(scope.config.text);
                    bw.push(options);

                    bw.scale(scope.config.scale.x, scope.config.scale.y);

                    bw.call(scope.config.value, function(err) {
                        if (err) {
                            scope.error.msg = parseError(err);;
                            scope.error.show = true;
                        } else {
                            scope.error.show = false;
                            scope.error.msg = null;
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