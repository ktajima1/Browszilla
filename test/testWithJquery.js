const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

const targetElement = document.getElementById('target-element');
// const targetElement = document.body;

const body = document.body;
const html = document.documentElement;

let isDrawing = false;
let startX, startY;

function wrapChildrenInSpan() {
    let leafs = getLeafElements(document.body);
    leafs.forEach(leaf => {
        let wrapper = document.createElement('span');
        
        leaf.parentNode.insertBefore(wrapper, leaf);
        wrapper.appendChild(leaf);
    });
}

$(window).on("load", function() {
    updateCanvasSize();
    getChildren(document.body);
    let leafs = getLeafElements(document.body);

    wrapChildrenInSpan();

    console.log(leafs.length);
    leafs.forEach(element => {
        console.log(element);
        console.log(element.parentNode);
    });
});

function getChildren(parent) {
    let numChildren = parent.children.length;
    console.log(numChildren);
}

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

$(window).on("mousedown", function(e) {
    console.log("hi");
    isDrawing = true;
    window.startX = e.offsetX;
    window.startY = e.offsetY;
    // clearCanvas();
})

/* For later: the starting position of the laser gradient should be the position of the Browszilla. Browszilla's position must be constantly
 * updated for this to work. Ending position of gradient is simply wherever the target HTML is*/
function updateLaserStrokeStyle(startX, startY, target) {
    var targetPos = getTargetPos(target);
    var gradient = ctx.createLinearGradient(startX,startY,targetPos.x, targetPos.y);
    gradient.addColorStop(0,"#80ddf2"); //light blue
    gradient.addColorStop(0.3,"#7bf525"); //lime
    gradient.addColorStop(0.5,"#d6c911"); //yellow
    gradient.addColorStop(0.8,"#d67011"); //orange
    gradient.addColorStop(1,"#d63511"); //red/orange
    ctx.strokeStyle = gradient;
}

//Gets current mouse position
function getMousePosition() {
    let mousePosition = {
        x: window.startX,
        y: window.startY
    }
    return mousePosition;
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


// Define animation variables
let currentTime = 0;
const animationDuration = 2000;
const laserSize = 20;

function shootLaser(target) {

    clearCanvas();
    var mousePos = getMousePosition();
    var targetPos = getTargetPos(target);
    const progress = currentTime / animationDuration;
    currentX = mousePos.x + (targetPos.x - mousePos.x) * progress;
    currentY = mousePos.y + (targetPos.y - mousePos.y) * progress;

    updateLaserStrokeStyle(window.startX, window.startY, target); //Create new gradient from mouse position to target element
    ctx.beginPath();
    ctx.lineWidth = laserSize;
    ctx.lineCap = "round";
    ctx.shadowColor = "#dbbd6b"; //yellowish white
    ctx.shadowBlur = 10;
    ctx.moveTo(mousePos.x, mousePos.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    if (progress < 1) {
        currentTime += 200;
        // window.requestAnimationFrame(shootLaser);
    }
    else {
        console.log("removed target: " + target);
        target.remove();
        //update leaf children list
        currentTime = 0;
    }
}

$(window).on("click", function(e) {
    let leafs = getLeafElements(document.body);
    let index = Math.floor(Math.random() * leafs.length);
    shootLaser(leafs[index].parentNode);
    
})

$(window).on("mousemove", function(e) {
    console.log("drawing");

    if (!isDrawing) return;
    updateLaserStrokeStyle(window.startX, window.startY, targetElement); //Create new gradient from mouse position to target element
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.shadowColor = "#dbbd6b"; //yellowish white
    ctx.shadowBlur = 10;
    ctx.moveTo(window.startX, window.startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
})

$(window).on("mouseup", function() {
    console.log("bye");
    isDrawing = false;
})

$(window).on("resize", updateCanvasSize);

// Function to update canvas size based on target element
function updateCanvasSize() {

    console.log("Resizing Canvas");
    var windowSize = getWindowSize(); //returns an array with [width, height]
    canvas.width = windowSize[0];   
    canvas.height = windowSize[1];
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

