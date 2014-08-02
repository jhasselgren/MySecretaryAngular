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