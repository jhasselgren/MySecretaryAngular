'use strict';

app.controller('ActivityController', function($scope, $sce, $location, $interval, $timeout, Data){
	
	var interval;
	
	window.onbeforeunload = function (event) {
		if($scope.modified){
			var message = 'Sure you want to leave?';
			if (typeof event == 'undefined') {
				event = window.event;
			}
			if (event) {
				event.returnValue = message;
			}
			return message;
		}
	};
	
	$scope.$on('$locationChangeStart', function (event, next, current) {
		if($scope.modified){
	        event.preventDefault();
	        var answer = confirm("Are you sure you want to leave this page?")
	        if (answer) {
	            $location.url($location.url(next).hash());
	            $rootScope.$apply();
	        }
		}
    });
	
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
		}, 30000);
		
	}
	
	var timeout = null;
	
	
	$scope.$watch('data.currentActivity', function(newVal, oldVal){
		if(newVal != oldVal){
		
			if(timeout){
				$timeout.cancel(timeout);
			}
			
			timeout = $timeout(function(){
				console.log("data.currentActivity changed");
				$scope.modified = true;
				console.log("modified = true");
			},1000);
		};
	}, true);
	
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