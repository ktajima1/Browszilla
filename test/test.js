const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// const targetElement = document.getElementById('target-element');
// const targetElement = document.body;

const body = document.body;
const html = document.documentElement;

let isDrawing = false;
let startX, startY;

// Get bounding box of target element for reference
// const targetRect = targetElement.getBoundingClientRect();

// Function to update canvas size based on target element
function updateCanvasSize() {
    // //Setting the size of canvas to target element
    // canvas.width = targetRect.width;
    // canvas.height = targetRect.height;

    // //To set the size of canvas as body element
    console.log("Resizing Canvas");
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight );
    var width = Math.max( body.scrollWidth, body.offsetWidth,
                            html.clientWidth, html.scrollWidth, html.offsetWidth );
    
    canvas.width = width;   
    canvas.height = height;

    // ctx.fillStyle ='black';
    // ctx.fillRect(10,0,canvas.height,canvas.width);
}

window.addEventListener("load", function() {
    alert("hi");
    //Initial Canvas update
    updateCanvasSize();
    // document.body.style.background = "red";
})

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle mouse down event (start drawing)
window.addEventListener('mousedown', (e) => {
    console.log("hi");
  isDrawing = true;
  window.startX = e.offsetX;
  window.startY = e.offsetY;
//   clearCanvas();
});

// Handle mouse move event (update line)
window.addEventListener('mousemove', (e) => {
    console.log("drawing");
  if (!isDrawing) return;
  console.log("drawing2");
  ctx.beginPath();
  ctx.strokeStyle = 'black'; // Change color as needed
  ctx.moveTo(window.startX, window.startY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
    // ctx.beginPath();
    // ctx.strokeStyle = "blue";
    // ctx.moveTo(20, 20);
    // ctx.lineTo(200, 20);
    // ctx.stroke();
});

// Handle mouse up/out event (stop drawing)
window.addEventListener('mouseup', () => {
    console.log("bye");
  isDrawing = false;
});

// Update canvas size on window resize
window.addEventListener('resize', updateCanvasSize);

// // Call updateCanvasSize initially
