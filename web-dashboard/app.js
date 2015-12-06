var app = angular.module("myApp", ["ngStorage"]);

function Point(x, y){
	this.x = x;
	this.y = y;
}

function Coordinates(pointUpperLeft, pointLowerRight){
	this.pointUpperLeft = pointUpperLeft;
	this.pointLowerRight = pointLowerRight;
}

app.factory('Point', function(x, y){	
	return new Point(x, y);
});

app.factory('URLCoordinates', function(pointUpperLeft, pointLowerRight){	
	return new Coordinates(pointUpperLeft, pointLowerRight);
});
