/* ----------------------------------------- HTML DOM ----------------------------------------- */

const board = document.getElementById("board") // Get 'board' element from HTML
const genMessage = document.getElementById("gen-message")
const buttonsWrap = document.getElementById("buttons-wrapper") // Get 'board' element from HTML
const welcomePage = document.getElementById("welcome-page")
/* ----------------------------------------- VARIABLES ----------------------------------------- */

const boardSize = 5 // Declare Board Size
const playerBoard = []

let shipLocation = []

const gameData = [
    {
        'Player': 1,
        'Name': "",
        'Ship Location': [],
        'Player Board': []
    }, {
        'Player': 2,
        'Name': "",
        'Ship Location': [],
        'Player Board': []
    }
]

let turn = 0

/* ----------------------------------------- FUNCTIONS ----------------------------------------- */

function shipPositionLeft (num) {
    // Returns array of the ship position at num and 2 cells right of num
    return [num, num + 1, num + 2] 
}

function shipPositionMidH (num) {
    return [num - 1, num, num + 1] 
}

function shipPositionRight (num) {
    // Returns array of the ship position at num and 2 cells left of num
    return [num, num - 1, num - 2]
}

function shipPositionTop (num) {
    // Returns array of the ship position at num and 2 cells below num
    return [num, num + boardSize, num + (boardSize * 2)]
}

function shipPositionMidV (num) {
    return [num - boardSize, num, num + boardSize] 
}

function shipPositionBottom (num) {
    // Returns array of the ship position at num and 2 cells above of num
    return [num, num - boardSize, num - (boardSize * 2)]
}

/* --------------------------------------- PLAYER VS COMPUTER ------------------------------------- */
// Random computer-generated battleship 
function createBattleship () {
    const direction = Math.round(Math.random() * (1)) // Generates direction: 0 = Horizontal, 1 = Vertical
    const num = Math.round(Math.random() * ((boardSize ** 2)- 1)) // Generates Battleship Cell Position

    // If direction is horizontal
    if (direction === 0) {

        // If num's position is on the leftmost side
        if (num % boardSize === 0) {
            shipLocation = shipPositionLeft(num) // Ship location is at num and 2 cells right of num
        }

        // If num's position is on the rightmost side
        else if (num % boardSize === boardSize - 1) {
            shipLocation = shipPositionRight(num) // Ship location is at num and 2 cells left of num
        }

        // Else if num's position is not on the edges of the board
        else {
            // Generate the position of num in 1x3 ship: 0 = Left; 1 = Middle; 2 = Right
            let numPosition
            
            if (num % boardSize === 1) {
                numPosition = Math.round(Math.random() * 1) // Excludes Right (2) option if num is positioned in the second column
            } else if (num % boardSize === boardSize - 2) {
                numPosition = Math.round(Math.random() * 1) + 1 // Excludes Left (0) option if num is positioned in the second rightmost column
            } else {
                numPosition = Math.round(Math.random() * 2) // Generate the position of num in 1x3 ship: 0 = Left; 1 = Middle; 2 = Right
            }

            console.log("NumPosition: " + numPosition)
            if (numPosition === 0) { // If random position returns 0 (LEFT)
                shipLocation = shipPositionLeft(num) // Gets the ship's location in an array of three numbers 
            } else if (numPosition === 1) { // If random position returns 1 (MIDDLE)
                shipLocation = shipPositionMidH(num)// Gets the ship's location in an array of three numbers 
            } else if (numPosition === 2) { // If random postition returns 2 (RIGHT)
                shipLocation = shipPositionRight(num) // Gets the ship's location in an array of three numbers 
            }
        }
    } else if (direction === 1) { // If direction is vertical
        // If num's position is on the top row
        if (num < boardSize) {
            shipLocation = shipPositionTop(num) // Ship location is at num and 2 cells below num
        }
        // If num's position is on the bottom
        else if (num >= boardSize * (boardSize - 1)) {
            shipLocation = shipPositionBottom(num) // Ship location is at num and 2 cells above num
        }
        else {
            // Generate the position of num in 1x3 ship: 0 = Top; 1 = Middle; 2 = Bottom
            let numPosition
            
            if (num < boardSize * 2) {
                numPosition = Math.round(Math.random() * 1) // Excludes Bottom (2) option if num is positioned in the second topmost row
            } else if (num >= boardSize * (boardSize - 2)) {
                numPosition = Math.round(Math.random() * 1) + 1 // Excludes Top (0) option if num is positioned in the second bottommost row
            } else {
                numPosition = Math.round(Math.random() * 2) // Generate the position of num in 1x3 ship: 0 = Top; 1 = Middle; 2 = Bottom
            }

            console.log("NumPosition: " + numPosition)
            if (numPosition === 0) { // If random position returns 0 (TOP)
                shipLocation = shipPositionTop(num) // Gets the ship's location in an array of three numbers 
            } else if (numPosition === 1) { // If random position returns 1 (MIDDLE)
                shipLocation = shipPositionMidV(num) // Gets the ship's location in an array of three numbers 
            } else if (numPosition === 2) { // If random position returns 2 (BOTTOM)
                shipLocation = shipPositionBottom(num) // Gets the ship's location in an array of three numbers 
            }
        }
    }

    console.log("Num: " + num)
    console.log("Direction: " + direction)
    console.log("Ship Location: " + shipLocation)
}

