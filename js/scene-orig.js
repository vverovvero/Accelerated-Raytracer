//scene-orig.js 

//This file prepares the geometry for the scene to be modeled.
//I have modified this file by adding in a triangle-mesh-loader function.
//I am also initializing the k-d tree in this file, and setting the acceleration boolean

///////////////////////////////////////////////////////////////////////////////////

// # The Scene
// In this file, the original red/blue/white room with overhead white light, and orange and blue corner lights
var scene = {};


// ## The Camera
//
// Our camera is pretty simple: it's a point in space, where you can imagine
// that the camera 'sits', a `fieldOfView`, which is the angle from the right
// to the left side of its frame, and a `vector` which determines what
// angle it points in.

// updated for Assn 6 so that camera.vector is more descriptively camera.toPoint
// updated for Assn 6 so that there is a camera.up instead of using vector.UP

scene.camera = {
// the eye location
    point: {
        x: 50,
        y: 50,
        z: 400
    },
    fieldOfView: 40,
// point indicated direction of view
    toPoint: {
        x: 50,
        y: 50,
        z: 0
    },
// added explicitly (this was always the up direction before)
    up: {
	x: 0,
	y: 1,
	z: 0
    }
};

// ## Lights
//
// Lights are defined only as points in space - surfaces that have lambert
// shading will be affected by any visible lights.
// updated for Assn 6 so that lights have a type and color 

scene.lights = [

   {
// a light in center of the ceiling
// omni is visible in all directions, no fall-off
   type: 'omni',
   point: {
    // x: 50,
    // y: 95,
    // z: 50
    x: 50,
    y: 99,
    z: 200
    },
// gray, not very bright
   color: {
   // x: 155,
   // y: 155,
   // z: 155
   x: 175,
   y: 175,
   z: 175
   },
  
},

//    {
//    type: 'spot',
//    point: {
//     x: 5,
//     y: 95,
//     z: 170
//     },
//    topoint: {
//     x: 70,
//     y: 25,
//     z: 50
//     },
//    angle: 30,
//    color: {
//    x: 255,
//    y: 220,
//    z: 200
//    },
  
// },
// front and in the upper left
// bright, reddish
   {
   type: 'omni',
   point: {
    // x: 5,
    // y: 95,
    // z: 100
    x: 5,
    y: 95,
    z: 250
    },
   color: {
   x: 255,
   y: 220,
   z: 200
   },
  
},
// front and lower right
// bluish 
 {
   type: 'omni',
   point: {
    // x: 95,
    // y: 5,
    // z: 100
    x: 95,
    y: 5,
    z: 250
    },
   color: {
   x: 50,
   y: 50,
   z: 100
   },

},
];

// ## Objects
//
// This raytracer handles sphere objects, with any color, position, radius,
// and surface properties.
// updated for Assn 6 so that objects and their materials are defined separately

scene.objects = [

// back wall, ceiling and floor are white
// back wall
{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
	x: 100, y: 0, z: 0
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 0
	},
	point2: {
	x: 100, y: 100, z: 0
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},
// floor
{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
	x: 0, y: 0, z: 300
	},
	point3: {
	x: 100, y: 0, z: 300
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 300
	},
	point2: {
	x: 100, y: 0, z: 0
	},
	point3: {
	x: 0, y: 0, z: 0
	},
	mat: 1
},
// ceiling
{
	type: 'triangle',
	point1: {
	x: 0, y: 100, z: 0
	},
	point2: {
        x: 100, y: 100, z: 0
	},
	point3: {
        x: 100, y: 100, z: 300	
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 100, z: 300
	},
	point2: {
	x: 0, y:100, z: 300
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},

// left wall, red

{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
        x: 0, y: 100, z: 0
	},
	point3: {
        x: 0, y: 100, z: 300	
	},
	mat: 2
},
{
	type: 'triangle',
	point1: {
	x: 0, y: 100, z: 300
	},
	point2: {
	x: 0, y:0, z: 300
	},
	point3: {
	x: 0, y: 0, z: 0
	},
	mat: 2
},


// right wall, blue

{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 0
	},
	point2: {
        x: 100, y: 0, z: 300
	},
	point3: {
        x: 100, y: 100, z: 300	
	},
	mat: 3
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 100, z: 300
	},
	point2: {
	x: 100, y:100, z: 0
	},
	point3: {
	x: 100, y: 0, z: 0
	},
	mat: 3
}

];


