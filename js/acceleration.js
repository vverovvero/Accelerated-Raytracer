//acceleration.js

//This file contains functions used for building the k-d tree.
//sources: https://www.nczonline.net/blog/2009/06/09/computer-science-in-javascript-binary-search-tree-part-1/
//sources: http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/
//sources: http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tribox.txt

//triangleMidpoint gets the "midpoint" of given triangle
//"midpoint" is the naive average, not true centroid
function triangleMidpoint(triangle){
	var midpoint = {x:0, y:0, z:0};
	midpoint.x = (triangle.point1.x + triangle.point2.x + triangle.point3.x)/3; 
	midpoint.y = (triangle.point1.y + triangle.point2.y + triangle.point3.y)/3; 
	midpoint.z = (triangle.point1.z + triangle.point2.z + triangle.point3.z)/3; 

	return midpoint;
}

//initMidpointList puts midpoints of triangles and centers of spheres into a list
//the list consists of opPairs, where point refers to midpoint, and index refers to scene.objects
//NOTE: use of midpoints in my code became obsolete when naive splitting was implemented
function initMidpointList(scene){
	var midpointList = [];
	var length = scene.objects.length;
	for (var i = 0; i < length; i++) {
	    var object = scene.objects[i];

	    var opPair = {
	    	point: {x:0, y:0, z:0},
	    	index: i,
	    }

	    if(object.type == "sphere"){
	    	opPair.point = object.point;
	    	midpointList.push(opPair);
	    }
	    else if(object.type == "triangle"){
	    	var point = triangleMidpoint(object);
	    	opPair.point = point;
	    	midpointList.push(opPair);
	    }
	}
	return midpointList;
}

//getSplitPoint returned the average midpoint of a given list
//NOTE: getSplitPoint became obsolete when naive splitting was implemented
function getSplitPoint(list){
	var split = {x:0, y:0, z:0};
	var sumX = 0;
	var sumY = 0;
	var sumZ = 0;

	var length = list.length;

	for(i=0; i<length; i++){
		sumX += list[i].point.x;
		sumY += list[i].point.y;
		sumZ += list[i].point.z;
	}

	split.x = sumX/length;
	split.y = sumY/length;
	split.z = sumZ/length;

	return split;
}


//naiveSplit cuts the bounding box in half
//by naively averaging the lower and upper bounds
function naiveSplit(node){
	var split = {x:0, y:0, z:0};
	split.x = (node.boundmin.x + node.boundmax.x)/2;
	split.y = (node.boundmin.y + node.boundmax.y)/2;
	split.z = (node.boundmin.z + node.boundmax.z)/2;

	return split;
}

////////////////////////////////////////////////////////////////////////////
///////////////////////intersection test////////////////////////////////////

//triangleBB makes a call to triangleBB.js
//determines if a given triangle intersects a given bounding box
function triangleBB(triangle, node){

	var boxcenter = [];
	var xboxcenter = (node.boundmax.x - node.boundmin.x)/2 + node.boundmin.x;
	var yboxcenter = (node.boundmax.y - node.boundmin.y)/2 + node.boundmin.y;
	var zboxcenter = (node.boundmax.z - node.boundmin.z)/2 + node.boundmin.z;

	boxcenter.push(xboxcenter);
	boxcenter.push(yboxcenter);
	boxcenter.push(zboxcenter);

	var boxhalfsize = []; //3 scalar x, y, z
	var xhalfsize = (node.boundmax.x - node.boundmin.x)/2;
	var yhalfsize = (node.boundmax.y - node.boundmin.y)/2;
	var zhalfsize = (node.boundmax.z - node.boundmin.z)/2;

	boxhalfsize.push(xhalfsize);
	boxhalfsize.push(yhalfsize);
	boxhalfsize.push(zhalfsize);

	var triverts1 = [];
	var triverts2 = [];
	var triverts3 = [];
	var triverts = [];

	triverts1.push(triangle.point1.x); 
	triverts1.push(triangle.point1.y); 
	triverts1.push(triangle.point1.z);

	triverts2.push(triangle.point2.x); 
	triverts2.push(triangle.point2.y); 
	triverts2.push(triangle.point2.z);

	triverts3.push(triangle.point3.x); 
	triverts3.push(triangle.point3.y); 
	triverts3.push(triangle.point3.z);

	triverts.push(triverts1);
	triverts.push(triverts2);
	triverts.push(triverts3);

	if((triBoxOverlap(boxcenter, boxhalfsize, triverts) == 1)){
		return true;
	}
	else{
		return false;
	}
}

//sphereBB tests for sphere - box intersection
//approximates the bounding box as a sphere, so not 100% efficient
function sphereBB(sphere, node){
	var boxCenter = {x:0, y:0, z:0};
	boxCenter.x = (node.boundmax.x - node.boundmin.x)/2 + node.boundmin.x;
	boxCenter.y = (node.boundmax.y - node.boundmin.y)/2 + node.boundmin.y;
	boxCenter.z = (node.boundmax.z - node.boundmin.z)/2 + node.boundmin.z;

	var boxRadius = Vector.length(Vector.subtract(node.boundmax, boxCenter));

	var radiusSum = boxRadius + sphere.radius;
	var distance = Vector.length(Vector.subtract(sphere.point, boxCenter));

	if(radiusSum >= distance){
		return true;
	}
	else{
		return false;
	}
}

