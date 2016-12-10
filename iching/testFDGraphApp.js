(function (app) {		
	app.run = function () {
		var forceDirectedGraphs = app.createForceDirectedGraphObject(),
			createEdge = forceDirectedGraphs.createEdge,
			createNode = forceDirectedGraphs.createNode,		
			edges = [
				createEdge('a', 'b'),
				createEdge('a', 'e'),
				createEdge('a', 'd'),
				createEdge('b', 'c'),
				createEdge('b', 'f'),
				createEdge('c', 'd'),
				createEdge('c', 'g'),
				createEdge('d', 'h'),
				createEdge('e', 'f'),
				createEdge('e', 'h'),
				createEdge('g', 'f'),
				createEdge('g', 'h')
			],
			nodes = {
				a: createNode('Node A Label', '#bb2222'), // red
				b: createNode('Node B Label', '#66aa66'), // green
				c: createNode('Node C Label', '#2222bb'), // blue
				d: createNode('Node D Label', '#bb9966'), // brown
				e: createNode('Node E Label', '#55bbbb'),
				f: createNode('Node F Label', '#993399'),
				g: createNode('Node G Label', '#9999cc'),
				h: createNode('Node H Label' )	
			},
			diagram = app.createDefaultFullScreenDiagram(),
			stage = diagram.stage,
			perspective = diagram.perspective,
			tree = forceDirectedGraphs.solids.createTree(perspective, nodes, edges);
			transformation = app.createTransformationObject(),
			inputTranformer = transformation.createKeyboardDrivenTransformer([tree]),
			forceDirectedGraphTransformer = app.createForceDirectedGraphTransformationsObject()
				.createDefaultTransformer(nodes, edges, 200);
			
		stage.setSolids([tree]);
		stage.setTransformers([inputTranformer, forceDirectedGraphTransformer]);
	}		
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
