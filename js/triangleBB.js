//triangleBB.js

//I refactored triangleBB.js from code I found online at:
//http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/

//The functions in this file allow for intersections between a triangle 
//and an axis-aligned bounding box to be detected.

//question: does this account for overlaps with planes?? 
// ie. if bounding box is (0,0,0) to (100, 100, 100), 
//then triangle intersects exactly on a plane

// var X = 0;
// var Y = 1;
// var Z = 2;


function CROSS(v1,v2)
{
  var dest = [];
  dest[0]=v1[1]*v2[2]-v1[2]*v2[1];
  dest[1]=v1[2]*v2[0]-v1[0]*v2[2];
  dest[2]=v1[0]*v2[1]-v1[1]*v2[0]; 

  return dest;
}


function DOT(v1,v2){
  return (v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2]);
}



function SUB(v1,v2)
{
  var dest = [];
  dest[0]=v1[0]-v2[0];
  dest[1]=v1[1]-v2[1];
  dest[2]=v1[2]-v2[2]; 

  return dest;
}
//check scope of this function
function FINDMINMAX(x0, x1, x2, min, max){
    min = max = x0;

    if(x1<min){
      min = x2;
    }
    if(x1>max){
      max = x1;
    }
    if(x2<min){
      min = x2;
    }
    if(x2>max){
      max=x2;
    }
}

function planeBoxOverlap(normal, vert, maxbox){
  var q;

  var vmin = [];  //array size 3
  var vmax = [];
  var v;

  for(q=0;q<=2;q++)

  {

    v=vert[q];				
    if(normal[q]>0)
    {
      vmin[q]=-maxbox[q] - v;	
      vmax[q]= maxbox[q] - v;	
    }

    else
    {
      vmin[q]= maxbox[q] - v;	
      vmax[q]=-maxbox[q] - v;
    }

  }

  if(DOT(normal,vmin)>0)
  {
    return 0;
  }

  if(DOT(normal,vmax)>=0)
  {
    return 1;
  }

  return 0;

}

///////////////////
function AXISTEST_X01(a, b, fa, fb, p0, p2, v0, v2, min, max, rad, boxhalfsize)
{

  p0 = a*v0[1] - b*v0[2];
  p2 = a*v2[1] - b*v2[2];

  if(p0<p2){min=p0; max=p2;} else {min=p2; max=p0;}
  rad = fa * boxhalfsize[1] + fb * boxhalfsize[2];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_X01 early");
    // return 0;
  }
}

function AXISTEST_X2(a, b, fa, fb, p0, p1, v0, v1, min, max, rad, boxhalfsize)
{
  p0 = a*v0[1] - b*v0[2];
  p1 = a*v1[1] - b*v1[2];

  if(p0<p1) {min=p0; max=p1;} else {min=p1; max=p0;}
  rad = fa * boxhalfsize[1] + fb * boxhalfsize[2];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_X2 early");
    return 0;
  }
}

//////////////////////
function AXISTEST_Y02(a, b, fa, fb, p0, p2, v0, v2, min, max, rad, boxhalfsize)
{
  p0 = -a*v0[0] + b*v0[2]; 
  p2 = -a*v2[0] + b*v2[2];

  if(p0<p2) {min=p0; max=p2;} else {min=p2; max=p0;}
  rad = fa * boxhalfsize[0] + fb * boxhalfsize[2];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_Y02 early");
    return 0;
  }
}


function AXISTEST_Y1(a, b, fa, fb, p0, p1, v0, v1, min, max, rad, boxhalfsize)
{
  p0 = -a*v0[0] + b*v0[2];
  p1 = -a*v1[0] + b*v1[2];

  if(p0<p1) {min=p0; max=p1;} else {min=p1; max=p0;}
  rad = fa * boxhalfsize[0] + fb * boxhalfsize[2];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_Y1 early");
    return 0;
  }
}

////////////////////

function AXISTEST_Z12(a, b, fa, fb, p1, p2, v1, v2, min, max, rad, boxhalfsize)
{
  p1 = a*v1[0] - b*v1[1];
  p2 = a*v2[0] - b*v2[1];

  if(p2<p1) {min=p2; max=p1;} else {min=p1; max=p2;}
  rad = fa * boxhalfsize[0] + fb * boxhalfsize[1];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_Z12 early");
    return 0;
  }
}


