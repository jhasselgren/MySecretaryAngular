'use strict';

app.controller('ActivityController', function($scope, $sce, $location, Data){
	
	function init(){
		
//		var activity = $scope.data.activity = {};
		
		if($.isEmptyObject(Data.currentActivity)){
			$location.path('/');
			return;
		}
		
		$scope.data = Data;
		
	}
	
	$scope.$on('currentActivity.updated', function(event){
		console.log(event);
		$scope.data = Data;
		console.log($scope.data);
	});
	
	$scope.editThing = function(thing){
		var index = $scope.data.activity.things.indexOf(thing);
		
		$location.path('/activity/edit/thing/' + index)
		
	};
	
	$scope.createThing = false;
	$scope.editThing = false;
	
	$scope.startCreateThing = function(){
		$scope.createThing = true;
		$scope.editThing = false;
	};
	
	$scope.startEditThing = function(){
		$scope.createThing = false;
		$scope.editThing = true;
	};
	
	$scope.createThingCompleted = function(){
		$scope.createThing = false;
		$scope.editThing = false;
	}
	
	$scope.cancelCreateThing = function(){
		$scope.createThing = false;
		$scope.editThing = false;
	};
	
	$scope.shouldShowCreateThing = function(){
		return $scope.createThing && !$scope.editThing;
	};
	
	$scope.shouldShowEditThing = function(){
		return !$scope.createThing && $scope.editThing;
	};
	
	init();
});
