//intersectScene.js

//This file contains functions for determining if a ray has intersected an object in the scene.
//sources: http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
//sources: https://blog.frogslayer.com/kd-trees-for-faster-ray-tracing-with-triangles/

//My changes:
//Modified, to account for the use of kdTree
//Encapsulates original function, but gives the function a list of objects instead
//Search for collsion with kd tree first


//intersectObjectList is given a shortened list of objects
//returns closest object intersected
function intersectObjectList(ray, list, full_list, length){
    // The base case is that it hits nothing, and travels for `Infinity`
    var closest = [Infinity, null];
    // But for each object, we check whether it has any intersection,
    // and compare that intersection - is it closer than `Infinity` at first,
    // and then is it closer than other objects that have been hit?

    if(length == 0){
        return closest;
    }

    for (var i = 0; i < length; i++) {
        var index = list[i].index;
        var object = full_list[index];
        // console.log(object);
    
        if (object.type == 'sphere')  {
            dist = sphereIntersection(object, ray); 
        }
        if (object.type == 'spheretex') {
            dist = sphereIntersection(object, ray);
        }
        if (object.type == 'spherelong'){
            dist = sphereIntersection(object, ray);
        }
        if (object.type == 'triangle') {
               // alert("intersect tri");
            dist = triIntersection (object, ray);
        }
        if (dist !== undefined && dist > 0 && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}



//intersectBox checks for intersections between ray and bounding box
//adapted from scratchapixel, the non-optimized code
function intersectBox(ray, node){
    var tmin = (node.boundmin.x - ray.point.x)/ray.vector.x;
    var tmax = (node.boundmax.x - ray.point.x)/ray.vector.x;

    if (tmin > tmax){
        old_tmin = tmin;
        old_tmax = tmax;
        tmin = old_tmax;
        tmax = old_tmin;
    }

    var tymin = (node.boundmin.y - ray.point.y)/ray.vector.y;
    var tymax = (node.boundmax.y - ray.point.y)/ray.vector.y;

    if (tymin > tymax){
        old_tymin = tymin;
        old_tymax = tymax;
        tymin = old_tymax;
        tymax = old_tymin;
    }

    //check for misses
    if((tmin > tymax) || (tymin > tmax)){
        return Infinity;
    }

    //pick a min and max
    if(tymin > tmin){
        tmin = tymin;
    }
    if(tymax < tmax){
        tmax = tymax;
    }

    //factor in z
    var tzmin = (node.boundmin.z - ray.point.z)/ray.vector.z;
    var tzmax = (node.boundmax.z - ray.point.z)/ray.vector.z;

    if(tzmin > tzmax){
        old_tzmin = tzmin;
        old_tzmax = tzmax;
        tzmin = old_tzmax;
        tzmax = old_tzmin;
    }

    if ((tmin > tzmax) || (tzmin > tmax)){
        return Infinity;
    }

    if(tzmin > tmin){
        tmin = tzmin;
    }

    if(tzmax < tmax){
        tmax = tzmax;
    }

    return tmin;
}

//intersectKD needs to return a constructed list of OPpairs
//the list is produced by traversing the k-d tree
//uses a stack to traverse the tree
//afterward, the list is fed as input to intersectObjectList
function intersectKD(ray, scene){
    var list = [];
    var stack = [];

    stack.push(scene.tree);

    var listlength = 0;
    var stacklength = 1;

    while(stacklength != 0){
        var current = stack.pop();
        stacklength -= 1;

        //check if current is a child
        //if it is, check if there is an intersection, and add objects to list
        if(current.left == null && current.right == null){
            if((intersectBox(ray, current)!=Infinity)){
                var length = current.listlength;
                for(var i=0; i < length; i++){
                    list.push(current.list[i]);
                    listlength += 1;

                }
            }
        }

        //check if ray intersects current box
        //if it does, push the children onto the stack
        else if((intersectBox(ray, current) != Infinity)){
            if(current.left != null){
                stack.push(current.left);
                stacklength += 1;
            }
            if(current.right != null){
                stack.push(current.right);
                stacklength += 1;
            }
        }

    }

    return [list, listlength];
}


//intersectScene has been modified 
//determines a list of objects in the scene to give to intersectObjectList
function intersectScene(ray, scene) {

    var pair = intersectKD(ray, scene);
    var list = pair[0];
    var length = pair[1];

    return intersectObjectList(ray, list, scene.objects, length);
}

