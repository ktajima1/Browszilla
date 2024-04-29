// function hide(event) {
//   event.target.style.visibility
// }
// document.addEventListener("click", hide, false);
// window.onmouseover=function(event) {

//   if(event.target instanceof HTMLDivElement) {
//     console.log("Hello");
//     if(window.getComputedStyle(event.target).visibility === "visible") {
//       console.log("Hi");
//       event.target.style.visibility = "hidden";
//     }
//     else if(window.getComputedStyle(event.target).visibility === "hidden") {
//       console.log("Shazam!");
//       event.target.style.visibility = "visible";
//     }
   
//   }

// };

window.onclick = function(event) {
  if (window.getComputedStyle(event.target).visibility === "visible") {
    console.log("Hi");
    event.target.style.visibility = "hidden";
  }
  if (window.getComputedStyle(event.target).visibility === "hidden") {
    console.log("Shazam!");
    event.target.style.visibility = "visible";
  }
};

// window.onclick = function(event) {
//   if (window.getComputedStyle(event.target).visibility === "hidden") {
//     console.log("Shazam!");
//     event.target.style.visibility = "visible";
//   }
// };