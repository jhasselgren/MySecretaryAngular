'use strict';

/* Services */
app.value('version', '0.1');

app.value("backEndAdress","http://192.168.50.5:8080");

app.factory("Data", function() {
	
	this.currentActivity = {};
	this.currentThing = {},
	this.allActivities = {}
	
	return this;
	
//	sharedDataService.currentActivity = {};
//	sharedDataService.currentThing = {};
//	sharedDataService.allActivities = {};
	
//	sharedDataService.setCurrentActivity = function(newObj){
//		this.currentActivity = newObj;
//	};
//	
//	sharedDataService.setAllActivities = function(newObj){
//		this.currentThing = newObj;
//	};
//	
//	sharedDataService.setCurrentThing = function(newObj){
//		this.allActivities = newObj;
//	};
	
//	return sharedDataService;
});


app.factory('activityDataService', function($http, backEndAdress){
	var activityDataService = {};
	
	activityDataService.getById = function(id){
		return $http.get(backEndAdress+ "/activity/" +id);
	};
	
	activityDataService.getAll = function(){
		return $http.get(backEndAdress+ "/activity/all");
	};
	
	activityDataService.create = function(activity){
		return $http.post(backEndAdress+ "/activity/", activity);
	};
	
	activityDataService.update = function(activity){
		return $http.put(backEndAdress+ "/activity/", activity);
	};
	
	activityDataService.remove = function(activity){
		return $http.delete(backEndAdress+ "/activity/" + activity.id);
	};
	
	activityDataService.addSubThing = function(activityId, thingId, subThing){
		return $http.post(backEndAdress+ '/activity/'+activityId+'/'+thingId, subThing);
	};
	
	return activityDataService;
});