/////////////////////OBJ push/////////////////////////
function addPrimitive(primitive, material){
    var i = 0;

    var numTriangles = primitive.triangleIndices.length;
    while(i < numTriangles){
        var trianglePoints = [];
        for(var j=i; j<i+3; j++){
            var index = primitive.triangleIndices[j] - 1;  //account for index offset
            var x = primitive.vertices[3*index];
            var y = primitive.vertices[3*index+1];
            var z = primitive.vertices[3*index+2]
            var point = {x, y, z};
            trianglePoints.push(point);
        }

        var triangle = {
            type: 'triangle',
            point1: trianglePoints[0],
            point2: trianglePoints[1],
            point3: trianglePoints[2],
            mat: material,
        };
        scene.objects.push(triangle);
        i+=3;
    }
}

//////////////////adding spheres to the scene/////////////////
function load_spheres(){
	 var object = {
        type: 'sphere',
        point: {
            x: 70,
            y: 25,
            z: 175
        },
        mat: 8,
        radius: 25
    };

    scene.objects.push(object);

    var object = {
        type: 'sphere',
        point: {
            x: 20,
            y: 10,
            z: 200
        },
        mat: 8,
        radius: 10
    };

    scene.objects.push(object);

    var object = {
        type: 'sphere',
        point: {
            x: 30,
            y: 50,
            z: 150
        },
        mat: 8,
        radius: 15
    };

    scene.objects.push(object);


    var object = {
        type: 'sphere',
        point: {
            x: 40,
            y: 70,
            z: 200
        },
        mat: 8,
        radius: 10
    };

    scene.objects.push(object);

    var object = {
        type: 'sphere',
        point: {
            x: 10,
            y: 60,
            z: 180
        },
        mat: 8,
        radius: 10
    };

    scene.objects.push(object);

}


//////////////////////loading scene//////////////////////////

function disableSceneButton(){
	document.getElementById("load_scene").disabled = true;
}

function load_scene(){
	var scene_tag = document.getElementById("scene_tag").value;
	if(scene_tag == "scene0"){
	}
	else if(scene_tag == "scene1"){
		load_spheres();
	}
	else if(scene_tag == "scene2"){
		var humanoid = new humanoid_obj();
		addPrimitive(humanoid, 2);
	}
	else if(scene_tag == "scene3"){
		var humanoid = new humanoid_obj();
		addPrimitive(humanoid, 3);
	}
	else if(scene_tag == "scene4"){
		var humanoid = new humanoid_obj();
		addPrimitive(humanoid, 4);
	}
	else if(scene_tag == "scene5"){
		var teddy = new teddy_bear_obj();
		addPrimitive(teddy, 6);
	}
	else if(scene_tag == "scene6"){
		var teddy = new teddy_bear_obj();
		addPrimitive(teddy, 4);
	}
	else if(scene_tag == "scene7"){
		var teddy = new teddy_bear_obj();
		addPrimitive(teddy, 8);
	}
	else if(scene_tag == "scene8"){
		var bunny = new bunny_obj();
		addPrimitive(bunny, 11);
	}
	else if(scene_tag == "scene9"){
		var bunny = new bunny_obj();
		addPrimitive(bunny, 8);
	}
	else if(scene_tag == "scene10"){
		var bunny = new bunny_obj();
		addPrimitive(bunny, 7);
	}
	else if(scene_tag == "scene11"){
		var bunny = new bunny_obj();
		addPrimitive(bunny, 6);
	}
	else if(scene_tag == "scene12"){
		var bunny = new bunny_obj();
		addPrimitive(bunny, 10);
	}
	else if(scene_tag == "scene13"){
		var dragon = new dragon_obj();
		addPrimitive(dragon, 7);
	}
	else if(scene_tag == "scene14"){
		var dragon = new dragon_obj();
		addPrimitive(dragon, 4);
	}
	else if(scene_tag == "scene15"){
		var dragon = new dragon_obj();
		addPrimitive(dragon, 8);
	}
	else if(scene_tag == "scene16"){
		var dragon = new dragon_obj();
		addPrimitive(dragon, 6);
	}
	else if(scene_tag == "scene17"){
		var dragon = new dragon_obj();
		addPrimitive(dragon, 10);
	}
	else if(scene_tag == "scene18"){
		var buddha = new buddha_obj();
		addPrimitive(buddha, 11);
	}
	else if(scene_tag == "scene19"){
		var buddha = new buddha_obj();
		addPrimitive(buddha, 12);
	}
	else if(scene_tag == "scene20"){
		var buddha = new buddha_obj();
		addPrimitive(buddha, 7);
	}
	disableSceneButton();
}