/* ----------------------------------------- DISPLAY HTML ----------------------------------------- */

// Finds and return the string of columns for "grid-template-columns" property 
function findColumnSize () {
    let columnSize = ""
    for (i = 0; i < boardSize; i++) {
        i > 0 ? columnSize += " ": null
        columnSize += "1fr"
    }
    return columnSize
}
// Displays the battleship board
function displayBoard () {
    const columnSize = findColumnSize() // Get column size for below
    board.style.setProperty("grid-template-columns", columnSize)

    // Displays the cells for the board based on boardSize variable
    for (i = 0; i < boardSize**2; i++) {
        const cell = document.createElement("div");
        cell.innerHTML = `
            <div class="cell hidden">${i}</div>
        `
        board.appendChild(cell)
    }
}

displayBoard()
const cells = document.querySelectorAll(".cell") // Get all cells on the board

/* ---------------------------------------- WELCOME PAGE --------------------------------------------- */


function startGame () {
    gameData[0]['Name'] = document.getElementById("enter-names").nameP1.value
    gameData[1]['Name'] = document.getElementById("enter-names").nameP2.value
    
    document.getElementById('welcome-page').classList.toggle('hidden')

    cells.forEach((cell) => {
        cell.classList.toggle('hidden')
    })

    document.getElementById('rotate-ship-btn').classList.toggle('hidden')

    genMessage.textContent = gameData[0]['Name'] + "'s turn to place your battleship."
}

let cachedListeners = [];

/* ----------------------------------------- PLACING SHIPS ----------------------------------------- */

let shipOrientation = 0
let indices = []

function placeShip () {
    gameData[turn]['Ship Location'] = indices

    const events = ['click', 'mouseover', 'mouseout']
    for (e of events) {
        cachedListeners.forEach(({ element, handler }) => {
            element.removeEventListener(e, handler);
        });
    }
    cachedListeners = []

    document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
    document.getElementById('confirm-ship-btn').classList.toggle('hidden')
    console.log("Player " + gameData[turn]['Player'] + ": " + gameData[turn]['Ship Location'])
}

function rotateShip () {
    shipOrientation === 1 ? shipOrientation = 0 : shipOrientation = 1
}

function highlightShip (indices) {
    for (i of indices) {
        cells[i].classList.toggle('highlightShip')
    }
}

