'use strict'
const WALL = '<img class="wall" src="images/brick-wall.png">'
const FOOD = '&#127845;'
const EMPTY = ' ';
const PWRFOOD = '&#127844;';
const CHERRY = '&#127826;';

var gFoodCreated = 0;
var gFoodEaten = 0;
var gGhostsEaten = [];
var gVictory;
var gBoard;
var gSuperTimeout;
var gIntervalCherry;
var gGame = {
    score: 0,
    isOn: false
}
function init() {
    // console.log('hello')
    gFoodCreated = 0
    gFoodEaten = 0;
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    gGame.isOn = true;
    gVictory = false;
    // console.log(gBoard);
    gIntervalCherry = setInterval(placeRandomCherry, 15000);
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
            if (board[i][j] === FOOD) gFoodCreated++;
        }
    }
    gFoodCreated--
    board[1][1] = board[1][8] = board[8][8] = board[8][1] = PWRFOOD;
    return board;
}



function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score
}



function gameOver() {
    // console.log('Game Over');
    var victoryMsg = (!gVictory) ? 'LOST' : 'WON';
    var modal = document.querySelector('.modal');
    modal.classList.remove('hide');
    modal.querySelector('h1 span').innerHTML = victoryMsg;
    // console.log(modal);

    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gIntervalCherry);
}


function restart() {
    init();
    var modal = document.querySelector('.modal');
    modal.classList.add('hide');
    document.querySelector('h2 span').innerText = 0;
    gGhostsEaten = [];
}



function placeRandomCherry() {
    var emptyCells = getEmptyCells(gBoard);
    if (!emptyCells.length) return;
    var randomCell = emptyCells[getRandomInt(0, emptyCells.length)];
    // console.log(randomCell);

    //Update the model
    gBoard[randomCell.i][randomCell.j] = CHERRY;
    //Update the DOM (rendering a CHERRY)
    renderCell(randomCell, CHERRY);

    // console.log('Cherry time!');
}