//objectBB tests for object- box intersection
//calls triangleBB or sphereBB
function objectBB(object, node){
	if(object.type == 'triangle'){
		return triangleBB(object, node);
	}
	if(object.type == 'sphere'){
		return sphereBB(object, node);
	}
}

////////////////////////////////////////////////////////////////////////////
//////////////////////k-d tree implementation///////////////////////////////

function kdTree(){
}

kdTree.prototype = {

	//init initialize a child node
	init: function(){
		this.boundmin = {x:0, y:0, z:0};
		this.boundmax = {x:100, y:100, z:100};
		this.list = [];
		this.listlength = 0;
		this.split = null;
		this.axis = null;
		this.left = null;
		this.right = null;
		this.depth = null;
	},

	//initRoot initializes the root node.  BOUNDS are important here.
	initRoot: function(scene){
		this.boundmin = {x:-50, y:-50, z:-50};
		this.boundmax = {x:250, y:250, z:350};		
		this.list = initMidpointList(scene);
		this.listlength = null;  //ok, only called once
		this.split = null;
		this.axis = null;
		this.left = null;
		this.right = null;
		this.depth = 0;
	},

	//sortList is given a split value
	//pick correct current & split value, sort the nodes
	//assume node.left and node.right have been initialized
	sortList: function(split, scene){
		// console.log("sortList");
		var length = this.list.length;
		for(var i=0; i<length; i++){
			var pair = this.list[i];

			//set current and value;
			var current;
			if(this.axis == "x"){
				current = pair.point.x;
				value = split.x;
			}
			else if(this.axis == "y"){
				current = pair.point.y;
				value = split.y;
			}
			else if(this.axis == "z"){
				current = pair.point.z;
				value = split.z;
			}

			//for all objects in this.list,
			//check for intersection with left and right bounding box
			//push if appropriate
			var object = scene.objects[pair.index];

			if((objectBB(object, this.left)) == true){
				this.left.list.push(pair);
				this.left.listlength += 1;
			}
			if((objectBB(object, this.right)) == true){
				this.right.list.push(pair);
				this.right.listlength += 1;
			}
		}
	},


	//selectSplitAxis - sets this.axis
	//also sets the bounds of the children boxes
	//ASSUMES left and right children have been initialized
	selectSplitAxis: function(split){
		//select longest axis as splitting axis
		var xlength = this.boundmax.x - this.boundmin.x;
		var ylength = this.boundmax.y - this.boundmin.y;
		var zlength = this.boundmax.z - this.boundmin.z;

		//left and right children inherit bounding box
		this.left.boundmin.x = this.boundmin.x;
		this.left.boundmin.y = this.boundmin.y;
		this.left.boundmin.z = this.boundmin.z;

		this.left.boundmax.x = this.boundmax.x;
		this.left.boundmax.y = this.boundmax.y;
		this.left.boundmax.z = this.boundmax.z;

		this.right.boundmin.x = this.boundmin.x;
		this.right.boundmin.y = this.boundmin.y;
		this.right.boundmin.z = this.boundmin.z;

		this.right.boundmax.x = this.boundmax.x;
		this.right.boundmax.y = this.boundmax.y;
		this.right.boundmax.z = this.boundmax.z;

		//this.axis is set, child BB are modified
		if(xlength >= ylength && xlength >= zlength){
			this.axis = "x";
			this.left.boundmax.x = split.x;
			this.right.boundmin.x = split.x;
		}
		else if(ylength >= xlength && ylength >= zlength){
			this.axis = "y";
			this.left.boundmax.y = split.y;
			this.right.boundmin.y = split.y;
		}
		else{
			this.axis = "z";
			this.left.boundmax.z = split.z;
			this.right.boundmin.z = split.z;
		}	
	},


	//splitNode calculates split axis and populates list of children subtrees
	//calculates new boundaries of the subtrees
	splitNode: function (scene){
		//initialize left and right subtrees
		this.left = new kdTree();
		this.left.init();
		this.left.depth = this.depth + 1;
		this.right = new kdTree();
		this.right.init();
		this.right.depth = this.depth + 1;

		this.split = naiveSplit(this);
		this.selectSplitAxis(this.split);
		this.sortList(this.split, scene);
	},
	
	//populate determines whether to create children. then calls splitNode
	//rewritten to allow for depths deeper than 50
	populate: function(scene){
		// console.log("populate!");
		var maxdepth = 50;  //gets slow if > 5
		var threshold = 10;
		var maxthreshold = 50;

		if((this.listlength < threshold && this.depth <= maxdepth) || 
			(this.listlength < maxthreshold && this.depth > maxdepth) ){
			return;
		}
		else{
			this.splitNode(scene);
			this.left.populate(scene);
			this.right.populate(scene);
		}
    },
};
