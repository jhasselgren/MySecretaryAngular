'use strict';

/* Services */
app.value('version', '0.1');

app.value("backEndAdress","http://localhost:8080");

app.factory("Data", function($rootScope, activityDataService) {
	
	var service = {
			currentActivity: {},
			currentThing: {},
			allActivities: {},
			
			setCurrentActivity: function (activity){
				this.currentActivity = activity;
				
				$rootScope.$broadcast('currentActivity.updated')
			},
			
			addThing: function(thing){
				this.currentActivity.things.push(thing);
			},
			
			saveActivity: function(){
				return activityDataService.update(this.currentActivity);
			},
			
			setCurrentThing: function (thing){
				this.currentThing = thing;
				
				$rootScope.$broadcast('currentThing.updated')
			},
			
			addSubThing: function(subthing){
				this.currentThing.thins.push(subthing);
				$rootScope.$broadcast('currentThing.updated')
			},
			
			setAllActivities: function (activitiesList){
				this.allActivities = activitiesList;
				
				$rootScope.$broadcast('allActivities.updated')
			}
	}
	
	return service;
	
//	sharedDataService.currentActivity = {};
//	sharedDataService.currentThing = {};
//	sharedDataService.allActivities = {};
	
//	sharedDataService.setCurrentActivity = function(newObj){
//		this.currentActivity = newObj;
//	};
//	
//	sharedDataService.setAllActivities = function(newObj){
//		this.currentThing = newObj;
//	};
//	
//	sharedDataService.setCurrentThing = function(newObj){
//		this.allActivities = newObj;
//	};
	
//	return sharedDataService;
});


app.factory('activityDataService', function($http, backEndAdress){
	var activityDataService = {};
	
	activityDataService.getById = function(id){
		return $http.get(backEndAdress+ "/activity/" +id);
	};
	
	activityDataService.getAll = function(){
		return $http.get(backEndAdress+ "/activity/all");
	};
	
	activityDataService.create = function(activity){
		return $http.post(backEndAdress+ "/activity/", activity);
	};
	
	activityDataService.update = function(activity){
		return $http.put(backEndAdress+ "/activity/", activity);
	};
	
	activityDataService.remove = function(activity){
		return $http.delete(backEndAdress+ "/activity/" + activity.id);
	};
	
	activityDataService.addSubThing = function(activityId, thingId, subThing){
		return $http.post(backEndAdress+ '/activity/'+activityId+'/'+thingId, subThing);
	};
	
	return activityDataService;
});


app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});


