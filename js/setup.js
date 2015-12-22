//setup.js 

//This file determines the size of the canvas.  I have made slight modifications
//to allow the user to choose the size of the canvas.

/////////////////////////////////////////////////////////////////////////////////

// # Raytracing
// Code modified from the Literate Raytracer
// https://github.com/tmcw/literate-raytracer

// # Setup modified to get rid of chunky pixels that were scaled
var c = document.getElementById('c');

/////////////////////create canvas size////////////////////////////////

function setup_canvas(width, height){
    // Get a context in order to generate a proper data array. We aren't going to
    // use traditional Canvas drawing functions like `fillRect` - instead this
    // raytracer will directly compute pixel data and then put it into an image.
    c.width = width;
    c.height = height;
    // c.style.cssText = 'width:' + (width * 2) + 'px;height:' + (height*2) + 'px';
    //declared as automatic global variables
    ctx = c.getContext('2d');
    data = ctx.getImageData(0, 0, width, height);
}

//disable button
function disableSizeButton(){
    document.getElementById("size_A").disabled = true;
    document.getElementById("size_B").disabled = true;
    document.getElementById("size_C").disabled = true;
    document.getElementById("size_D").disabled = true;
}


//set automatic globals
function size_A(){
    width = 160;
    height = 120;
    setup_canvas(width, height);
    disableSizeButton();
}

function size_B(){
    width = 320;
    height = 240;
    setup_canvas(width, height);
    disableSizeButton();
}

function size_C(){
    width = 640;
    height = 480;
    setup_canvas(width, height);
    disableSizeButton();
}

function size_D(){
    width = 960;
    height = 720;
    setup_canvas(width, height);
    disableSizeButton();
}







