'use strict';

app.controller('ActivityController', function($scope,$sce, activityDataService){
	
	function init(){
		
		var activity = $scope.activity = {};
		
		activityDataService.getById('test')
		.success(function(data){
			$scope.activity = data;
		});	
	}
	
	init();
});
