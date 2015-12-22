//trace.js

//This file shoots rays and returns the color determined from the shot.
//I have not modified this file, except to add an option between
//accelerated tracing and unaccelerated tracing.

///////////////////////////////////////////////////////////////////////

function trace(ray, scene, depth) {
    // This is a recursive method: if we hit something that's reflective,
    // then the call to `surface()` at the bottom will return here and try
    // to find what the ray reflected into. Since this could easily go
    // on forever, first check that we haven't gone more than three bounces
    // into a reflection.
    if (depth > 3) return;

    if(scene.accelerationBool == true){
        var distObject = intersectScene(ray, scene);
    } else{
        var distObject = old_intersectScene(ray, scene);
    }

    //test clause, REMOVE later
    if(distObject == undefined){
        // console.log("error");
        return Vector.ZERO;
    }

    // If we don't hit anything, fill this pixel with the background color -
    // in this case, white.
    if (distObject[0] === Infinity) {
        return Vector.ZERO;
    } 

    var dist = distObject[0],
        object = distObject[1];

    // The `pointAtTime` is another way of saying the 'intersection point'
    // of this ray into this object. We compute this by simply taking
    // the direction of the ray and making it as long as the distance
    // returned by the intersection check.
    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    // for Assn 6, generalize to objectNormal

    return surface(ray, scene, object, pointAtTime, objectNormal(object, pointAtTime), depth);
}

