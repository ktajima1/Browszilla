const laserCanvas = document.getElementById('laser-canvas');
const laserctx = laserCanvas.getContext('2d');
const impactCanvas = document.getElementById('impact-canvas');
const impactctx = impactCanvas.getContext('2d');

let laserTarget; //Target that is to be destroyed
let startX, startY;

$(window).on("load", function() {
    updateCanvasSize(); //Update the canvas size to the size of body. This is where the lasers and browszilla sprite exist
    wrapChildrenInSpan(); //The laser only works for specific targets (cannot work on text nodes). Prepare the leaf nodes for destruction
});

//Update canvas size when resizing window 
//Note: resets lasers (so that starting and ending positions are accurate)
$(window).on("resize", updateCanvasSize);

/* Define animation variables */
let currentTime = 0;
const animationDuration = 2000;
//How many segment the animation should take place. Changes laser speed
const segments = 15; 
//Size of laser is dependent on Browszilla's size. This can be either height or width of Browszilla, 
//since browszilla.height===browszilla.width
const laserSize = 0.12 * browszilla.height; 
/************************************************************************************************************
 *                  DRAWS LASER FROM STARTING POSITION TO ENDING POSITION
 ************************************************************************************************************/
function drawLaser(mousePos, targetPos, laserctx, impactctx) {
    //Progress is used to draw laser bit by bit rather than all at once
    const progress = currentTime / animationDuration;
    currentX = mousePos.x + (targetPos.x - mousePos.x) * progress;
    currentY = mousePos.y + (targetPos.y - mousePos.y) * progress;
    //Create new gradient from mouse position to target element. This will color the laser 
    updateLaserStrokeStyle(mousePos.x, mousePos.y, targetPos.x, targetPos.y, laserctx); 
    //Draw the laser segment
    laserctx.beginPath();
    laserctx.lineWidth = laserSize;
    laserctx.lineCap = "round";
    laserctx.shadowColor = "#dbbd6b"; //yellowish white
    laserctx.shadowBlur = 10;
    laserctx.moveTo(mousePos.x, mousePos.y);
    laserctx.lineTo(currentX, currentY);
    laserctx.stroke();

    if (progress < 1) { //Increase laser progress
        currentTime += animationDuration / segments;
        window.requestAnimationFrame(shootLaser);
    }
    else { //Laser has reached its destination
        currentTime = 0; //Reset animation time for next laser
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

        /* Destroys target with delay */
        // setTimeout(() => {
        //     destroyElement(target); //Destroys the <span> containing the target node (which also destroys the target node)
        // }, "1000"); //Set a delay here to extend the amount of time a laser hits the target before the target is destroyed

        /* Instantly destroys target without delay */
        destroyElement(laserTarget); 
    }
}

/************************************************************************************************************
 *                  SHOOTS LASERS FROM BROWSZILLA'S EYES
 ************************************************************************************************************/
function shootLaser() {
    //Clear existing lasers
    clearEffects();
    var browszillaPos = getBrowszillaPosition();
    var targetPos = getTargetPos(laserTarget);

    drawLaser(browszillaPos, targetPos, laserctx, impactctx);
    runAfterDelay(clearEffects, 1500); //Clear effects after shooting laser for 1.5 seconds
}

/************************************************************************************************************
 *                  DELETES TARGETTED ELEMENT FROM DOM
 ************************************************************************************************************/
function destroyElement(target) {
    //Check if target is a <body> or if the child of the target <span> is a <canvas> element. The target span is guaranteed to only have one child
    //Note: it might be necessary to check whether the <canvas> is specifically the canvas containing Browszilla utilities rather than all canvas' in general
    //Note: checking if the childNode (which could be a text node) has a class will throw a TypeError 
    console.log("Looking at: " + target.nodeName + " and " + target.childNodes[0].nodeName);
    if((!target.classList.contains("indestructible")) && (target.hasChildNodes() &&!target.childNodes[0].classList.contains("indestructible"))) {
        console.log("Destroying target: " + target + " Name: " + target.nodeName.toLowerCase());
        target.remove();
    }
}

/************************************************************************************************************
 *                  RUNS A FUNCTION AFTER A DELAY                
 ************************************************************************************************************/
function runAfterDelay(funct, delay) {
    setTimeout( () => {
        funct();
    }, delay);
}

/************************************************************************************************************
 *                  WRAPS LEAF NODES OF DOM IN A SPAN
 ************************************************************************************************************/
//The target mechanism is unable to find the position of text nodes so every leaf node is wrapped
//in a span to resolve this issue
function wrapChildrenInSpan() {
    let leafs = getLeafElements(document.body);
    leafs.forEach(leaf => {
        let wrapper = document.createElement('span');
        
        leaf.parentNode.insertBefore(wrapper, leaf);
        wrapper.appendChild(leaf);
    });
}

/************************************************************************************************************
 *                  CHANGES COLOR OF LASER
 ************************************************************************************************************/
//The laser's canvas gradient is positioned relative to the Browszilla. The gradient's color goes from Browszilla to the target element
//The colors of the laser gradient can be changed here
function updateLaserStrokeStyle(startX, startY, targetX, targetY, ctx) {
    var gradient = ctx.createLinearGradient(startX,startY,targetX,targetY); //create a linear gradient from Browszilla to the target element
    gradient.addColorStop(0,"#80ddf2"); //light blue
    gradient.addColorStop(0.3,"#7bf525"); //lime
    gradient.addColorStop(0.5,"#d6c911"); //yellow
    gradient.addColorStop(0.8,"#d67011"); //orange
    gradient.addColorStop(1,"#d63511"); //red/orange
    ctx.strokeStyle = gradient;
}

/************************************************************************************************************
 *                  CHANGES CANVAS SIZE TO CURRENT WINDOW SIZE
 ************************************************************************************************************/
function updateCanvasSize() {

    console.log("Resizing Canvas");
    var windowSize = getWindowSize(); //returns an array with [width, height]
    impactCanvas.width = windowSize[0];
    impactCanvas.height = windowSize[1];
    laserCanvas.width = windowSize[0];   
    laserCanvas.height = windowSize[1];
}

/************************************************************************************************************
 *                  CLEARS LASER AND LASER IMPACT CANVASES
 ************************************************************************************************************/
function clearEffects() {
    clearCanvas(laserctx);
    clearCanvas(impactctx);
}

//Helper function to clear specificed canvas
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
/************************************************************************************************************
 *                  STORES ALL LEAF NODES OF A DOM IN AN ARRAY
 ***********************************************************************************************************/
/* PROBLEM: Nodes that shouldn't be selected may be selected
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

//Returns current mouse position
function getMousePosition() {
    let mousePosition = {
        x: window.startX,
        y: window.startY
    }
    return mousePosition;
}

//Returns Browszilla's current position
//Note: When Browszilla is paused, the starting position of the laser may be different than expected
//Note: Improvement could be to shoot lasers from both eyes rather than just one
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

//Returns the position of the target element (the center of the target)
function getTargetPos(target) {
    // Get bounding box (position) of target element for targetting
    let targetRect = target.getBoundingClientRect();

    var targetPos = {
        x: (targetRect.left + targetRect.right / 2),
        y: (targetRect.top + targetRect.bottom / 2)
    }
    return targetPos;
}

//Returns the current size of the window
function getWindowSize() {
    //Width and height of body element (web page)
    var width = Math.max( body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth );
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    return [width,height];
}