//shadow.js

//This was a file used in the original raytracer, and for CPSC 478 Assignment 6.
//I have not modified this file for this project.

///////////////////////////////////////////////////////////////////////////////////

// This is the part that makes objects cast shadows on each other: from here
// we'd check to see if the area in a shadowy spot can 'see' a light, and when
// this returns `false`, we make the area shadowy.

function isLightVisible(pt, scene, lightPoint, light) {
	var type;
	type = light.type;

  if(scene.accelerationBool == true){
    var distObject =  intersectScene({ 
		point: pt, 
		vector: Vector.unitVector(Vector.subtract( lightPoint, pt)) //  was pt light, direction reverse
		}, scene);
  } else {
    var distObject =  old_intersectScene({ 
    point: pt, 
    vector: Vector.unitVector(Vector.subtract( lightPoint, pt)) //  was pt light, direction reverse
    }, scene);
  }

    //test clause
    if(distObject == undefined){
      // console.log("error_isLightVisible");
      return Vector.ZERO;
    }

	// correction visible if intersection is further than distance to light

	var visibility = (distObject[0] > Vector.length(Vector.subtract(lightPoint, pt)) -.005);

	//check for light type
	if(type == 'omni'){
   		// return (distObject[0] > Vector.length(Vector.subtract(lightPoint, pt)) -.005);   // was  > -0.005
   		return visibility;
   	}

   	if(type == 'spot'){
   		var toPoint = light.topoint;
   		var spotVector = Vector.subtract(lightPoint, toPoint);
   		var ptVector = Vector.subtract(lightPoint, pt);

   		// var spotAngle = (light.angle)/2;
   		var spotAngle = light.angle;

   		//calculate angle between the two vectors
   		var A = Vector.dotProduct(spotVector, ptVector);
   		var B = Vector.length(spotVector) * Vector.length(ptVector);
   		var C = A/B;
  		var angle = (180 * Math.acos(C))/Math.PI;

  		return ( (distObject[0] > Vector.length(Vector.subtract(lightPoint, pt)) -.005) && (angle <= spotAngle));

   	}


}
