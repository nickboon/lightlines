(function (app) {
	var defaultBranchRadius = 10,
	// objects from dependancies
		colours = app.createColourObject(),
	// constants
		CIRCLE_ARC = 2 * Math.PI;
	
	// create and return API for this module
	app.createForceDirectedShapesObject = function (perspective) {
		function createBranch(nodeA, nodeB, radius, alpha) {
			var pointA = nodeA.centre,
				pointB = nodeB.centre,
				colour = nodeA.colour,
				radius = radius || defaultBranchRadius;
							
			return {
				points: [pointA, pointB],

				getNearestZ: function () {
					return Math.min(pointA.z, pointB.z);			
				},

				draw: function (context, alpha) {
					var screenX = perspective.getScreenX,
						screenY = perspective.getScreenY,
						pointAScreenX = screenX(pointA),
						pointAScreenY = screenY(pointA),
						pointBScreenX = screenX(pointB),
						pointBScreenY = screenY(pointB),
	
						opposite = pointAScreenX - pointBScreenX,
						adjacent = pointAScreenY - pointBScreenY,
						hypotenuse = 
							Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2)),
							
						scale = perspective.getScale(pointB),
						screenRadius = radius * scale,	
						ratio = screenRadius / hypotenuse,	
						pointOnPerimeterX = pointBScreenX + opposite * ratio,
						pointOnPerimeterY = pointBScreenY + adjacent * ratio;
						
					context.save();
					context.strokeStyle = colours.toRgb(colour, alpha);

					// line
					context.beginPath();
					context.moveTo(pointAScreenX, pointAScreenY);
					context.lineTo(pointOnPerimeterX, pointOnPerimeterY);
					context.closePath();
					context.stroke();
					
					// circle
					context.beginPath();
					context.arc(pointBScreenX, pointBScreenY, screenRadius, 0, CIRCLE_ARC );
					context.closePath();					
					context.stroke();
					
					context.restore();
				}
			};
		}

		if (!perspective) {
			throw 'You need to pass in a perspective object to create a branch.';
		}

		return {
			createBranch: createBranch
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