function placeShipHover (cell, index) {

    if (shipOrientation === 0) {
        if (index % boardSize === 0) {
            indices = shipPositionLeft (index)
            highlightShip (indices)
        } else if (index % boardSize === boardSize - 1) {
            indices = shipPositionRight (index)
            highlightShip (indices)
        } else {
            indices = shipPositionMidH (index)
            highlightShip (indices)
        }
    } else if (shipOrientation === 1) {
        if (index < boardSize) {
            indices = shipPositionTop (index)
            highlightShip (indices)
        } else if (index >= boardSize * (boardSize - 1)) {
            indices = shipPositionBottom (index)
            highlightShip (indices)
        } else {
            indices = shipPositionMidV (index)
            highlightShip (indices)
        }
    }
    
}

function placeShipAddEventListeners() {
    cells.forEach((cell, index) => {
        const handler = () => placeShipHover(cell, index);
        cell.addEventListener('mouseover', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })

    cells.forEach((cell, index) => {
        const handler = () => placeShipHover(cell, index);
        cell.addEventListener('mouseout', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })

    cells.forEach((cell) => {
        const handler = () => placeShip();
        cell.addEventListener('click', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })
}

function nextPlayerPlaceShip() {
    if (turn === 0) {
        cells.forEach((cell) => cell.classList.remove('highlightShip'))
        placeShipAddEventListeners()
        document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
        document.getElementById('confirm-ship-btn').classList.toggle('hidden')
        turn = 1
        shipOrientation = 0

        genMessage.textContent = gameData[1]['Name'] + "'s turn to place your battleship"
    } else {
        cells.forEach((cell) => cell.classList.remove('highlightShip'))
        document.getElementById('confirm-ship-btn').classList.toggle('hidden')
        turn = 0
        gameplay()
    }
}

placeShipAddEventListeners()

/* ----------------------------------------- GAMEPLAY ----------------------------------------- */

function gameplay () {
    cellsAddEventListener ()
    genMessage.textContent = gameData[turn]['Name'] + "'s turn" 
}

// Validates the user input after a click event
function checkUserInput (cell, index) {
    console.log(index)
    gameData[turn]['Player Board'].push(index) // Appends the index of the clicked cell and saves it in the playerBoard
    const enemy = turn === 0 ? 1 : 0
    const hit = gameData[enemy]['Ship Location'].includes(index)

    if (hit) {
        cell.classList.add("hit") // Adds CSS styling if input is a hit
    } else {
        cell.classList.add("miss") // Adds CSS styling if input is a miss
    }
    
    if (gameData[enemy]['Ship Location'].every( x => gameData[turn]['Player Board'].includes(x))) {
        document.getElementById("win-message").textContent = "YOU HAVE SUNK " + gameData[enemy]['Name'] +"'S SHIP" // Display victory message
        gameOver()
    } else if (hit) {
        genMessage.textContent = gameData[turn]['Name'] + " hit " + gameData[enemy]['Name'] + "'s ship. It's still your turn."
        return
    } else {
        cachedListeners.forEach(({ element, handler }) => {
            element.removeEventListener('click', handler);
        });

        document.getElementById('confirm-turn-btn').classList.toggle('hidden')
    }

}

function nextPlayer () {
    turn = turn === 0 ? 1 : 0
    const enemy = turn === 0 ? 1 : 0    

    cells.forEach((cell) => {
        cell.classList.remove('hit')
        cell.classList.remove('miss')
    })

    cellsAddEventListener() 
    
    document.getElementById('confirm-turn-btn').classList.toggle('hidden')

    genMessage.textContent = gameData[turn]['Name'] + "'s turn" 

    for (item of gameData[turn]['Player Board']) {
        const state = gameData[enemy]['Ship Location'].includes(item) ? 'hit' : 'miss'
        cells[item].classList.add(state)
    }
}

function gameOver () {
    cachedListeners.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
    });

    document.getElementById('replay-btn').classList.toggle('hidden')
}

function cellsAddEventListener () {
    cells.forEach((cell, index) => {
        const handler = () => checkUserInput(cell, index);
        cell.addEventListener('click', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })
}

