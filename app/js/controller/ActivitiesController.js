'use strict';

app.controller('ActivityController', function($scope, $sce, $location, activityDataService, sharedDataService){
	
	function init(){
		
		var activity = $scope.activity = {};
		
		if($.isEmptyObject(sharedDataService.currentActivity)){
			activityDataService.getById('test')
			.success(function(data){
				$scope.activity = data;
				
				sharedDataService.setCurrentActivity($scope.activity);
				
			});	
		}
		else{
			$scope.activity = sharedDataService.currentActivity;
		}
	}
	
	$scope.editThing = function(thing){
		var index = $scope.activity.things.indexOf(thing);
		
		$location.path('/activity/edit/thing/' + index)
		
	};
	
	init();
});
