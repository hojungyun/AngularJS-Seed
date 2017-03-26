angular.module('app.about') //<-- using app.common sub module
    .controller('AboutController', function() {
        var vm = this;

        console.log('--------- AboutController ---------');
        vm.hello = 'hello world!!';

    });
