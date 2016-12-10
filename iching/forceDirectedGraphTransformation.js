(function (app) {
	// config
	var defaultSetUpRadius = 100,
		defaultConnectedNodesAttraction = .5;

	// objects from DOM/BOM
	// objects from dependancies
			
	function size(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				size += 1;
			}
		}
		return size;
	}
	
	function defaultSetUp (nodes, centre) {
		var initialR = 100,
			angle = 0,
			angleIncrement = Math.PI * 2 / size(nodes),
			initialX = 0,
			initialY = 0,
			initialZ = 0,
			centre = centre || {x: 0 , y: 0, z: 0},
			key;
			  
		for (key in nodes) {
			if (nodes.hasOwnProperty(key)) {
				initialX = centre.x + (Math.sin(angle) * defaultSetUpRadius)
				initialY = centre.y + (Math.cos(angle) * defaultSetUpRadius)
				angle += angleIncrement;
				initialZ += 1;

				nodes[key].centre.x = initialX;
				nodes[key].centre.y = initialY;
				nodes[key].centre.z = initialZ;
			}
		}		
	}
			
   function curvedNodeRepulsion(nodeA, nodeB, speed) {
        var nodeIdealDiameter = window.innerHeight * 0.78,//0.8
            dx = nodeA.centre.x - nodeB.centre.x,
            dy = nodeA.centre.y - nodeB.centre.y,
            dz = nodeA.centre.z - nodeB.centre.z,
            distSQ = Math.pow(dx, 2) + Math.pow(dy, 2),
            dist = Math.sqrt(distSQ),
            inverseDist = 0,
            accel = 0;
        
        // add in third dimension
        distSQ = Math.pow(dist, 2) + Math.pow(dz, 2);
        dist = Math.sqrt(distSQ);
        
        inverseDist = 1 / dist;
        accel = (dist - nodeIdealDiameter) / (nodeIdealDiameter) * speed;
                                
        nodeA.centre.x -= dx * inverseDist * accel;
        nodeA.centre.y -= dy * inverseDist * accel;
        nodeA.centre.z -= dz * inverseDist * accel;
        nodeB.centre.x += dx * inverseDist * accel;
        nodeB.centre.y += dy * inverseDist * accel;
        nodeB.centre.z += dz * inverseDist * accel;		
    }		
		
	function mutualRepulsion(nodes) {
		var nodeIdA,
            nodeIdB,
            idA,
            idB,
            i = 0,
            j = 0,
            numberOfNodes = size(nodes),
            speed = (1 / numberOfNodes) * 50; // need to balance speed and good layout.	 
        if (speed < 1) {
            speed = 1;
        }
        
        for (nodeIdA in nodes) {
            if (nodes.hasOwnProperty(nodeIdA)) {
                j = 0;
                for (nodeIdB in nodes) {
                    if (nodes.hasOwnProperty(nodeIdB)) {
                        if (j < i) {
                            curvedNodeRepulsion(nodes[nodeIdA], nodes[nodeIdB], speed);
                        }
                        j += 1;
                    }
                }
                i += 1;
            }
        }
	}
			
    // flat mutual attraction
    function linearNodeAttraction(nodeA, nodeB, speed) {
        var dx = nodeA.centre.x - nodeB.centre.x,
            dy = nodeA.centre.y - nodeB.centre.y,
            dz = nodeA.centre.z - nodeB.centre.z;

        nodeA.centre.x -= dx * speed;
        nodeA.centre.y -= dy * speed;
        nodeA.centre.z -= dz * speed;
        nodeB.centre.x += dx * speed;
        nodeB.centre.y += dy * speed;
        nodeB.centre.z += dz * speed;
    }

	function attractAllToCentre(nodes, speed) {
        for (nodeIdA in nodes) {
            if (nodes.hasOwnProperty(nodeIdA)) {
				linearNodeAttraction(nodes[nodeIdA], {centre:{x: 0, y: 0, z: 0}}, speed)
			}
		}		
	}
		

	
	// create and return API for this module
	app.createForceDirectedGraphTransformationsObject = function (cna) {
		var connectedNodesAttraction = cna || defaultConnectedNodesAttraction;
		
		function createDefaultTransformer(nodes, edges) {
			var buildTime = 10000,
				collapseTime = 1000;
				timeLimit = buildTime + collapseTime;
		
			function attractConnectedNodes(nodes, edges) {
				var phi = 1.6180339887498949,
					idA,
					idB,
					speed,
					numberOfNodes = size(nodes),
					i;

					speed = connectedNodesAttraction / (numberOfNodes * phi);
					
				for (i = 0; i < edges.length; i += 1) {
					idA = edges[i].nodeA;
					idB = edges[i].nodeB;
					
					linearNodeAttraction(nodes[idA], nodes[idB], speed);
				}
			};

			function transform() { 

				if (timeLimit > collapseTime) {
					mutualRepulsion(nodes);					
					attractConnectedNodes(nodes, edges);					
				} else if (timeLimit > 0 && timeLimit <= collapseTime) {
					attractAllToCentre(nodes, .005);
				} else {
					timeLimit = buildTime + collapseTime;
				}
				
				timeLimit -= 1;
			
			
				// if (!timeLimit || timeLimit > 0) {
					// mutualRepulsion(nodes);					
					// attractConnectedNodes(nodes, edges);
					// timeLimit -= 1;
				// }
			}
			
			return {
				transform: transform
			};		
		}
	
		return {
			defaultSetUp: defaultSetUp,
			createDefaultTransformer: createDefaultTransformer
		};
	}
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
