(function () {
    'use strict';

    var mod = angular.module('barcode.example', [
        'ui.bootstrap',
        'tdd.barcode'
    ]);

    mod.controller('BarcodeExampleController', ['BarcodeTypes', function(BarcodeTypes) {
        var vm = this;

        vm.data = {
            types : BarcodeTypes,
            selection : BarcodeTypes[0]
        };
    }]);

    mod.value('BarcodeTypes', [
        { name : 'Aztec', value : 'azteccode', text : 'This is Aztec Code', altText : '', scale : { x : 2, y : 2 }, options : 'format=full'},
        { name : 'Interleaved 2 of 5 (ITF)', value : 'interleaved2of5', text : '2401234567', altText : '', scale : { x : 2, y : 2 }, options : 'height=0.5 includecheck includetext includecheckintext'},
        { name : 'EAN-13', value : 'ean13', text : '2112345678900', altText : '', scale : { x : 2, y : 2 }, options : 'includetext guardwhitespace'},
        { name : 'Code 128', value : 'code128', text : 'Count01234567^FNC2!', altText : '', scale : { x : 2, y : 2 }, options : 'includetext parsefnc'},
        { name : 'QR', value : 'qrcode', text : 'This is QR Code', altText : '', scale : { x : 2, y : 2 }, options : 'eclevel=M'}
    ]);
})();