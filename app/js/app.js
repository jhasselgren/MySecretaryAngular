
'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'textAngular', 'flow']);

app.run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
});

app.config(function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			templateUrl: 'views/activity_list.html', 
			controller: 'ActivitiesListController',
			resolve:
			{ 
				app: activitiesListController.loadData
			}
		})
		.when('/activity', 
		{
			templateUrl: 'views/activity.html', 
			controller: 'ActivityController'
		})
		.when('/activity/edit/thing/:index', 
		{
			templateUrl: 'views/thing.html', 
			controller: 'ThingController'
		})
		.otherwise(
		{
			redirectTo: '/'
		});
});


