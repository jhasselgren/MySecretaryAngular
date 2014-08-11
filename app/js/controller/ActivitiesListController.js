/**
 * 
 */


'use strict';

var activitiesListController = app.controller('ActivitiesListController', function($q, $scope, $route, $sce, $location, activityDataService, Data){

	console.log($route);
	
	function init(){
		$scope.data = Data;
	};
	
	$scope.$on('allActivities.updated', function(event){
		$scope.data.allActivities = Data.allActivities;
	});
	
	$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash(eID);
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
      
    };
	
	$scope.chooseActivity = function(activity){
		$scope.data.currentActivity = activity;
		$location.path('/activity');
	};
	
	$scope.createActivity = function(newActivity){
		activityDataService.create(newActivity).success(function(data){
			$scope.data.allActivities.push(data);
			$scope.newActivity = {};
		});
	};
	
	
	$scope.cancelCreateActivity = function(newActivity){
		$scope.newActivity = {};
	};
	
	$scope.updateActivity = function(activity){
		activityDataService.update(activity).success(function(data){
			activity = data;
			alert('Activity ' + activity.name + ' is updated');
		});
	}
	
	$scope.deleteActivity = function(activity){
		activityDataService.remove(activity).success(function(data){
			var index = $scope.data.allActivities.indexOf(activity)
			if(index > -1){
				$scope.data.allActivities.splice(index, 1);
				alert('Activity ' + activity.name + ' is deleted');
			}
		});
	}

	init();
	
});

activitiesListController.loadData = function($q, activityDataService, Data)
{
	console.log('activityDataService:')
	console.log(activityDataService);
	console.log('sharedDataService')
	console.log(Data);
	var defer = $q.defer();
	
	activityDataService.getAll()
		.success(function(msg, status)
		{
			Data.setAllActivities(msg);
			defer.resolve(status);
		})
		.error(function(msg, status){
			defer.reject(status);
		});
		
	return defer.promise;
}