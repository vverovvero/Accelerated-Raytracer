//objectNormal.js was a base file given for CPSC 478 Assignment 6.  
//I have not modified this file since that assignment.

// for Assign 6
// Compute normal of object

function objectNormal(object, point){

	if (object.type == 'sphere') return (sphereNormal (object, point));

	if (object.type == 'spheretex'){
		var newnorm = Vector.subtract(point, object.point);
		// angle to vertical is theta
		newnorm=Vector.unitVector(newnorm);
		diff = Math.cos(20*3.14159*Math.abs(point.y - object.point.y)/object.radius)
		newnorm.y += .2*diff;
		newnorm= Vector.unitVector(newnorm);
		return (newnorm);
	};

	//spherelong: nudge the normal along angle
	//need to nudge both x and z?
	if (object.type == 'spherelong'){
		var newnorm = Vector.subtract(point, object.point);
		newnorm=Vector.unitVector(newnorm);

		var den = Math.sin(Math.acos(newnorm.y));
		var frac = newnorm.x/den;
		var angle = Math.acos(frac);

		var diff = Math.cos(10*3.14159*angle);
		newnorm.x += .2*diff;
		newnorm.z += .2 * diff;
		
		newnorm= Vector.unitVector(newnorm);

		return (newnorm);
	};

	if (object.type == 'triangle') return (triNormal(object));

}
