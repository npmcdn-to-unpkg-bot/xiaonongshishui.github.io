// function HelloAngular($scope){
// 	$scope.greeting = {
// 		text:'Hello'
// 	};
// }
var myModule = angular.module("HelloAngular",[]);

myModule.controller("helloAngular",['$scope',
	function HelloAngular($scope){
		$scope.greeting = {
			text:'你好'
		};
	}]);


myModule.controller("firstController",["$scope",function($scope){
		$scope.iphone ={
			money:5,
			num:1,
			fre:10
		};
		$scope.sum = function(){
			console.log(1);
			return $scope.iphone.money * $scope.iphone.num;
		}
	}]);
myModule.controller("EventController",["$scope",function($scope){
	$scope.count = 0;
		$scope.$on('MyEvent',function(){
			$scope.count++;
		});
}]);
myModule.directive("hello",function(){
	return {
		restrict: "EA",
		transclude:true,
		template:"<div>外部的文字 <div ng-transclude></div> 这也是外部的文字</div>"
		// templateUrl:"hello.html"
	};
});
myModule.controller("MyCtrl",["$scope",function($scope){
	$scope.loadDate = function(){
		var ele = document.createElement("div");
		ele.innerHTML = "数据加载中...";
		document.getElementsByTagName('body')[0].appendChild(ele);
	};
	$scope.flavor = "我喜欢喝鸡尾酒！！！";
}]);
myModule.directive("loader",function(){
	return {
		restrict:"E",
		link:function(scope,element,attr){
			element.bind("mouseenter",function(){
				//scope.loadDate();
				scope.$apply("loadDate()");
			});
		}
	};
});
myModule.directive("drink",function(){
	return {
		restrict:"E",
		template:"{{flavor}}",
		scope:{
			flavor:"=flavoraaa"
		}
		// ,
		// link:function(scope,element,attrs){
		// 		scope.flavor = attrs.flavoraaa;
		// 	}
		};
});



myModule.directive("superman",function(){
	return {
		scope:{},
		restrict:"AE",
		controller:function($scope){
			$scope.abilities=[];
			this.addStrength = function(){
				console.log(this);
				console.log($scope);
				$scope.abilities.push("strength");
			};
			this.addSpeed = function(){
				console.log(this);
				$scope.abilities.push("speed");
			};
			this.addLight = function(){
				console.log(this);
				$scope.abilities.push("light");
			};
		},
		link:function(scope,element,attr){
			element.bind("mouseenter",function(){
				var ele = document.createElement("div");
				ele.innerHTML = scope.abilities;
				document.getElementsByTagName('body')[0].appendChild(ele);
			});
		}
	};
});
myModule.directive("strength",function(){
	return {
		require:'^superman',
		link:function(scope,element,attr,supermanCtrl){
			supermanCtrl.addStrength();
		}
	};
});
myModule.directive("speed",function(){
	return {
		require:'^superman',
		link:function(scope,element,attr,supermanCtrl){
			supermanCtrl.addSpeed();
		}
	};
});
myModule.directive("light",function(){
	return {
		require:'^superman',
		link:function(scope,element,attr,supermanCtrl){
			supermanCtrl.addLight();
		}
	};
});
myModule.controller("TestFormModule",["$scope",function($scope){
	$scope.user = {
		userName:"helurong",
		password:"123456"
	};
	$scope.save = function(){
		
		alert("保存数据！");
	};
}]);