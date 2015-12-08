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

	//delete $scope.$storage.LocalMessage;

	$scope.colors = ['gray', 'yellow', 'red', 'blue', 'pink', 
									 'orange', 'brown', 'cyan', 'magenta'];

	// I have to mirror storage.urls, to keep a class casted version of the coordinates
	// because I can't call "angular." functions inside {{}} in the template
	$scope.localURLs = [];
	for (i=0; i < $scope.$storage.urls.length; i++){
		console.log($scope.$storage.urls[i].xurl);
		$scope.localURLs.push(
			{
				xurl : $scope.$storage.urls[i].xurl, 
				coordinates : createCoordinatesFromObject(
												angular.fromJson($scope.$storage.urls[i].coordinates))
			}
		);

		console.log("storage:" + $scope.$storage.urls[i].xurl);
		console.log("local:" + $scope.localURLs[i].coordinates);
	}	

	console.log($scope.localURLs);


	$scope.addURL = function(){
		$scope.$storage.urls.push(
					{
							xurl : $scope.newURL,
							coordinates : angular.toJson($scope.coordinates)
					}
		);

		$scope.localURLs.push(
					{
							xurl : $scope.newURL,
							coordinates : $scope.coordinates
					}
		);
	}

	$scope.removeURL = function($index){
		$scope.$storage.urls.splice($index, 1);
		$scope.localURLs.splice($index, 1);
	}

	$scope.numLocationRows = 10;
	$scope.numLocationCols = 18; // 1366 x 768 resolution -> w = 1.8 x h
	$scope.getNumberOfRows = function() {
	    return new Array($scope.numLocationRows);
	}
	$scope.getNumberOfCols = function() {
	    return new Array($scope.numLocationCols);
	}

	$scope.setCoordinateOrigin = function(x, y){
			$scope.pointOrigin = new Point(x, y);			
			console.log("Point Origin : " + $scope.pointOrigin.toString());
	}
	$scope.setCoordinateArrival = function(x, y){
			$scope.pointArrival = new Point(x, y);			
			console.log("Point Arrival : " + $scope.pointArrival.toString());

			$scope.coordinates = new Coordinates($scope.pointOrigin, $scope.pointArrival);
	}

});

