'use strict';

app.controller('ActivityController', function($scope, $sce, $location, $interval, $timeout, Data){
	
	var interval;
	
	function init(){
		
//		var activity = $scope.data.activity = {};
		
		$scope.modified = false;
		
		$scope.save = function(){
			Data.saveActivity().success(function(){
				$scope.modified = false;
			});
		}
		
		if($.isEmptyObject(Data.currentActivity)){
			$location.path('/');
			return;
		}
		
		$scope.data = Data;
		
		if(interval){
			$interval.cancel(interval)
		}
		
		interval = $interval(function(){
			if($scope.modified){
				console.log("Scope modified");
				Data.saveActivity().success(function(){
					$scope.modified = false;
				});
			}
			else{
				console.log("Scope not modified");
			}
		}, 60000);
		
	}
	
	var timeout = null;
	
	
	$scope.$watch('data.currentActivity.description', function(newVal, oldVal){
		if(newVal != oldVal){
		
			if(timeout){
				$timeout.cancel(timeout);
			}
			
			timeout = $timeout(function(){
				console.log("data.currentActivity.description changed");
				$scope.modified = true;
				console.log("modified = true");
			},1000);
		};
	});
	
	$scope.$watch('data.currentActivity.shortDescription', function(newVal, oldVal){
		if(newVal != oldVal){
			if(timeout){
				$timeout.cancel(timeout);
			}
			
			timeout = $timeout(function(){
				console.log("data.currentActivity.shortDescription changed");
				$scope.modified = true;
				console.log("modified = true");
			},1000);
		};
	});
	
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
	};
	
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