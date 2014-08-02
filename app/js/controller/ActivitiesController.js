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
	
	$scope.editThing = function(thing){
		var index = $scope.data.activity.things.indexOf(thing);
		
		$location.path('/activity/edit/thing/' + index)
		
	};
	
	init();
});
