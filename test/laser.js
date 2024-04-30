const laserCanvas = document.getElementById('laser-canvas');
const laserctx = laserCanvas.getContext('2d');
const impactCanvas = document.getElementById('impact-canvas');
const impactctx = impactCanvas.getContext('2d');


const targetElement = document.getElementById('target-element');
// const targetElement = document.body;

let target;

const body = document.body;
const html = document.documentElement;

let isDrawing = false;
let startX, startY;

$(window).on("load", function() {
    updateCanvasSize(); //Update the canvas size to the size of body. This is where the lasers and browszilla sprite exist
    wrapChildrenInSpan(); //The laser only works for specific targets (cannot work on text nodes). Prepare the leaf nodes for destruction
});

/* TO-DO: Since the laser can be fired off in rapid succession without waiting for the previous target to be destroyed, 
 *        consider putting in a mechanism to prevent this behavior
 */
// $(window).on("click", function(e) {
//     if(isPaused) {
//         //Get all leaf nodes and randomly select a target for destruction. Leaf children is updated every click
//         let leafs = getLeafElements(document.body);
//         let index = Math.floor(Math.random() * leafs.length);
//         //Destroy the node
//         target = leafs[index].parentNode;
//         shootLaser();
//     }
// })

//Start drawing (Function is to be removed)
$(window).on("mousedown", function(e) {
    isDrawing = true;
    window.startX = e.offsetX;
    window.startY = e.offsetY;
})

//Move mouse to draw (function to be removed)
$(window).on("mousemove", function(e) {
    console.log("drawing");

    if (!isDrawing) return;
    updateLaserStrokeStyle(window.startX, window.startY, targetElement); //Create new gradient from mouse position to target element
    laserctx.beginPath();
    laserctx.lineWidth = 8;
    laserctx.lineCap = "round";
    laserctx.shadowColor = "#dbbd6b"; //yellowish white
    laserctx.shadowBlur = 10;
    laserctx.moveTo(window.startX, window.startY);
    laserctx.lineTo(e.offsetX, e.offsetY);
    laserctx.stroke();
})

//Disable drawing (function to be removed)
$(window).on("mouseup", function() {
    isDrawing = false;
})

//Update canvas size when resizing window (Note: resets canvas, including lasers and Browszilla i think? Browszilla should exist on its own canvas then)
$(window).on("resize", updateCanvasSize);


// Define animation variables
let currentTime = 0;
const animationDuration = 2000;
const segments = 15; //How many segment the animation should take place. Changes laser speed
const laserSize = 0.12 * browszilla.height; //can be either height or width of Browszilla, since browszilla.height===browszilla.width

function drawLaser(mousePos, targetPos, laserctx, impactctx) {
    const progress = currentTime / animationDuration;
    currentX = mousePos.x + (targetPos.x - mousePos.x) * progress;
    currentY = mousePos.y + (targetPos.y - mousePos.y) * progress;
    updateLaserStrokeStyle(mousePos.x, mousePos.y, targetPos.x, targetPos.y, laserctx); //Create new gradient from mouse position to target element. This will color the laser properly
    //Draw the laser
    laserctx.beginPath();
    laserctx.lineWidth = laserSize;
    laserctx.lineCap = "round";
    laserctx.shadowColor = "#dbbd6b"; //yellowish white
    laserctx.shadowBlur = 10;
    laserctx.moveTo(mousePos.x, mousePos.y);
    laserctx.lineTo(currentX, currentY);
    laserctx.stroke();

    if (progress < 1) {
        currentTime += animationDuration / segments;
        window.requestAnimationFrame(shootLaser);
    }
    else { //Laser has reached its destination
        //Draw the laser impact 
        var impactgrad = impactctx.createRadialGradient(targetPos.x, targetPos.y, laserSize, targetPos.x, targetPos.y, 2*laserSize); 
        impactgrad.addColorStop(0,"red");
        impactgrad.addColorStop(0.2,"orange");
        impactgrad.addColorStop(0.8,"white");
        impactgrad.addColorStop(0.9,"white");
        impactctx.beginPath();
        impactctx.fillStyle = impactgrad;
        impactctx.arc(targetPos.x, targetPos.y,2*laserSize,0, 2*Math.PI); //Draw impact circle
        impactctx.fill();
        
        destroyElement(target); 

        // setTimeout(() => {
        //     destroyElement(target); //Destroys the <span> containing the target node (which also destroys the target node)
        // }, "1000"); //Set a delay here to extend the amount of time a laser hits the target before the target is destroyed
        currentTime = 0; //Reset animation time for next laser
    }
}

function shootLaser() {
    //Clear existing lasers
    clearEffects();
    var browszillaPos = getBrowszillaPosition();
    var mousePos = getMousePosition();
    var targetPos = getTargetPos(target);
    // drawLaser(mousePos, targetPos, laserctx, impactctx);
    drawLaser(browszillaPos, targetPos, laserctx, impactctx);
    runAfterDelay(clearEffects, 1500); //Clear effects after shooting laser for 1.5 seconds
}

