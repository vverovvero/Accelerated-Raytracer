//surface.js

//This file allows the color of the pixel to be determined.
//I have modified this file to add support for light refraction, namely for rendering glass.
//sources for glass refraction:
//http://web.cse.ohio-state.edu/~hwshen/681/Site/Slides_files/reflection_refraction.pdf
//http://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/ray-tracing-practical-example


////////////////////////////////////////////////////////////////////////////////
// # Surface
//

// If `trace()` determines that a ray intersected with an object, `surface`
// decides what color it acquires from the interaction.

//updated for Assn 6 to have types for lights and colors for lambertAmount to account for light colors

function surface(ray, scene, object, pointAtTime, normal, depth) {

  var objColor= scene.mats[object.mat].color,
      c = Vector.ZERO,
      specReflect = Vector.ZERO,
      lambertAmount = Vector.ZERO;

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.
   

    if (scene.mats[object.mat].lambert && scene.mats[object.mat].type != 'glass') {
        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[i].point;
            var light = scene.lights[i];
            // First: can we see the light? If not, this is a shadowy area
            // and it gets no light from the lambert shading process.

            //pass in light object as third parameter
           if (isLightVisible(pointAtTime, scene, lightPoint, light)){
            // Otherwise, calculate the lambertian reflectance, which
            // essentially is a 'diffuse' lighting system - direct light
            // is bright, and from there, less direct light is gradually,
            // beautifully, less light.

             	var contribution = Vector.dotProduct(Vector.unitVector(
                 				Vector.subtract(lightPoint, pointAtTime)), normal);
             	if (contribution > 0) lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.lights[i].color, contribution));}
         
                
            }
      }
    

    // for assn 6, adjust lit color by object color and divide by 255 since light color is 0 to 255
    lambertAmount = Vector.compScale(lambertAmount, objColor);
    lambertAmount = Vector.scale (lambertAmount, scene.mats[object.mat].lambert);
    lambertAmount = Vector.scale(lambertAmount, 1./255.);

    // **[Specular](https://en.wikipedia.org/wiki/Specular_reflection)** is a fancy word for 'reflective': rays that hit objects
    // with specular surfaces bounce off and acquire the colors of other objects
    // they bounce into.
 //   if (object.specular) {
      if (scene.mats[object.mat].specular && scene.mats[object.mat].type != 'glass'){
         
        // This is basically the same thing as what we did in `render()`, just
        // instead of looking from the viewpoint of the camera, we're looking
        // from a point on the surface of a shiny object, seeing what it sees
        // and making that part of a reflection.
        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(Vector.scale(ray.vector, -1), normal)
        };

        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
          // specReflect = Vector.add(specReflect, Vector.scale(reflectedColor, scene.mats[object.mat].specular));
       //  alert(specReflect.x);
              c = Vector.add(c,Vector.scale(reflectedColor, scene.mats[object.mat].specular));
        }
    }

    //for glass
    if(scene.mats[object.mat].type == 'glass'){
      // console.log("here");
        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(Vector.scale(ray.vector, -1), normal)
        };

        var reflectedColor = trace(reflectedRay, scene, ++depth);
        // console.log(reflectedColor);

        var refractionRay = {
            point: pointAtTime,
            vector: Vector.refractThrough(ray.vector, normal, 1/scene.mats[object.mat].ior)

        };
        // console.log(scene.mats[object.mat].ior);
        // console.log(refractionRay);
        if(refractionRay.vector != null){
          // console.log(refractionRay);
            var refractionColor = trace(refractionRay, scene, ++depth);
        } else{
          // console.log("here");
          var refractionColor = reflectedColor;
        }
        // console.log("color: ", refractionColor);
        //test clause //prevent crashing //not sure what the cause is??
        if(refractionColor == undefined){
          refractionColor = {x: 0, y:0, z:0};
        }

        //sum up total color
        if (reflectedColor) {
          var Kr = scene.mats[object.mat].Kr;
          var bothColor = Vector.add(Vector.scale(Vector.scale(reflectedColor, scene.mats[object.mat].specular),Kr),Vector.scale(Vector.scale(refractionColor, scene.mats[object.mat].specular),(1-Kr)));
          // console.log(bothColor);
            c = Vector.add(c,bothColor);
        }
    }

    //update c, for specular
    if(scene.mats[object.mat].specular && scene.mats[object.mat].type == 'phong'){
        // console.log('phong');
        //if phong material, check for metal parameter
        var material = scene.mats[object.mat];
        var metalBool = material.metal;
        var n = material.n;
        var Ks = material.specular;

        // console.log(metalBool);

        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[i].point;
            var light = scene.lights[i];

            if (isLightVisible(pointAtTime, scene, lightPoint, light)){
              var eye = scene.camera.point;
              var vectorV = Vector.unitVector(Vector.subtract(pointAtTime, eye));
              var vectorL = Vector.unitVector(Vector.subtract(pointAtTime, lightPoint));
              var vectorN = Vector.unitVector(normal);
              var vectorH = Vector.unitVector(Vector.add(vectorV, vectorL));

              var dotHN = Vector.dotProduct(vectorH, vectorN);
              var dotHNX = Math.pow(dotHN, n);
              var scalar = Ks * dotHNX;
              var vectorC;
              var irradiance;

              //update what c is, because light hits
              //determine what c is based on metalBool
              if(metalBool == 0){
                vectorC = light.color;
                irradiance = Vector.scale(vectorC, scalar);
                c = Vector.add(c, irradiance);
              }
              if(metalBool == 1){
                vectorC = material.color;
                irradiance = Vector.scale(vectorC, scalar);
                c = Vector.add(c, irradiance);
              }
        
            }
        }
    }

    // lambert should never 'blow out' the lighting of an object,
    // even if the ray bounces between a lot of things and hits lights
//updated for Assn 6 lambertAmount is scaled and clamped
 //   lambertAmount = Vector.scale(lambertAmount, 1./255.);
//    lambertAmount = Math.min(1, lambertAmount);

    // **Ambient** colors shine bright regardless of whether there's a light visible -
    // a circle with a totally ambient blue color will always just be a flat blue
    // circle.
    return Vector.add3(c,
        lambertAmount,
        Vector.scale(objColor, scene.mats[object.mat].ambient));
}


