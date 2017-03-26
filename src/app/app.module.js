var myModule = angular.module('app', [
    'ngAnimate',
    'ui.router',
    'cgNotify',
    'angularUtils.directives.dirPagination',
    'nvd3',
    'ngCountUp',
    'angular.filter',
    'ngMessages',
    'mgcrea.ngStrap',
    'ngBootbox',
    'checklist-model',
    'angularMoment',
    'ion.rangeslider',
    'dndLists',
    'ngCookies',
    'ui.select',

    'app.common',
    'app.home',
    'app.about'
]);

myModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/'); //<-- URL을 설정

    /*
     * [참고]
     * - 파일을 새로 생성한 경우 gulp 실행 (gulp watch는 기존의 파일의 변경을 감지하나 새로 생성된 파일은 제외)
     */

    $stateProvider

        .state('home', {
            url: '/',
            controller: 'HomeController',
            controllerAs: 'vm',
            templateUrl: 'app/modules/home/tmpl/home.html'
        })

        .state('multi-menus', {
            url: '/multi-menus',
            abstract: true,
            template: '<ui-view/>' //<-- 여기서 직접 ui-view 작성
        })
        .state('multi-menus.sub-menu1', {
            url: '/sub-menu1', //<-- 전체 URL은 '/multi-menus/sub-menu1'
            templateUrl: 'app/modules/multi-menus/sub-menu1/tmpl/sub-menu1.html'
        })
        .state('multi-menus.sub-menu2', {
            url: '/sub-menu2',
            templateUrl: 'app/modules/multi-menus/sub-menu2/tmpl/sub-menu2.html'
        })

        .state('about', {
            url: '/about',
            controller: 'AboutController',
            controllerAs: 'vm',
            templateUrl: 'app/modules/about/tmpl/about.html'
        });
});