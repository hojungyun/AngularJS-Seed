angular.module('app.home')
    .controller('HomeController', function() {
        var vm = this;

        console.log('--------- HomeController ---------');
        vm.hello = 'hello world!!';

    });
