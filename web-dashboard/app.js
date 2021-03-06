var app = angular.module("myApp", ["ngStorage"]);


function Point(x, y){
	this.x = x;
	this.y = y;
	this.toString = function(){
		return "(" + this.x + "," + this.y + ")";
	}
}

function createPointFromObject(obj){
	return new Point(obj.x, obj.y);
}

function createCoordinatesFromObject(obj){
	return new Coordinates(
			createPointFromObject(obj.pointUpperLeft), 
			createPointFromObject(obj.pointLowerRight)
	);
}

function Coordinates(pointOrigin, pointArrival){
	
	if ((pointOrigin.x <= pointArrival.x) && 
			(pointOrigin.y <= pointArrival.y)){
		this.pointUpperLeft = pointOrigin;
		this.pointLowerLeft = new Point(pointArrival.x, pointOrigin.y);
		this.pointUpperRight = new Point(pointOrigin.x, pointArrival.y);
		this.pointLowerRight = pointArrival;
	}

	if ((pointOrigin.x <= pointArrival.x) && 
			(pointOrigin.y > pointArrival.y)){
		this.pointUpperLeft = new Point(pointOrigin.x, pointArrival.y);
		this.pointLowerLeft = pointArrival;
		this.pointUpperRight = pointOrigin;
		this.pointLowerRight = new Point(pointArrival.x, pointOrigin.y);
	}
	
	if ((pointOrigin.x > pointArrival.x) && 
			(pointOrigin.y <= pointArrival.y)){
		this.pointUpperLeft = new Point(pointArrival.x, pointOrigin.y);
		this.pointLowerLeft = pointOrigin;
		this.pointUpperRight = pointArrival;
		this.pointLowerRight = new Point(pointOrigin.x, pointArrival.y);
	}

	if ((pointOrigin.x > pointArrival.x) && 
			(pointOrigin.y > pointArrival.y)){
		this.pointUpperLeft = pointArrival;
		this.pointLowerLeft = new Point(pointOrigin.x, pointArrival.y);
		this.pointUpperRight = new Point(pointArrival.x, pointOrigin.y);
		this.pointLowerRight = pointOrigin;
	}

	this.toString = function(){
		return "pointUpperLeft: " + this.pointUpperLeft.toString() +
			" pointLowerLeft: " + this.pointLowerLeft.toString() +
			" pointUpperRight: " + this.pointUpperRight.toString() +
			" pointLowerRight: " + this.pointLowerRight.toString();
	}

	//console.log("Points for Coordinate: " + this.toString());

}

/*
app.factory('Point', function(x, y){	
	return new Point(x, y);
});

app.factory('URLCoordinates', function(pointOrigin, pointArrival){	
	return new Coordinates(pointOrigin, pointArrival);
});
*/
