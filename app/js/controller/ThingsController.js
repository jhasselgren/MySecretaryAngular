'use strict';

app.controller('ThingController', function($scope,$sce,$routeParams, activityDataService, sharedDataService){
	function init(){
		var thingIndex = $routeParams.index;
		
		 $scope.thing = sharedDataService.currentActivity.things[thingIndex]
	}
	
	
	init();
	
});