(function (app) {
	// config
	var defaultNodeRadius = 10,
		defaultSetUp = app.createForceDirectedGraphTransformationsObject().defaultSetUp;

	
	function createEdge(a, b) {
		return { nodeA: a, nodeB: b };
	}
		
	function createNode(text, colour, radius, alpha) {
		return {
			centre: {x: 0, y: 0, z: 0},
			text: text,
			colour: colour,
			alpha: alpha,
			radius: radius || defaultNodeRadius				
		};
	}

	// create and return API for this module
	app.createForceDirectedGraphObject = function () {				
		return {
			createEdge: createEdge,
			createNode: createNode,
			solids: app.createForceDirectedGraphSolidsObject(defaultSetUp)
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
