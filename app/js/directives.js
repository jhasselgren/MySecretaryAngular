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

app.directive("thing",function(Data, backEndAdress) {
	
	return {
		restrict: 'E',
		scope: {
			showcreate: '&',
			showedit: '&',
			completed: '&',
			hide: '&'
				
		},
		templateUrl: 'views/thing_create.html',
		link: function(scope, element, attrs){
			
			scope.newThing = {};
			scope.fileId = generateUIDNotMoreThan1million();
			
			function generateUIDNotMoreThan1million() {
			    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
			}
			
			scope.setParmForUpload = function(){
				return {target: backEndAdress+'/file/upload', singleFile:true, testChunks:false, query:{fileName: scope.fileId}};
			}
			
			scope.fileAdded =  function (event, file, $flow) {
				file.flowObj.opts.query.fileName = scope.fileId
			};
			
			scope.fileUploaded = function($file, $message){
				scope.newThing.fileId = scope.fileId;
				scope.newThing.name = $file.name;
				scope.newThing.fileType = $file.file.type;
				
				scope.createThing(scope.newThing);
			}
			
			scope.createThing = function(newThing){
				var thing = angular.copy(newThing);
				
				Data.addThing(thing);
				
				Data.saveActivity()
				.success(function(data){
					Data.setCurrentActivity(data);
					scope.completed();
					scope.newThing = {};
				});
			};
			
			scope.cancel = function(){
				scope.newThing = {};
				scope.hide();
			};
			
			scope.toggleMin = function() {
				scope.minDate = scope.minDate ? null : new Date();
			};
			 
			scope.toggleMin();
			
			scope.createSubThing = function(newThing){
				console.log("create subthing:");
				console.log(newThing);
			};
			
			scope.editThing = function(newThing){
				console.log("edit thing: ");
				console.log(newThing);
			};
		}
	}
});

app.directive("thingFile",function(Data, backEndAdress, activityDataService){
	return{
		restrict: "E",
		scope: {
			thing : "=",
		},
		templateUrl: "views/directive/thing_file.html",
		link: function(scope, element, attrs){
			
			scope.controll = {edit: false};
			
			scope.filePath = function(fileId){
				
				var activityId = Data.currentActivity.id;
				return backEndAdress + '/file/download/'+activityId+'/'+fileId;
			};
			
			scope.changeEdit = function(){
				scope.controll.edit = !scope.controll.edit
			};
			
			scope.editMode = function(){
				return scope.controll.edit;
			};
			
			scope.save = function(){
				Data.saveActivity().success(function(data){
					scope.controll.edit = false;
				});
			};
			
			scope.deleteThing = function(thing){
				
				var activityId = Data.currentActivity.id;
				
				activityDataService.deleteThing(activityId,thing).success(function(data){
					Data.setCurrentActivity(data);
				});
			}
			
			scope.cancel = function(){
				scope.controll.edit = false;
			};
		}
	}
});