(function(){
	angular.module("myApp",[]).run(function($rootScope){
		$rootScope.rootProperty = "root scope";
	}).
	controller("ParentController",["$scope",function($scope){
		$scope.parentProperty = "parent scope";
	}]).
	controller("ChildController",["$scope",function($scope){
		$scope.childProperty = "child scope";
		$scope.fullSententceFromeChild = "Same $scope:We can access:"+
			$scope.rootProperty +"and"+
			$scope.parentProperty +"and" +
			$scope.childProperty;
	}])
})();