function AXISTEST_Z0(a, b, fa, fb, p0, p1, v0, v1, min, max, rad, boxhalfsize)
{
  p0 = a*v0[0] - b*v0[1];
  p1 = a*v1[0] - b*v1[1]; 

  if(p0<p1) {min=p0; max=p1;} else {min=p1; max=p0;}
  rad = fa * boxhalfsize[0] + fb * boxhalfsize[1];

  if(min>rad || max<-rad){
    // console.log("AXISTEST_Z0 early");
    return 0;
  }
}


//////////////////////

//triverts are in a matrix?? triverts[3][3]
function triBoxOverlap(boxcenter, boxhalfsize, triverts)
{
  // console.log(boxcenter, boxhalfsize, triverts);

   var v0 = [];
   var v1 = [];
   var v2 = [];

   var min; var max; 
   var p0; var p1; var p2; 
   var rad; 
   var fex; var fey; var fez;

   var normal = [];
   var e0 = [];
   var e1 = [];
   var e2 = [];

   v0 = SUB(triverts[0], boxcenter);
   v1 = SUB(triverts[1], boxcenter);
   v2 = SUB(triverts[2], boxcenter);

   /* compute triangle edges */

   e0 = SUB(v1, v0);
   e1 = SUB(v2, v1);
   e2 = SUB(v0, v2);

   /*  test the 9 tests first (this was faster) */

   fex = Math.abs(e0[0]);
   fey = Math.abs(e0[1]);
   fez = Math.abs(e0[2]);

   if(AXISTEST_X01(e0[2], e0[1], fez, fey, p0, p2, v0, v2, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Y02(e0[2], e0[0], fez, fex, p0, p2, v0, v2, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Z12(e0[1], e0[0], fey, fex, p1, p2, v1, v2, min, max, rad, boxhalfsize) == 0) return 0;


   fex = Math.abs(e1[0]);
   fey = Math.abs(e1[1]);
   fez = Math.abs(e1[2]);

   if(AXISTEST_X01(e1[2], e1[1], fez, fey, p0, p2, v0, v2, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Y02(e1[2], e1[0], fez, fex, p0, p2, v0, v2, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Z0(e1[1], e1[0], fey, fex, p0, p1, v0, v1, min, max, rad, boxhalfsize) == 0) return 0;


   fex = Math.abs(e2[0]);
   fey = Math.abs(e2[1]);
   fez = Math.abs(e2[2]);

   if(AXISTEST_X2(e2[2], e2[1], fez, fey, p0, p1, v0, v1, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Y1(e2[2], e2[0], fez, fex, p0, p1, v0, v1, min, max, rad, boxhalfsize) == 0) return 0;
   if(AXISTEST_Z12(e2[1], e2[0], fey, fex, p1, p2, v1, v2, min, max, rad, boxhalfsize) == 0) return 0;


   /*  first test overlap in the {x,y,z}-directions */
   /*  find min, max of the triangle each direction, and test for overlap in */
   /*  that direction -- this is equivalent to testing a minimal AABB around */
   /*  the triangle against the AABB */

   /* test in X-direction */
   FINDMINMAX(v0[0],v1[0],v2[0],min,max);
   if(min>boxhalfsize[0] || max<-boxhalfsize[0]){
    // console.log("x boxhalfsize early");
    return 0;
  }

   /* test in Y-direction */
   FINDMINMAX(v0[1],v1[1],v2[1],min,max);
   if(min>boxhalfsize[1] || max<-boxhalfsize[1]){
    // console.log("y boxhalfsize early");
    return 0;
  }

   /* test in Z-direction */
   FINDMINMAX(v0[2],v1[2],v2[2],min,max);
   if(min>boxhalfsize[2] || max<-boxhalfsize[2]){
    // console.log("z boxhalfsize early");
    return 0;
  }


   /*  test if the box intersects the plane of the triangle */
   /*  compute plane equation of triangle: normal*x+d=0 */

   normal = CROSS(e0,e1);
   if(!planeBoxOverlap(normal,v0,boxhalfsize)){
    // console.log("planeBoxOverlap early");
    return 0;
  }

    // console.log("~~~~~~~~~~~~~FOUND OVERLAP~~~~~~~~~~~");
   return 1; //return 1 if there is an overlap; return 0 if no overlap

}