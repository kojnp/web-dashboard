app.controller("myController", function($scope, $localStorage, $sce) {
    
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

	$scope.colors = [];
	
	function addColor(colorname, classname){
		$scope.colors.push({color: colorname, className: classname});
	}

	addColor('gray', 'bg-gray');
	addColor('yellow', 'bg-yellow');
	addColor('red', 'bg-red');
	addColor('blue', 'bg-blue');
	addColor('pink', 'bg-pink');
	addColor('orange', 'bg-orange');
	addColor('brown', 'bg-brown');
	addColor('cyan', 'bg-cyan');
	addColor('magenta', 'bg-magenta');

	$scope.getclassName = function(rownumber, columnnumber){
                
            //console.log('getclassName ' + rownumber + ',' + columnnumber);
            
            for (i=0; i < $scope.localURLs.length; i++){
                
                if (isPointinsideCoordinate(rownumber, columnnumber, 
                                        $scope.localURLs[i].coordinates)){

                    //console.log($scope.colors[i].className);
                    return $scope.colors[i].className;
                }
            }
            
            //console.log('bg-white');
            return 'bg-white';// default for available cells
	};

	function isPointinsideCoordinate(rownumber, columnnumber, coordinate){
            if (coordinate.pointUpperLeft.x <= rownumber &&
                            coordinate.pointLowerRight.x >= rownumber &&
                            coordinate.pointUpperLeft.y <= columnnumber &&
                            coordinate.pointLowerRight.y >= columnnumber){
                    return true;
            }
            return false;
	}

	// I have to mirror storage.urls, to keep a class casted version of the coordinates
	// because I can't call "angular." functions inside {{}} in the template
	$scope.localURLs = [];
	for (i=0; i < $scope.$storage.urls.length; i++){
            //console.log($scope.$storage.urls[i].xurl);
            $scope.localURLs.push(
                    {
                            xurl : $scope.$storage.urls[i].xurl, 
                            coordinates : createCoordinatesFromObject(
                                            angular.fromJson($scope.$storage.urls[i].coordinates))
                    }
            );

            //console.log("storage:" + $scope.$storage.urls[i].xurl);
            //console.log("local:" + $scope.localURLs[i].coordinates);
	}	

	//console.log($scope.localURLs);


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
	};

	$scope.removeURL = function($index){
            $scope.$storage.urls.splice($index, 1);
            $scope.localURLs.splice($index, 1);
	};

	$scope.numLocationRows = 10;
	$scope.numLocationCols = 18; // 1366 x 768 resolution -> w = 1.8 x h
	$scope.getNumberOfRows = function() {
	    return new Array($scope.numLocationRows);
	};
	$scope.getNumberOfCols = function() {
	    return new Array($scope.numLocationCols);
	};

	$scope.setCoordinateOrigin = function(x, y){
            $scope.pointOrigin = new Point(x, y);			
            console.log("Point Origin : " + $scope.pointOrigin.toString());
	};
	$scope.setCoordinateArrival = function(x, y){
            $scope.pointArrival = new Point(x, y);			
            console.log("Point Arrival : " + $scope.pointArrival.toString());

            $scope.coordinates = new Coordinates($scope.pointOrigin, $scope.pointArrival);
	};
        
        
        // RENDERING

        // initialize
        var orderedURLs = [];
        initializeOrderedURLs();// MUST BE DONE AFTER EVERY EDIT also !
        
        function initializeOrderedURLs(){
            for (i=0; i < $scope.localURLs.length; i++){
                orderedURLs[i] = $scope.localURLs[i];
            }
        }
        
        function isBefore(coordinates1, coordinates2){
            if (coordinates1.pointUpperLeft.x < coordinates2.pointUpperLeft.x){
                return true;
            }
            if (coordinates1.pointUpperLeft.x === coordinates2.pointUpperLeft.x){
                if (coordinates1.pointUpperLeft.y <= coordinates2.pointUpperLeft.y){
                    return true;
                }
                return false;
            }
            return false;
        }
        
        function orderURLs(){
            
            for (i=0; i < orderedURLs.length - 1; i++){
                for (j = i + 1; j < orderedURLs.length; j++){
                
                    if (isBefore(orderedURLs[j].coordinates, 
                                    orderedURLs[i].coordinates)){
                                        
                        console.log("need to swap " + orderedURLs[i] + " uppleft(" + orderedURLs[i].coordinates.pointUpperLeft.x + ", " + orderedURLs[i].coordinates.pointUpperLeft.y + ") " +
                                " with " + orderedURLs[j] + " uppleft(" + orderedURLs[j].coordinates.pointUpperLeft.x + ", " + orderedURLs[j].coordinates.pointUpperLeft.y) + ") ";
                        
                        // swap them
                        var aux = orderedURLs[i];
                        orderedURLs[i] = orderedURLs[j];
                        orderedURLs[j] = aux;
                    }
                }
            }
        }        
        
        // step 1. Order the URLs
        orderURLs();
        
        var CELL_SIZE_MULTIPLIER = 72;
        var idOfURLToRenderNow = -1;
        var currentRowNum = -1;
        var currentColNum = -1;
        
        $scope.isRenderWhitespaceCell = function(rownumber, columnnumber){      
            
            currentRowNum = rownumber;
            currentColNum = columnnumber;
            
            for (var i=0; i < orderedURLs.length; i++){
            
                if (isPointinsideCoordinate(rownumber, columnnumber, 
                                orderedURLs[i].coordinates)){
                    //console.log("(" + rownumber + "," + columnnumber + ") inside the space for url # " + i);
                    idOfURLToRenderNow = i;
                    setURLForCell();
                    return false;
                }
            }
            //console.log("(" + rownumber + "," + columnnumber + ") this box will be empty cell");
            idOfURLToRenderNow = -1;
            $scope.urlForCell = '';
            return true;
        };
        
        function calcWidth(urlobj){
            var width = urlobj.coordinates.pointLowerRight.y -
                    urlobj.coordinates.pointUpperLeft.y + 1;
            return width;
        }
        
        function calcHeight(urlobj){
            var height = urlobj.coordinates.pointLowerRight.x -
                    urlobj.coordinates.pointUpperLeft.x + 1;
            return height;
        }
        

        $scope.getURLBoxStyle = function(){
            
            console.log("getURLBoxStyle called");   
                        
            if ($scope.shouldRenderIFrame()){
                
                console.log("url # " + idOfURLToRenderNow + " will NOW be rendered!");
                var width = CELL_SIZE_MULTIPLIER * calcWidth(orderedURLs[idOfURLToRenderNow]);
                var height = CELL_SIZE_MULTIPLIER * calcHeight(orderedURLs[idOfURLToRenderNow]);
                console.log("width="+width+", height="+height);
                
                return {'width' : width, 
                        'height' : height, 
                        'float' : 'left'};
                // OR MAYBE return obj ?
            }
            //console.log("empty style");
            return {'width' : 30, 
                        'height' : 30, 
                        'float' : 'left'};
        };
        
        $scope.urlForCell = '';
        
        $scope.shouldRenderIFrame = function(){
            if (idOfURLToRenderNow >= 0){
                var pointUpperLeft = orderedURLs[idOfURLToRenderNow].coordinates.pointUpperLeft;                
                if (pointUpperLeft.x === currentRowNum && pointUpperLeft.y === currentColNum){
                    console.log("shouldRenderIFrame=true; (" + currentRowNum + "," + currentColNum + ")");
                    return true;
                }
            }
            return false;
        };
        
        function setURLForCell(){
            if (idOfURLToRenderNow >= 0){
                
                $scope.urlForCell = $sce.trustAsResourceUrl(orderedURLs[idOfURLToRenderNow].xurl);
                
                //if ($scope.shouldRenderIFrame()) {
                //    console.log("url to render is " + $scope.urlForCell);
                //}
                
            } else {
                $scope.urlForCell = "";
            }
        };

});

