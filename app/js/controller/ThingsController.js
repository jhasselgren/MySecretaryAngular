'use strict';

app.controller('ThingController', function($scope, $sce, $routeParams, $location, $anchorScroll, activityDataService, sharedDataService){
	function init(){
		
		if($.isEmptyObject(sharedDataService.currentActivity)){
			activityDataService.getById('test')
			.success(function(data){
				$scope.activity = data;
				
				sharedDataService.setCurrentActivity($scope.activity);
				setup($routeParams.index)
			});	
		}
		else{
			setup($routeParams.index)
		}
	}
	
	function setup(index){
		var thingIndex = $scope.index = index;
		$scope.activity = sharedDataService.currentActivity;
		$scope.addSubThing = false;
		$scope.thing = $scope.activity.things[thingIndex]
		$scope.oldThing = angular.copy($scope.thing)
	}
	
	$scope.uploadData = {};

	$scope.onUpload = function(){
		$scope.uploadData.description = $scope.newThing.description;
	}
	
	$scope.fileSaved = function(response){
		$scope.thing.things.push(response);
		$scope.newThing = {};
		$scope.addSubThing = false;
	}
	
	$scope.deleteSubThing = function(subThing){
		var index = $scope.thing.things.indexOf(subThing);
		
		if(index > -1){
			$scope.thing.things.splice(index, 1);
		}
		
	}
	
	$scope.cancel = function(){
		
		sharedDataService.currentActivity.things[$scope.index] = angular.copy($scope.oldThing)
		$location.path('/activity')
	}
	
	$scope.startCreateNewThing = function(){
		$location.hash('AddSubThing');
		$anchorScroll();
		
		$scope.addSubThing = true;
		$scope.newThing = {};
	}
	
	$scope.cancelCreateNewSubThing = function(){
		$scope.addSubThing = false;
		$scope.newThing = {};
	}
	
	$scope.saveNewThing = function(){		
		activityDataService.addSubThing($scope.activity.id, $scope.thing.id, $scope.newThing)
			.success(function(data){
				$scope.activity = data;
				sharedDataService.setCurrentActivity($scope.activity);
			});
		
		$scope.newThing = {};
		$scope.addSubThing = false;
	}
	
	init();
	
});