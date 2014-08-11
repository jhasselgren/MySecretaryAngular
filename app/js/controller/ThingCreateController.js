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
	
	function generateUIDNotMoreThan1million() {
	    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
	}
	
	function setup(index){
		var thingIndex = $scope.index = index;
		$scope.activity = sharedDataService.currentActivity;
		$scope.addSubThing = false;
		$scope.thing = $scope.activity.things[thingIndex]
		$scope.oldThing = angular.copy($scope.thing)
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
	
	$scope.setParmForUpload = function(){
		return {target: 'http://localhost:8080/file/upload', singleFile:true, testChunks:false, query:{fileName: $scope.fileId}};
	}
	
	$scope.fileAdded =  function (event, file, $flow) {
		file.flowObj.opts.query.fileName = $scope.fileId
	};
	
	
	$scope.startCreateNewThing = function(){
		$scope.addSubThing = true;
		$scope.newThing = {};
		$scope.fileId = generateUIDNotMoreThan1million();
		$location.hash('AddSubThing');
		$anchorScroll();
	}
	
	$scope.fileUploaded = function($file, $message){
		$scope.newThing.fileId = $scope.fileId;
		$scope.newThing.name = $file.name;
		$scope.newThing.fileType = $file.file.type;
		$scope.saveNewThing();
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
				$scope.thing = $scope.activity.things[$scope.index]
			});
		
		$scope.newThing = {};
		$scope.addSubThing = false;
	}
	
	init();
	
});