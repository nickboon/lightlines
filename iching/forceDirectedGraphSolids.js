(function (app) {
	// create and return API for this module
	app.createForceDirectedGraphSolidsObject = function (defaultSetUp) {		
		function createTree (perspective, nodes, edges, setUp) {
			var drawing = app.createDrawingObject(perspective),
				shapes = app.createShapesObject(drawing),
				createLabel = shapes.createLabel,
				createBranch = app.createForceDirectedShapesObject(perspective).createBranch,
				setUp = setUp || defaultSetUp,
				primitives = [],
				points = [],
				key,
				nodeA,
				nodeB,
				label,
				branch;
					
			//lables
			for (key in nodes) {
				if (nodes.hasOwnProperty(key)) {
					nodeA = nodes[key];
					label = createLabel(nodeA.text, nodeA.centre, nodeA.colour, undefined, undefined, true);
					primitives.push(label);
					points.push(nodeA.centre);
				}
			}

			// branches
			edges.forEach(function (edge) {
				nodeA = nodes[edge.nodeA];
				nodeB = nodes[edge.nodeB];				
				branch = createBranch(nodeA, nodeB);
				primitives.push(branch);				
			}); 
			
			setUp(nodes); // put this outside?
			
			return {
				points: points,
				primitives: primitives
			};
		}

		return {
			createTree: createTree
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
