//render.js 

//This file is the parent file for calling all the helper functions that enable rendering.
//I have only modified this file to add a progress tracker, and to throw errors if 
//the scene to be rendered has not been loaded properly.

/////////////////////////////////////////////////////////////////////////////////////////

// # Throwing Rays
//
// This is one part where we can't follow nature exactly: technically photons
// come out of lights, bounce off of objects, and then some hit the 'eye'
// and many don't. Simulating this - sending rays in all directions out of
// each light and most not having any real effect - would be too inefficient.
//
// Luckily, the reverse is more efficient and has practically the same result -
// instead of rays going 'from' lights to the eye, we follow rays from the eye
// and see if they end up hitting any features and lights on their travels.
//
// For each pixel in the canvas, there needs to be at least one ray of light
// that determines its color by bouncing through the scene.

//progress tracks rendering progress at 10% increments
function progress(x, width){
    var c = 10;
    var progress = Math.round((x/width) * 100);

    if((progress % c) == 0){
        console.log(progress+'%');
    }
}


function render(scene) {
    //check for canvas selection
    if(width == undefined || height == undefined){
        alert("Canvas size not specified!");
        return;
    }

    //check for acceleration bool
    if(scene.accelerationBool == undefined){
        alert("Acceleration/Unacceleration not specified!");
        return;
    }

    //add timer
    var start = new Date().getTime();
    var printStart = new Date().toTimeString();
    console.log("start time: "+printStart);

    //add progress variables (5% markers)
    // var count = 1;
    // var current = 0;
    // var total = width * height;

    // first 'unpack' the scene to make it easier to reference

    var camera = scene.camera,
        objects = scene.objects,
        lights = scene.lights;
    var img = [ ];
    var img2 = [ ];

   

    // This process
    // is a bit odd, because there's a disconnect between pixels and vectors:
    // given the left and right, top and bottom rays, the rays we shoot are just
    // interpolated between them in little increments.
    //
    // Starting with the height and width of the scene, the camera's place,
    // direction, and field of view, we calculate factors that create
    // `width*height` vectors for each ray

    // Start by creating a simple vector pointing in the direction the camera is
    // pointing - a unit vector
    // updated for Assn 6 so that camera.vector is more descriptively camera.toPoint
    // updated for Assn 6 so that there is a camera.up instead of using vector.UP


    var eyeVector = Vector.unitVector(Vector.subtract(camera.toPoint, camera.point)),
        // and then we'll rotate this by combining it with a version that's turned
        // 90° right and one that's turned 90° up. Since the [cross product](http://en.wikipedia.org/wiki/Cross_product)
        // takes two vectors and creates a third that's perpendicular to both,
        // we use a pure 'UP' vector to turn the camera right, and that 'right'
        // vector to turn the camera up.
        vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, camera.up)),
        vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),
     
        // The actual ending pixel dimensions of the image aren't important here -
        // note that `width` and `height` are in pixels, but the numbers we compute
        // here are just based on the ratio between them, `height/width`, and the
        // `fieldOfView` of the camera.
        fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);

   

    var index, color;
    var ray = {
        point: camera.point
    };
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            // turn the raw pixel `x` and `y` values into values from -1 to 1
            // and use these values to scale the facing-right and facing-up
            // vectors so that we generate versions of the `eyeVector` that are
            // skewed in each necessary direction.

	    // For Assign 6, brute-force antialiasing with 25 samples/pixel
	    color = Vector.ZERO;

	    for (var s = -.4; s < .6; s+=.2) {
		for (var r = -.4; r < .6; r +=.2) {
		
           	 var xcomp = Vector.scale(vpRight, ((x+s) * pixelWidth) - halfWidth),
                     ycomp = Vector.scale(vpUp, ((y+r) * pixelHeight) - halfHeight);

                     ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

  	            // use the vector generated to raytrace the scene, returning a color
                    // as a `{x, y, z}` vector of RGB values
                    color = Vector.add(color, trace(ray, scene, 0)); //UNCOMMENT later


                //test clause for box intersection
                // color = intersectScene(ray, scene);
		
	    } }
	    color = Vector.scale(color, 0.04); 
            index = (x  * 3) + (y * width*  3);
	    img[index + 0] = color.x;
            img[index + 1] = color.y;
            img[index + 2] = color.z;

        
            //measure progress
            // current = x + y * width;
            progress(x, width);
            // count += 1;

        }
    }
      // adjust so fits into 0 to 255
      img2 = tone_map(img);  //uncomment later
      // img2 = img;  //no tone mapping

      // we computed from the bottom of the image up
      // image on the canvas has top row written first
      for(x=0;x<width;x++){
	for(y=0;y <height;y++){
	    index = (x * 3) + (y* width  * 3);
            d_index = (x * 4) + ((height-1 -y)* width * 4);
	    data.data[d_index + 0] = img2[index+ 0];
            data.data[d_index + 1] = img2[index +1];
            data.data[d_index + 2] = img2[index+2];
            data.data[d_index + 3] = 255;
       }} 


    // Now that each ray has returned and populated the `data` array with
    // correctly lit colors, fill the canvas with the generated data.
    ctx.putImageData(data, 0, 0);

    var end = new Date().getTime();
    var time = end - start;
    if(scene.accelerationBool == true){
        alert('Accelerated render time: ' + time + ' milliseconds');
    }
    else{
        alert('Unaccelerated render time: ' + time + ' milliseconds');
    }
}


