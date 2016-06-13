(function(){
	var app = angular.module("Demo",[]);
	
	app.controller("SomeController",["$scope",function($scope){
		$scope.title = "点击展开";
		$scope.text = "展开显示的内容展开显示的内容展开显示的内容";
	}]);


	app.directive("accordion",function(){
		return {
			restrict:"AE",
			replace:true,
			transclude:true,
			template:'<div ng-transclude></div>',
			controller:function(){
				var expanders = [];
				this.gotOpened = function(selectedExpander){
					angular.forEach(expanders,function(){
						if(selectedExpander != expander){
							expander.showMe = false;
						}
					});
				}
			}
		}
	});

	app.directive("expander",function(){
		return {
			restrict:"EA",
			replace:true,
			transclude:true,
			require:"^?accordion",
			scope:{
				title:"=expanderTitle"
			},
			template:'<div>'
					+'<div class="title" ng-click="toggle()">{{title}}</div>'
					+'<div class="body" ng-show="showMe" ng-transclude></div>'
					+'</div>',
			link:function(scope,element,attrs){
				scope.showMe = false;
				scope.toggle = function(){
					scope.showMe = !scope.showMe;
				};
			}
		};
	});
	app.controller("MainController",["$scope",function($scope){

	}]);
	app.directive("myDirective",function(){
		return {
			restrict:"A",
			transclude:true,
			// scope:true,
			priority:100,
			template:"<div>inside myDirective template {{myProperty}}</div><div ng-transclude></div>"
		}
	});
	app.controller("loadDataCtrl",["$scope","$http",function($scope,$http){
		$scope.users = [
		{
			name:"小明"
		},{
			name:"小红"
		},{
			name:"小强"
		},{
			name:"小美"
		},{
			name:"小丽"
		},{
			name:"小何"
		}];
	}];
	// $http({
	// 	method:"GET",
	// 	url:"data.json"
	// }).success(function(data,status,headers,config){
	// 	console.log(success...);
	// 	console.log(data);
	// 	$scope.users = data;
	// }).error(function(data,status,headers,config){
	// 	console.log("error...");
	// });
	);
	app.factory("userListService",["$http",function($http){
		var doRequest = function(uesername,path){
			return $http({
				method:"GET",
				url:"users.json"
			});
		}
		return {
			userList:function(username){
				return doRequest(username,"userList");
			};
		}
	}]);
	app.controller("ServiceController",["$scope","$timeout","userListService",
		function($scope,$timeout,userListService){
			var timeout;
			$scope.$watch("username",function(newUserName){
				if(newUserName){
					if(timeout){
						$timeout.cancel(timeout);
					}
					timeout = $timeout(function(){
						userListService.userList(newUserName)
						.success(function(data,status){
							$scope.users = data;
						});
					},350);
				}
			});
	}]);
})()