//Remove the element from DOM
/*POTENTIAL PROBLEM: WHEN CANVAS IS PART OF A SPAN, THE SPAN MAY BE DELETED AS IT IS TREATED AS A LEAF NODE, THUS DESTROYING THE CANVAS
     * WITH THE LASER. Fix: checked if the children of the span contains "canvas" */
function destroyElement(target) {
    //Check if target is a <body> or if the child of the target <span> is a <canvas> element. The target span is guaranteed to only have one child
    //Note: it might be necessary to check whether the <canvas> is specifically the canvas containing Browszilla utilities rather than all canvas' in general
    // (target.nodeName.toLowerCase() !== "body") && (target.childNodes[0].nodeName.toLowerCase() !== "canvas") original target bias
    if((!target.classList.contains("indestructible")) && !target.childNodes[0].classList.contains("indestructible")) {
        console.log("Destroying target: " + target + " Name: " + target.nodeName.toLowerCase());
        target.remove();
    }
}

//Runs a function after a delay
function runAfterDelay(funct, delay) {
    setTimeout( () => {
        funct();
    }, delay);
}

function wrapChildrenInSpan() {
    let leafs = getLeafElements(document.body);
    leafs.forEach(leaf => {
        let wrapper = document.createElement('span');
        
        leaf.parentNode.insertBefore(wrapper, leaf);
        wrapper.appendChild(leaf);
    });
}

/* For later: the starting position of the laser gradient should be the position of the Browszilla. Browszilla's position must be constantly
 * updated for this to work. Ending position of gradient is simply wherever the target HTML is*/
//Change this function to change the color of the laser
function updateLaserStrokeStyle(startX, startY, targetX, targetY, ctx) {
    var gradient = ctx.createLinearGradient(startX,startY,targetX,targetY);
    gradient.addColorStop(0,"#80ddf2"); //light blue
    gradient.addColorStop(0.3,"#7bf525"); //lime
    gradient.addColorStop(0.5,"#d6c911"); //yellow
    gradient.addColorStop(0.8,"#d67011"); //orange
    gradient.addColorStop(1,"#d63511"); //red/orange
    ctx.strokeStyle = gradient;
}

// Function to update canvas size based on target element
function updateCanvasSize() {

    console.log("Resizing Canvas");
    var windowSize = getWindowSize(); //returns an array with [width, height]
    impactCanvas.width = windowSize[0];
    impactCanvas.height = windowSize[1];
    laserCanvas.width = windowSize[0];   
    laserCanvas.height = windowSize[1];
}

function clearEffects() {
    clearCanvas(laserctx);
    clearCanvas(impactctx);
}
// Clear the canvas
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getChildren(parent) {
    let numChildren = parent.children.length;
    console.log(numChildren);
}

/* PROBLEM: WHEN SELECTING LEAF NODES, THE SPAN CONTAINING THE CANVAS MAY BE ACCIDENTALLY SELECTED. THIS WILL DESTROY THE LASER */
function getLeafElements(root) {
    //Convert HTMLCollections to Array
    let elements = Array.prototype.slice.call(root.getElementsByTagName("*"), 0);
    //Filter all elements without children or are text nodes
    let leafElements = elements.filter(function(elem) {
        return !elem.hasChildNodes() || 
                elem.childNodes.length === 1 && 
                elem.childNodes[0].nodeType === Node.TEXT_NODE || 
                elem.childNodes[0].nodeName.toLowerCase() !== 'canvas';
    });
    //Return array with children-less elements
    return leafElements;
}

//Gets current mouse position
function getMousePosition() {
    let mousePosition = {
        x: window.startX,
        y: window.startY
    }
    return mousePosition;
}

//The Browszilla's position is the top left of the bounding client rect. This may changed depending on the sprite used
//Somehow the laser's position doesn't always line up with the position of the Browszilla. Not sure how to fix this issue
function getBrowszillaPosition() {
    let browszillaRect = browszilla.getBoundingClientRect();
    let browszillaPosition = {
        // x: (browszillaRect.left + browszillaRect.right ) / 2.7, //These values are the relative eye position of Browszilla to the image
        // y: ((browszillaRect.top + browszillaRect.bottom ) / 3)  //These values are the relative eye position of Browszilla to the image
        x: browszillaRect.left + (0.3 * browszilla.width),
        y: browszillaRect.top + (0.22 * browszilla.height)  
    }
    return browszillaPosition;
}

//This returns the position of the target element (the center of the target)
function getTargetPos(target) {
    // Get bounding box (position) of target element for targetting
    let targetRect = target.getBoundingClientRect();

    var targetPos = {
        x: (targetRect.left + targetRect.right / 2),
        y: (targetRect.top + targetRect.bottom / 2)
    }
    return targetPos;
}

function getWindowSize() {
    //Width and height of body element (web page)
    var width = Math.max( body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth );
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    return [width,height];
}

// function createCanvas(width, height) {
//     //Create new canvas
//     var newcnvs = document.createElement("canvas");
//     newcnvs.width = width;
//     newcnvs.height = height;
//     newcnvs.ctx = newcnvs.getContext("2d");
//     return newcnvs;
// }