////////////////////////////////////////////////////
scene.mats = [
// material 0

{
	type: 'orig',
	color: {
               x: 255,
               y: 255,
               z: 255
        	},
        specular: 0.0,
        lambert: 0.85,
        ambient: 0.05
},
// material 1
// diffuse white
{
	type: 'orig',
	color: {
               x: 255,
               y: 255,
               z: 255
        	},
       specular: 0.0,
        lambert: 0.9,
        ambient: 0.05
},
// material 2
// diffuse red
{
	type: 'orig',
	color: {
		x: 255,
		y: 90,
		z: 90
		},
        specular: 0.0,
	lambert: 0.9,
	ambient: 0.1
},
// material 3
//diffuse blue
{
	type: 'orig',
	color: {
		x: 90,
		y: 90,
		z: 255
		},
        specular: 0.0,
	lambert: 0.9,
	ambient: 0.1
},
// material 4
//mirror
{
	type: 'orig',
	color: {
		x: 255,
		y: 255,
		z: 255
		},
        specular: 0.9,
	lambert: 0.1,
	ambient: 0.0
},
//material 5
//phong, for metallic surfaces
{
	type: 'phong',
	n: 40,
	metal: 0,
	color: {
		x: 200,
		y: 170,
		z: 60
		},
    specular: 0.9,
	lambert: 0.1,
	ambient: 0.0
},
//material 6
//phong, metal = 1
{
	type: 'phong',
	n: 2,
	metal: 1,
	color: {
		x: 200,
		y: 170,
		z: 60
		},
    specular: 0.9,
	lambert: 0.1,
	ambient: 0.0
},
//material 7
//glossy red??
{
	type: 'orig',
	color: {
		x: 255,
		y: 94,
		z: 88
		},
        specular: 0.15,
	lambert: 0.65,
	ambient: 0.2
},
//material 8
//glass! - for refractive surfaces
//source: https://en.wikibooks.org/wiki/Blender_3D:_Noob_to_Pro/Every_Material_Known_to_Man/Glass
//http://physics.info/refraction/
{
	type: 'glass',
	color: {
		x: 255 * .74,
		y: 255 * .776,
		z: 255 * .818
		},
    specular: 1.5,
	lambert: 0.65,
	ambient: 0.2,
	ior: 1.560, //index of refrection, glass, fiber
	Kr: 0.2, //reflection variable //made up
	Kt: 0.8  //transmission variable //made up
},
//material 9
//shiny white?? comparison for glass
{
	type: 'orig',
	color: {
		x: 255,
		y: 255,
		z: 255
		},
        specular: 0.15,
	lambert: 0.65,
	ambient: 0.2
},
//material 10
//glossy aquamarine 
{
	type: 'orig',
	color: {
		x: 29,
		y: 219,
		z: 194
		},
        specular: 0.15,
	lambert: 0.65,
	ambient: 0.2
},
//material 11
//soft pink
{
	type: 'orig',
	color: {
		x: 255,
		y: 158,
		z: 230
		},
        specular: 0.0,
	lambert: 0.9,
	ambient: 0.1
},
//material 12
//glossy green 
{
	type: 'orig',
	color: {
		x: 9,
		y: 255,
		z: 9
		},
        specular: 0.3,
	lambert: 0.5,
	ambient: 0.2
},
]

/////////////////////////////////////////////////////////////////
//////////////////CREATING k-d TREE//////////////////////////////
/////////////////////////////////////////////////////////////////
function init_kd_tree(scene){
	var start = new Date().getTime();

	scene.tree = new kdTree();
	scene.tree.initRoot(scene);
	scene.tree.listlength = scene.tree.list.length;
	scene.tree.populate(scene);  

	var end = new Date().getTime();
	var time = end - start;
	alert('k-d tree built in: ' + time + ' milliseconds')

	console.log(scene.tree);
}


/////////////////////////////////////////////////////////////////
/////////////////setting acceleration////////////////////////////

function disableAccelerationButton(){
	document.getElementById("accelerationOn").disabled = true;
	document.getElementById("accelerationOff").disabled = true;
}

function accelerationOn(scene){
	scene.accelerationBool = true;
	init_kd_tree(scene);
	disableAccelerationButton();
}

function accelerationOff(scene){
	scene.accelerationBool = false;
	disableAccelerationButton();
}


