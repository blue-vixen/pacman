'use strict'
const PACMAN = '<img id="pacman" src="images/pacman.png">'
// style="transform: rotate(90deg)"
var gPacman;
function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false,
        angle: "rotate(0deg)"
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}
function movePacman(ev) {
    // console.log(gFoodCreated, 'created');
    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(ev)

    if (!nextLocation) return;
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell);

    if (nextCell === WALL) return;
    if (nextCell === PWRFOOD) {
        if (gPacman.isSuper) return;
        updateScore(1);
        gFoodEaten++;
        // console.log(gFoodEaten);
        startSuperMode()
    }
    if (nextCell === CHERRY) {
        updateScore(10);

    }
    if (nextCell === FOOD) {
        updateScore(1);
        gFoodEaten++;
        // console.log(gFoodEaten);
    } else if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            eatGhost(nextLocation);
        } else {
            gameOver();
            renderCell(gPacman.location, EMPTY);
            return;
        }
    }
    if (gFoodEaten === gFoodCreated) {
        gVictory = true;
        gameOver();
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // update the dom
    renderCell(gPacman.location, EMPTY);

    gPacman.location = nextLocation;

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom

    renderCell(gPacman.location, PACMAN);
    var currPacman = document.getElementById("pacman");
    // console.log(currPacman);
    // currPacman.style.border = "1px solid white";
    currPacman.style.transform = gPacman.angle;
    // currPacman.style.display = "none";
    // console.log(document.querySelector(".pacman"))

}


function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            gPacman.angle = "rotate(-90deg)"
            break;
        case 'ArrowDown':
            nextLocation.i++;
            gPacman.angle = "rotate(90deg)"
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            gPacman.angle = "scaleX(-1)";
            break;
        case 'ArrowRight':
            nextLocation.j++;
            gPacman.angle = "rotate(0deg)"
            break;
        default:
            return null;
    }
    return nextLocation;
}


function eatGhost(nextLocation) {
    var currGhostIdx = 0;
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i && gGhosts[i].location.j === nextLocation.j) {
            currGhostIdx = i;
            break;
        }
    }
    var currGhost = gGhosts.splice(currGhostIdx, 1);
    // console.log(currGhost);
    gGhostsEaten.push(...currGhost);

    // console.log('ghosts eaten', gGhostsEaten);

}


function startSuperMode() {
    gPacman.isSuper = true;
    for (var i = 0; i < gGhosts.length; i++) {
        gGhosts[i].originalColor = gGhosts[i].color;
        // console.log(gGhosts[i].originalColor);
        gGhosts[i].color = "blue";
        // console.log(gGhosts[i]);
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
    gSuperTimeout = setTimeout(endSuperMode, 5000);
}

function endSuperMode() {
    clearTimeout(gSuperTimeout);
    gPacman.isSuper = false;
    // console.log('Not super...')
    if (!gGhostsEaten.length) return;
    for (var i = 0; i < gGhostsEaten.length; i++) {
        var currGhost = gGhostsEaten[i];
        gGhosts.push(currGhost);
    }
    // console.log('gGhosts', gGhosts);
    for (var i = 0; i < gGhosts.length; i++) {
        gGhosts[i].color = gGhosts[i].originalColor;
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]));
    }
    gGhostsEaten = [];

}