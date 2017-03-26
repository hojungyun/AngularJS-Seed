angular.module('app.common') //<-- using app.common sub module
    .controller('CommonController', function() {
        var vm = this;

        console.log('--------- CommonController ---------');
        vm.hello = 'hello world!!';

    });
