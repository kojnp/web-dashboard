app.controller("myController", function($scope, $localStorage) {
	$scope.$storage = $localStorage;

	$scope.viewEditURLs = false;

	if (typeof(Storage) == "undefined"){
		alert("No storage available! The URL's will not be persisted.");
	}
	
	// first time - initialize
	if (angular.isUndefined($scope.$storage.urls)){ 
		$scope.$storage.urls = [];
	}

	$scope.addURL = function(){
		$scope.$storage.urls.push({xurl : $scope.newURL});
	}

	$scope.removeURL = function($index){
		$scope.$storage.urls.splice($index, 1);
	}
});

