var browszilla = document.getElementById("browszilla");
let x = 0;
let y = 0;
let xSpeed = 2;
let ySpeed = 3;
let isPaused = false;

function animate() {
    if(!isPaused) {
        x += xSpeed;    //Increment position by speed
        y += ySpeed;    //Increment position by speed
        if (x + 50 > window.innerWidth || x < 0) { //Hit the wall of screen, reverse direction
            xSpeed = -xSpeed;
        }
        if (y + 50 > window.innerHeight || y < 0) {//Hit the wall of screen, reverse direction
            ySpeed = -ySpeed;
        }
        browszilla.style.left = x + "px"; //move Browszilla to the new position
        browszilla.style.top = y + "px";  //move Browszilla to the new position
    }
    requestAnimationFrame(animate);
}

$(window).on("load", animate);

$(window).on("click", function() {
    let leafs = getLeafElements(document.body);
    let index = Math.floor(Math.random() * leafs.length);
    //Destroy the node
    target = leafs[index].parentNode;
    runAfterDelay(shootLaser, 500);

    /********************************************************************
     *              Former implementation with entity pausing
     ********************************************************************/
    // isPaused = true;
    // if(isPaused) {
    //     //Get all leaf nodes and randomly select a target for destruction. Leaf children is updated every click
    //     let leafs = getLeafElements(document.body);
    //     let index = Math.floor(Math.random() * leafs.length);
    //     //Destroy the node
    //     target = leafs[index].parentNode;
    //     runAfterDelay(shootLaser, 500);
    // } else{
    //     clearEffects();
    //     isPaused = false;
    // }
    // isPaused = false;
    //Get all leaf nodes and randomly select a target for destruction. Leaf children is updated every click

})
// animate();