(function (app) {
	// config
	var hexagramColour = '#ffffff';
				
	app.run = function () {
		var forceDirectedGraphs = app.createForceDirectedGraphObject(),
			createNode = forceDirectedGraphs.createNode,
			createEdge = forceDirectedGraphs.createEdge,
			iching = app.createIchingObject(),
			hexagrams = iching.hexagrams,
			createIchingNodes = function () {
				var nodes = {};
				hexagrams.forEach(function (hexagram) {
					nodes[hexagram.name] = createNode(hexagram.character, hexagramColour);
				});
				return nodes;
			},
			nodes = createIchingNodes(),
			createIchingEdges = function () {
				var edges = [],
					secondHexagramIndex = 0;

				for (i = 0; i < 64; i+= 1) {
					for (j = 0; j < 6; j += 1) {                 
					secondHexagramIndex = hexagrams[i].nearestHexagrams[j];

						if (iching.getSumOfYangFor(i) > iching.getSumOfYangFor(secondHexagramIndex)) {
							edges.push(createEdge(hexagrams[i].name, hexagrams[secondHexagramIndex].name));
						}
					}
				}	
				
				return edges;
			},
			edges = createIchingEdges(),
			diagram = app.createFullScreenDiagramWithAtmosphericPerspective(),
			stage = diagram.stage,
			perspective = diagram.perspective,
			tree = forceDirectedGraphs.solids.createTree(perspective, nodes, edges);
			transformation = app.createTransformationObject(.5, 3600),
			inputTranformer = transformation.createKeyboardDrivenTransformer([tree]),
			autoTransformer = transformation.createAutoYRotationTransformer([tree], 1),
			forceDirectedGraphTransformer = app.createForceDirectedGraphTransformationsObject()
					.createDefaultTransformer(nodes, edges);
					
		window.document.getElementsByTagName('html')[0].mozRequestFullscreen; // is this needed? 
		perspective.focallength = 300;
		stage.setSolids([tree]);
		stage.setTransformers([inputTranformer, forceDirectedGraphTransformer]);
	}		
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
