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
})()