'use strict';

/* Directives */


app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);



app.directive("formInput", function () {
    return {
    	scope: {
    		type: "@",
    		label: "@",
    		model: "="
    	},
    	
    	template: 
    		'<div class="form-group">\
				<label>{{label}}</label>\
				<input type="{{type}}" class="form-control" ng-model="model" />\
			</div>'
    	
    };
});

app.directive("formTextarea", function () {
    return {
    	scope: {
    		label: "@",
    		rows: "@",
    		model: "="
    	},
    	
    	template: 
    		'<div class="form-group">\
				<label>{{label}}</label>\
				<textarea rows="{{rows}}" class="form-control" ng-model="model" />\
			</div>'
    	
    };
});

app.directive("thing",function() {
	
	return {
		restrict: 'E',
		scope: {
			showcreate: '&',
			showedit: '&',
			cancel: '&'
				
		},
		templateUrl: 'views/thing_create.html',
		controller: function($scope){
			
			$scope.newThing = {};
			
			
			this.createThing = function(newThing){
				console.log("create thing:" + newThing);
			};
			
			this.createSubThing = function(newThing){
				console.log("create subthing:" + newThing);
			};
			
			this.editThing = function(newThing){
				console.log("edit thing: " + newThing);
			};
			
			
		}
	}
	
});

app.directive("save",function(){
	return {
		require: "thing",
		link: function(scope, element, attrs, thingCtrl){
			scope.save = function(newThing){
				thingCtrl.createThing(newThing);
			}
		}
	}
});