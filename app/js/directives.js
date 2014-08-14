'use strict';

/* Directives */


app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);


app.directive('scrollToBookmark', function() {
    return {
      link: function(scope, element, attrs) {
        var value = attrs.scrollToBookmark;
        element.click(function() {
          scope.$apply(function() {
            var selector = "[scroll-bookmark='"+ value +"']";
            var element = $(selector);
            if(element.length)
              window.scrollTo(0, element[0].offsetTop - 100);  // Don't want the top to be the exact element, -100 will go to the top for a little bit more
          });
        });
      }
    }
});


app.directive("formInput", function () {
    return {
    	restrict: "E",
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

app.directive("thingCreate",function(Data, backEndAdress) {
	
	return {
		restrict: 'E',
		scope: {
			showcreate: '&',
			completed: '&',
			hide: '&'
				
		},
		templateUrl: 'views/directive/thing_create.html',
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
			
			
			/*
			 * 
			 * Hantering av subThings
			 * 
			 */
			
			scope.addSubFile = false;
			scope.addSubToDo = false;
			
			scope.prepAddingNewSubthingFile = function(){
				
				scope.addSubFile = true;
				scope.addSubToDo = false;
				
				if(scope.newThing.things == undefined){
					scope.newThing.things = [];
				}
				
				scope.newSubthing = 
					{ 
						fileId: generateUIDNotMoreThan1million(), 
						type: "FILE",
						
					};
			};
			
			scope.setParmForSubThingFileUpload = function(){
				return {target: backEndAdress+'/file/upload', singleFile:true, testChunks:false};
			}
			
			scope.subThingFileAdded =  function (event, file, $flow) {
				file.flowObj.opts.query.fileName = scope.newSubthing.fileId;
			};
			
			scope.subThingFileUploaded = function($file, $message){
				scope.newSubthing.name = $file.name;
				scope.newSubthing.fileType = $file.file.type;
				
				var subthing = angular.copy(scope.newSubthing);
				
				scope.newThing.things.push(subthing);
			};
		}
	}
});

app.directive("ngThingFile",function(Data, backEndAdress, activityDataService){
	return{
		restrict: "E",
		scope:{
			thing: "=",
			useclass: "@", 
		},	
		templateUrl: "views/directive/thing_file.html",
		controller: function($rootScope, $scope){
			
			this.activityId = Data.currentActivity.id;
			this.backEndAdress = backEndAdress;
			
			this.save = function(){
				return Data.saveActivity();
			};
			
			this.deleteThing = function(thing){
				
				var activityId = Data.currentActivity.id;
				
				activityDataService.deleteThing(activityId,thing).success(function(data){
					Data.setCurrentActivity(data);
				});
			};
		},
		link: function(scope, element, attrs, thingController){
			scope.controll = {edit: false};
			scope.filePath = function(fileId){
				var activityId = thingController.activityId;
				var backEndAdress = thingController.backEndAdress;
				if(fileId && activityId){
					return backEndAdress + '/file/download/'+activityId+'/'+fileId;
				}
				
				return "";
			};
			
			scope.changeEdit = function(){
				scope.controll.edit = !scope.controll.edit
			};
			
			scope.editMode = function(){
				return scope.controll.edit;
			};
			
			scope.save = function(){
				thingController.save().success(function(data){
					scope.controll.edit = false;
				});
			}
			
			scope.deleteThing = function(thing){
				thingController.deleteThing(thing);
			}
			
			scope.cancel = function(){
				scope.controll.edit = false;
			};
			
		}
	}
});

app.directive("ngThingText", function(Data, backEndAdress, activityDataService){
	return{
		restrict: "E",
		scope:{
			thing: "=",
			useclass: "@",
		},
		templateUrl: "views/directive/thing_text.html",
		controller: function($rootScope, $scope){
			
			this.activityId = Data.currentActivity.id;
			this.backEndAdress = backEndAdress;
			
			this.save = function(){
				return Data.saveActivity();
			};
			
			this.deleteThing = function(thing){
				
				var activityId = Data.currentActivity.id;
				
				activityDataService.deleteThing(activityId,thing).success(function(data){
					Data.setCurrentActivity(data);
				});
			};
			
			
			function groupSubthings(){
		        var itemsPerRow = 3;
		        var input = $scope.thing.things;
	        	
		        var out = [];
		        for (var i = 0; i < input.length; i++) {
		          var rowElementIndex = i % itemsPerRow;
		          var rowIndex = (i - rowElementIndex) / itemsPerRow;
		          var row;
		          if (rowElementIndex === 0) {
		            row = [];
		            out[rowIndex] = row;
		          } else {
		            row = out[rowIndex];
		          }
		          
		          row[rowElementIndex] = input[i];
		        }
		          
		        return out;
		      };
			
			
			$scope.grouped = groupSubthings();
			
		},
		link: function(scope, element, attrs, thingController){
			
			scope.controll = {edit: false};
						
			scope.deleteThing = function(thing){
				thingController.deleteThing(thing);
			}
			
			scope.changeEdit = function(){
				scope.controll.edit = !scope.controll.edit
			};
			
			scope.editMode = function(){
				return scope.controll.edit;
			};
			
			scope.save = function(){
				thingController.save().success(function(data){
					scope.controll.edit = false;
				});
			}
			
			scope.deleteThing = function(thing){
				thingController.deleteThing(thing);
			}
			
			scope.cancel = function(){
				scope.controll.edit = false;
			};
			
			scope.filePath = function(fileId){
				var activityId = thingController.activityId;
				if(fileId && activityId){
					return backEndAdress + '/file/download/'+activityId+'/'+fileId;
				}
				
				return "";
			};
			
			/*
			 * 
			 * Hantering av subThings
			 * 
			 */
			
						
			scope.addSubFile = false;
			scope.addSubToDo = false;
			
			scope.showAddSubToDo = function(){
				return scope.addSubToDo;
			};
			
			scope.showAddSubFile = function(){
				return scope.addSubFile;
			}
			
			scope.closeAddSubthing = function(){
				scope.addSubFile = false;
				scope.addSubToDo = false;
			}
			
			scope.showShubThings = function(){
				return !scope.addSubFile && !scope.addSubToDo;
			};
			
			scope.prepAddingNewSubthingToDo = function(){
				scope.addSubFile = false;
				scope.addSubToDo = true;
				
				if(scope.thing.things == undefined){
					scope.thing.things = [];
				}
				
				scope.newSubthing = 
				{ 
					type: "TODO",
					
				};
				
			}
			
			scope.prepAddingNewSubthingFile = function(){
				
				scope.addSubFile = true;
				scope.addSubToDo = false;
				
				if(scope.thing.things == undefined){
					scope.thing.things = [];
				}
				
				scope.newSubthing = 
					{ 
						fileId: generateUIDNotMoreThan1million(), 
						type: "FILE",
						
					};
			};
			
			function generateUIDNotMoreThan1million() {
			    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
			};
			
			scope.setParmForSubThingFileUpload = function(){
				return {target: backEndAdress+'/file/upload', singleFile:true, testChunks:false};
			}
			
			scope.subThingFileAdded =  function (event, file, $flow) {
				file.flowObj.opts.query.fileName = scope.newSubthing.fileId;
			};
			
			scope.subThingFileUploaded = function($file, $message){
				scope.newSubthing.name = $file.name;
				scope.newSubthing.fileType = $file.file.type;
				
				var subthing = angular.copy(scope.newSubthing);
				
				scope.thing.things.push(subthing);
				
				scope.addSubFile = false;
				scope.addSubToDo = false;
				
			};
			
			scope.creteaSubthingTodo = function(newSubthing){
				var subthing = angular.copy(newSubthing);
				scope.thing.things.push(subthing);
				
				scope.addSubFile = false;
				scope.addSubToDo = false;
			};
			
			scope.opened = false;
			
			scope.open = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();
	
			    scope.opened = true;
			};
			
			scope.toggleMin = function() {
				scope.minDate = scope.minDate ? null : new Date();
			};
			 
			scope.toggleMin();
			
			
			
			
		}
	}
});

app.directive("thingTodo", function(Data, activityDataService){
	return{
		restrict: "E",
		scope:{
			thing: "=",
			useclass: "@", 
		},	
		templateUrl: "views/directive/thing_todo.html",
		controller: function($rootScope, $scope){
			
			this.activityId = Data.currentActivity.id;
			
			this.save = function(){
				return Data.saveActivity();
			};
			
			this.deleteThing = function(thing){
				
				var activityId = Data.currentActivity.id;
				
				activityDataService.deleteThing(activityId,thing).success(function(data){
					Data.setCurrentActivity(data);
				});
			};
		},
		link: function(scope, element, attrs, thingController){
			scope.controll = {edit: false};
			
			scope.changeEdit = function(){
				scope.controll.edit = !scope.controll.edit
			};
			
			scope.editMode = function(){
				return scope.controll.edit;
			};
			
			scope.save = function(){
				thingController.save().success(function(data){
					scope.controll.edit = false;
				});
			};
			
			scope.deleteThing = function(thing){
				thingController.deleteThing(thing);
			};
			
			scope.cancel = function(){
				scope.controll.edit = false;
			};
			
			scope.toggleMin = function() {
				scope.minDate = scope.minDate ? null : new Date();
			};
			 
			scope.toggleMin();
			
			scope.opened = false;
			
			scope.open = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();
	
			    scope.opened = true;
			};
			
		}
	}
});

//app.directive("thingText",directiveFactory)