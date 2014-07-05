'use strict';

/* Services */
app.value('version', '0.1');

app.value("backEndAdress","http://localhost:8080");

app.factory("sharedDataService", function() {
	
	var sharedDataService = {};
	sharedDataService.currentActivity = {};
	
	
	sharedDataService.setCurrentActivity = function(newObj){
		this.currentActivity = newObj;
	};
	
	return sharedDataService;
});

app.factory('activityDataService', function($http, backEndAdress){
	var activityDataService = {};
	
	activityDataService.getById = function(id){
		return $http.get(backEndAdress+ "/activity/" +id);
	};
	
	return activityDataService;
});