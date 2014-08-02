//$(document).ready(function() {
//    
//    /* smooth scrolling for scroll to top */
//	$('.scroll-top').click(function(){
//	  $('body,html').animate({scrollTop:0},1000);
//	})
//	
//	/* smooth scrolling for scroll down */
//	$('.scroll-down').click(function(){
//	  $('body,html').animate({scrollTop:$(window).scrollTop()+800},1000);
//	})
//
//	/* highlight the top nav as scrolling occurs */
//	$('body').scrollspy({ target: '#navbar' })
//});

'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'textAngular', 'flow']);

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


