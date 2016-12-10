(function (app) {
	// config
	var  defaultAttraction = 0.00001;

    
    // FORCE DIRECTION METHODS //////////////////////////////////////////////////////////////////
    
    // expolnential mutual repulsion
    // greater distance = less force
    function curvedNodeRepulsion(nodeA, nodeB, speed) {
        
        var nodeIdealDiameter = window.innerHeight * 0.8,
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
   
   
    function attractAllNodesToCentre(nodes, centreNode) {
        var nodeId;
        
        for (nodeId in nodes) {
            if (nodes.hasOwnProperty(nodeId)) {
                curvedNodeRepulsion(nodes[nodeId], centreNode);
            }
        }
    }

    function mutualRepulsion(nodes) {
        var nodeIdA,
            nodeIdB,
            idA,
            idB,
            i = 0,
            j = 0,
            numberOfNodes = Object.size(nodes),
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
    
    this.attractConnectedNodes = function (nodes, connections) {
        var phi = 1.6180339887498949,
            idA,
            idB,
            speed,
            numberOfNodes = Object.size(nodes),
            i;
        
        for (i = 0; i < connections.length; i += 1) {
            idA = connections[i].nodeIdA;
            idB = connections[i].nodeIdB;
            speed = this.connectedNodesAttraction / (numberOfNodes * phi);
            
            linearNodeAttraction(nodes[idA], nodes[idB], speed);
        }
    };
    
    
    // DEFAULT FDL UPDATE METHOD * REASSIGN WITH CUSTOM METHOD IF REQUIRED
    this.update = function () {
        if (updateCount < maxUpdate) {
            mutualRepulsion(this.floatingNodes);
            this.attractConnectedNodes(this.floatingNodes, this.connections);
            if(isUpdateCounted) {
              updateCount += 1;
            }
        }
    };
      
    // DEFAULT GRAPHIC OBJECT ASSEMBLER * REASSIGN WITH CUSTOM METHOD IF REQUIRED
    this.buildGraph = function defaultBuild() {

        var nodeA,
            nodeB,
            label,
            line,
            nodeId,
            i;
        
        //build primitives and points for nodes
        for (nodeId in this.floatingNodes) {
            if (this.floatingNodes.hasOwnProperty(nodeId)) {
                
                // get graphic objects
                nodeA = floatingNodes[nodeId];
                label = new graphic_objects_3d.Label(nodeA.text, nodeA.centre);

                // collect all the primitves  
                this.primitives = this.primitives.concat(label.primitives);

                // collect all the points
                this.points = this.points.concat(label.points);
            }
        }
        
        //build primitives for connections
        for (i = 0; i < this.connections.length; i += 1) {
            // get graphic objects
            nodeA = floatingNodes[this.connections[i].nodeIdA];
            nodeB = floatingNodes[this.connections[i].nodeIdB];
            line = new graphic_objects_3d.Line(nodeA.centre, nodeB.centre);

            // collect all the primitives (points aready collected).
            this.primitives = this.primitives.concat(line.primitives);
        }
    };
};

// TEMPLATE FORCE DIRECTED GRAPH CREATOR METHODS /////////////////////////////////////////////////////////////////////

/* Creates the default ForceDirectedGraph  
 *
 * @namespace graphic_objects_3d      
 * @parameter {array} nodes
 * @parameter {array} connections
 * @returns ForceDirectedGraph
 */
graphic_objects_3d.createDefaultForceDirectedGraph = function (nodes, connections) {
    'use strict';
    
    var defaultFDG = new graphic_objects_3d.ForceDirectedGraph(nodes, connections);
    defaultFDG.setUpNodes();
    defaultFDG.buildGraph();
    
    return defaultFDG;
};

/* Creates a ForceDirectedGraph with force directed edges 
 * The relationships have a direction that is drawn 
 * using a graphic_objects_3d.Branch primitves
 * 
 * @namespace graphic_objects_3d      
 * @parameter {array} nodes
 * @parameter {array} connections
 * @returns ForceDirectedGraph
 */
graphic_objects_3d.createTreeGraph = function (nodes, connections) {
    'use strict';

    var treeGraph = new graphic_objects_3d.ForceDirectedGraph(nodes, connections);

    treeGraph.setUpNodes();
    treeGraph.buildGraph = function () {

        var nodeA,
            nodeB,
            label,
            branch,
            nodeId,
            i;
            
        //build primitives and points for nodes
        for (nodeId in treeGraph.floatingNodes) {
            if (this.floatingNodes.hasOwnProperty(nodeId)) {

                // get graphic objects
                nodeA = treeGraph.floatingNodes[nodeId];
                label = new graphic_objects_3d.Label(nodeA.text, nodeA.centre, nodeA.colour);

                // collect all the primitves  
                treeGraph.primitives = treeGraph.primitives.concat(label.primitives);

                // collect all the points
                treeGraph.points = treeGraph.points.concat(label.points);
            }
        }

        //build primitives for connections
        for (i = 0; i < treeGraph.connections.length; i += 1) {
            nodeA = treeGraph.floatingNodes[treeGraph.connections[i].nodeIdA];
            nodeB = treeGraph.floatingNodes[treeGraph.connections[i].nodeIdB];

            //make graphic objects to describe the branch
            branch = new graphic_objects_3d.Branch(nodeA.centre, nodeB.centre, nodeA.colour, nodeB.r);

            treeGraph.primitives = treeGraph.primitives.concat(branch.primitives);
        }
    };

    treeGraph.buildGraph();
    return treeGraph;
};

// FORCE DIRECTED PRIMITIVES /////////////////////////////////////////////////////////////////

/* Creates a Node  
 *
 * @namespace graphic_objects_3d    
 * @constructor
 * @this {Node}   
 * @parameter {object} text the text to appear in if a label is to be attached
 * @parameter {object} colour
 * @parameter {object} r a radius used for creating graphics
 */
graphic_objects_3d.Node = function (text, colour, r) {
    'use strict';
    
	this.centre = new window.Point3d();
    this.text = text;
    this.colour = (colour === undefined) ? "#000000" : window.utils.parseColor(colour);
    this.alpha = 0.5;
    this.r = 10;
};

/* Creates a Connection  
 *
 * @namespace graphic_objects_3d    
 * @constructor
 * @this {Connection}   
 * @parameter {object} nodeIdA the id of the referring node
 * @parameter {object} nodeIdB the id of the referred to node
 */
graphic_objects_3d.Connection = function (nodeIdA, nodeIdB) {
    'use strict';
    
    this.nodeIdA = nodeIdA;
    this.nodeIdB = nodeIdB;
};

/* Creates a Branch  
 *
 * @namespace graphic_objects_3d    
 * @constructor
 * @this {Connection}   
 * @parameter {object} pointA 
 * @parameter {object} pointB
 * @parameter {number} colour
 * @parameter {object} r the radius used to draw a circle indicating the referred to node
 * @parameter {number} alpha 
 */
graphic_objects_3d.Branch = function (pointA, pointB, colour, r, alpha) {
    'use strict';

    this.pointA = pointA;
    this.pointB = pointB;
    this.r = r || 10;
    this.alpha = 0.5;
    this.points = [this.pointA, this.pointB];
    this.pointOnPerimeterX = 0;
    this.pointOnPerimeterY = 0;
    this.arc = 2 * Math.PI;
    
    graphic_objects_3d.Primitive.getProperties.call(this, colour, alpha);
};

graphic_objects_3d.Branch.prototype.draw = function (context) {
    'use strict';

    var pointAScreenX = this.pointA.getScreenX(),
        pointAScreenY = this.pointA.getScreenY(),
        pointBScreenX = this.pointB.getScreenX(),
        pointBScreenY = this.pointB.getScreenY(),
        opposite = pointAScreenX - pointBScreenX,
        adjacent = pointAScreenY - pointBScreenY,
        hypotenuse = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2)),
        scale,
        screenR,
        ratio;

    // find perimiter of node to shorten line and draw circle 
    scale = this.pointB.getScale();
    screenR = this.r * scale;

    //find point on perimeter
    ratio = screenR / hypotenuse;
    opposite *= ratio;
    adjacent *= ratio;
    this.pointOnPerimeterX = pointBScreenX + opposite;
    this.pointOnPerimeterY = pointBScreenY + adjacent;
    
    context.save();
	context.strokeStyle = window.utils.colorToRGB(this.colour, this.alpha);

    // line
    context.beginPath();
    context.moveTo(pointAScreenX, pointAScreenY);
	context.lineTo(this.pointOnPerimeterX, this.pointOnPerimeterY);
    context.closePath();
    context.stroke();
    
    // circle
    context.beginPath();
    context.arc(
        pointBScreenX,
        pointBScreenY,
        screenR,
        0,
        this.arc
    );
    context.closePath();
    
    context.stroke();
	context.restore();
};

graphic_objects_3d.Branch.prototype.getSVG = function () {
    'use strict';

    var scale = this.pointB.getScale(),
        screenR = this.r * scale;

    return '<line x1="' + this.pointA.getScreenX()
        + '" y1="' + this.pointA.getScreenY()
        + '" x2="' + this.pointOnPerimeterX
        + '" y2="' + this.pointOnPerimeterY
		+ '" style="stroke:' + this.colour
		+ '" opacity="' + this.alpha + '" />'
        + '<circle cx="' +  this.pointB.getScreenX()
		+ '" cy="' + this.pointB.getScreenY()
        + '" r="' + screenR
		+ '" stroke="' + this.colour + '" fill = "none"'
		+ ' opacity="' + this.alpha + '" />';
};

graphic_objects_3d.Branch.prototype.getNearestPoint = function () {
    'use strict';
    
	return Math.min(this.pointA.z, this.pointB.z);
};

// TEST FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

/* Creates a test default ForceDirectedGraph with 12 nodes and puts them on a Stage
 * It should form a cube
 *
 * @namespace graphic_objects_3d    
 * @function
 */
graphic_objects_3d.testDefaultGraph = function () {
    'use strict';
    
    var myFloatingNodes = [],
        myNodesConnections = [
            new graphic_objects_3d.Connection('nodeAId', 'nodeBId'),
            new graphic_objects_3d.Connection('nodeAId', 'nodeEId'),
            new graphic_objects_3d.Connection('nodeAId', 'nodeDId'),
            new graphic_objects_3d.Connection('nodeBId', 'nodeCId'),
            new graphic_objects_3d.Connection('nodeBId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeCId', 'nodeDId'),
            new graphic_objects_3d.Connection('nodeCId', 'nodeGId'),
            new graphic_objects_3d.Connection('nodeDId', 'nodeHId'),
            new graphic_objects_3d.Connection('nodeEId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeEId', 'nodeHId'),
            new graphic_objects_3d.Connection('nodeGId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeGId', 'nodeHId')
        ],
        myHexahedron,
        myFDL3d,
        myStage,
        stagePoints,
        stagePrimitives;
            
    myFloatingNodes.nodeAId = new graphic_objects_3d.Node('Node A Label');
    myFloatingNodes.nodeBId = new graphic_objects_3d.Node('Node B Label');
    myFloatingNodes.nodeCId = new graphic_objects_3d.Node('Node C Label');
    myFloatingNodes.nodeDId = new graphic_objects_3d.Node('Node D Label');
    myFloatingNodes.nodeEId = new graphic_objects_3d.Node('Node E Label');
    myFloatingNodes.nodeFId = new graphic_objects_3d.Node('Node F Label');
    myFloatingNodes.nodeGId = new graphic_objects_3d.Node('Node G Label');
    myFloatingNodes.nodeHId = new graphic_objects_3d.Node('Node H Label');
    
    
    myHexahedron = new graphic_objects_3d.Hexahedron();
    myFDL3d = graphic_objects_3d.createDefaultForceDirectedGraph(myFloatingNodes, myNodesConnections);

    stagePoints = myHexahedron.points.concat(myFDL3d.points);
    stagePrimitives = myHexahedron.primitives.concat(myFDL3d.primitives);
	myFDL3d.connectedNodesAttraction = 0.7;

    myStage = new graphic_objects_3d.Stage(stagePoints, stagePrimitives, [myFDL3d]);
};

/* Creates a test tree ForceDirectedGraph with directed edges
 * and using 12 nodes and puts them on a Stage
 * It should form a cube
 *
 * @namespace graphic_objects_3d    
 * @function
 */
graphic_objects_3d.testTreeGraph = function () {
    'use strict';
    
    var myFloatingNodes = [],
        myNodesConnections = [
            new graphic_objects_3d.Connection('nodeAId', 'nodeBId'),
            new graphic_objects_3d.Connection('nodeAId', 'nodeEId'),
            new graphic_objects_3d.Connection('nodeAId', 'nodeDId'),
            new graphic_objects_3d.Connection('nodeBId', 'nodeCId'),
            new graphic_objects_3d.Connection('nodeBId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeCId', 'nodeDId'),
            new graphic_objects_3d.Connection('nodeCId', 'nodeGId'),
            new graphic_objects_3d.Connection('nodeDId', 'nodeHId'),
            new graphic_objects_3d.Connection('nodeEId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeEId', 'nodeHId'),
            new graphic_objects_3d.Connection('nodeGId', 'nodeFId'),
            new graphic_objects_3d.Connection('nodeGId', 'nodeHId')
        ],
        myFDL3d,
        myStage;
            
    myFloatingNodes.nodeAId = new graphic_objects_3d.Node('Node A Label', '#bb2222'); // red
    myFloatingNodes.nodeBId = new graphic_objects_3d.Node('Node B Label', '#66aa66'); // green
    myFloatingNodes.nodeCId = new graphic_objects_3d.Node('Node C Label', '#2222bb'); // blue
    myFloatingNodes.nodeDId = new graphic_objects_3d.Node('Node D Label', '#bb9966'); // brown
    myFloatingNodes.nodeEId = new graphic_objects_3d.Node('Node E Label', '#55bbbb');
    myFloatingNodes.nodeFId = new graphic_objects_3d.Node('Node F Label', '#993399');
    myFloatingNodes.nodeGId = new graphic_objects_3d.Node('Node G Label', '#9999cc');
    myFloatingNodes.nodeHId = new graphic_objects_3d.Node('Node H Label');

    myFDL3d = graphic_objects_3d.createTreeGraph(myFloatingNodes, myNodesConnections);
	myFDL3d.connectedNodesAttraction = 0.5;
    myStage = new graphic_objects_3d.Stage(myFDL3d.points, myFDL3d.primitives, [myFDL3d]);
};




// utils functions

Object.size = function (obj) {
    'use strict';

    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size += 1;
        }
    }
    return size;
};
	
	
	function createNode() {
		
	}
	
	// INITIALIATION METHOD * REPLACE WITH CUSTOM WITH THIRD PARAMETER OF CONSTRUCTOR IF REQUIRED
    // spaces out nodes so forces can act on them.
    function setUpNodes (floatingNodes, centre) {
        var initialR = 100,
            angle = 0,
            angleIncrement = Math.PI * 2 / Object.size(floatingNodes),
            initialX = 0,
            initialY = 0,
            initialZ = 0,
            id;
              
        for (id in floatingNodes) {
            if (floatingNodes.hasOwnProperty(id)) {
                initialX = centre.x + (Math.sin(angle) * initialR);
                initialY = centre.y + (Math.cos(angle) * initialR);
                angle += angleIncrement;

                initialZ += 1;

                floatingNodes[id].centre.x = initialX;
                floatingNodes[id].centre.y = initialY;
                floatingNodes[id].centre.z = initialZ;         
			}
        }
	}

	function create(floatingNodes, connections, setUpNodes)
		var updateCount = 0,
			maxUpdate = Object.size(floatingNodes) + 1000,
			isUpdateCounted = false,
			
			centreNode createNode()
			fixedNodes = [centreNode],
			points = [centreNode.centre];
			primitives = [];
			
		if (!floatingNodes) {
			throw 'A force directed layout default requires a floatingNodes array parameter.'
		}

		return {
			points: points,
			primitives: primitives,
			setUpNodes: function () {
				setUpNodes(floatingNodes, centreNode.centre)
			}			
		}
    };
		
	// create and return API for this module
	app.createForceDirectedGraphObject =  = function () {
 		return {
			create: create
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
