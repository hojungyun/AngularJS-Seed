angular.module('app.common') //<-- using app.common sub module
    .controller('CommonController', function() {
        var vm = this;

        vm.hello = 'hello world!!';

    });
