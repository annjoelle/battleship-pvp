/* ----------------------------------------- HTML DOM ----------------------------------------- */

const board = document.getElementById("board") // Get 'board' element from HTML
const genMessage = document.getElementById("gen-message")
const titleMessage = document.getElementById("title-message")
const winMessage = document.getElementById("win-message")
const welcomePage = document.getElementById("welcome-page")
const gamePage = document.getElementById("game-page")
/* ----------------------------------------- VARIABLES ----------------------------------------- */

const boardSize = 7 // Declare Board Size

// Holds the data of the players and the game
const gameData = [
    {
        player: 1,
        name: "",
        shipLocation: [],
        playerBoard: []
    }, {
        player: 2,
        name: "",
        shipLocation: [],
        playerBoard: []
    }
]

let turn = 0 // Current turn

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

/* ----------------------------------------- DISPLAY BOARD ----------------------------------------- */

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
            <div class="cell hidden"></div>
        `
        board.appendChild(cell)
    }
}

displayBoard() // Generates the battleship board grid
const cells = document.querySelectorAll(".cell") // Get all cells on the board

/* ---------------------------------------- WELCOME PAGE --------------------------------------------- */

// start-game-btn on click opens the board for placing ships
function startGame () {
    // Retrieve player names
    gameData[0].name = document.getElementById("enter-names").nameP1.value
    gameData[1].name = document.getElementById("enter-names").nameP2.value
    
    welcomePage.classList.toggle('hidden') // Hides welcome page
    gamePage.classList.toggle('hidden') // Unhides game page

    cells.forEach((cell) => {
        cell.classList.toggle('hidden') // Unhides game board
    })

    document.getElementById('rotate-ship-btn').classList.toggle('hidden') // Unhides rotate-ship-btn

    // Displays instruction texts
    genMessage.textContent = gameData[0].name + "'s turn"
    titleMessage.textContent = "PLACE YOUR SHIP"
}

let cachedListeners = []; // Stores event listeners temporarily

/* ----------------------------------------- PLACING SHIPS ----------------------------------------- */

let shipOrientation = 0 // Ship orientation: 0 = horizontal; 1 = vertical
let indices = [] // Stores current selected index placement from user input

function computeShipIndices (index) {
    if (shipOrientation === 0) {
        // Horizontal
        if (index % boardSize === 0) {
            return shipPositionLeft(index)
        } else if (index % boardSize === boardSize - 1) {
            return shipPositionRight(index)
        } else {
            return shipPositionMidH(index)
        }
    } else {
        // Vertical
        if (index < boardSize) {
            return shipPositionTop(index)
        } else if (index >= boardSize * (boardSize - 1)) {
            return shipPositionBottom(index)
        } else {
            return shipPositionMidV(index)
        }
    }
}

// When a click/tap is triggered on a cell
function placeShip (index) {
    // Clear any leftover hover-preview highlight (desktop) before placing,
    // so we don't depend on a prior mouseover having fired (mobile has no hover)
    if (indices.length) {
        for (i of indices) {
            cells[i].classList.remove('highlightShip')
        }
    }

    // Compute placement fresh from the tapped/clicked cell - works identically
    // whether or not a hover event ran first
    indices = computeShipIndices(index)

    gameData[turn].shipLocation = indices // Stores the selected indices into the current players game data

    // Removes event listeners on cells (click & hover functions)
    const events = ['click', 'mouseover', 'mouseout']
    for (e of events) {
        cachedListeners.forEach(({ element, handler }) => {
            element.removeEventListener(e, handler);
        });
    }
    cachedListeners = []
    
    // Adds highlight colors to selected ship placement
    for (i of indices) {
        cells[i].classList.add('placedShip')
    }

    // Hides / unhides buttons
    document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
    document.getElementById('confirm-ship-btn').classList.toggle('hidden')
    document.getElementById('reset-ship-btn').classList.toggle('hidden')
}

// Clears the selected ship placement; triggered by reset-ship-btn on click
function resetShip () {
    // Clears the highlights for the previously selected cells
    for (i of indices) {
        cells[i].classList.remove('placedShip')
        cells[i].classList.remove('highlightShip')
    }

    placeShipAddEventListeners() // Enables the hover and click functionality

    // Hides / unhides buttons
    document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
    document.getElementById('confirm-ship-btn').classList.toggle('hidden')
    document.getElementById('reset-ship-btn').classList.toggle('hidden')

    indices = [] // Clear so a stray preview from a previous device state can't leak in
}

// Rotates the ship 90 degrees; triggered by rotate-ship-btn on click
function rotateShip () {
    shipOrientation === 1 ? shipOrientation = 0 : shipOrientation = 1
}

// Applies highlights to cells when hovered
function highlightShip (indices) {
    for (i of indices) {
        cells[i].classList.toggle('highlightShip')
    }
}

// Identifies the highlighted ships on hover (desktop preview only;
// placement itself no longer depends on this having run - see placeShip)
function placeShipHover (index) {
    indices = computeShipIndices(index) // Gets the indices
    highlightShip (indices) // Sends the indices for highlights
}

// Adds event listeners to cells for hover in and out and click events using handling method
function placeShipAddEventListeners() {
    cells.forEach((cell, index) => {
        const handler = () => placeShipHover(index);
        cell.addEventListener('mouseover', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })

    cells.forEach((cell, index) => {
        const handler = () => placeShipHover(index);
        cell.addEventListener('mouseout', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })

    cells.forEach((cell, index) => {
        const handler = () => placeShip(index);
        cell.addEventListener('click', handler);
        cachedListeners.push({ element: cell, handler: handler });
    })
}

// Next player's turn to place a ship or ends the placing ships stage and starts the gameplay
function nextPlayerPlaceShip() {
    // Removes highlights from previous players selected cells
    for (i of indices) {
        cells[i].classList.toggle('placedShip')
    }

    // If Player 1's turn was the last one
    if (turn === 0) {
        cells.forEach((cell) => cell.classList.remove('highlightShip')) // Removes highlights from cells
        placeShipAddEventListeners() // Activates event listeners
        
        // Hides / unhides buttons 
        document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
        document.getElementById('confirm-ship-btn').classList.toggle('hidden')
        document.getElementById('reset-ship-btn').classList.toggle('hidden')
        
        turn = 1 // Switches turn to Player 2
        shipOrientation = 0 // Resets ship rotation to default
        genMessage.textContent = gameData[1].name + "'s turn" // Replaces name to current player
    } 
    // If Player 2's turn was the last one
    else {
        cells.forEach((cell) => cell.classList.remove('highlightShip')) // Removes highlights from cells
        
        // Hides / unhides buttons 
        document.getElementById('confirm-ship-btn').classList.toggle('hidden')
        document.getElementById('reset-ship-btn').classList.toggle('hidden')

        turn = 0 // Switches turn to Player 1

        gameplay()
    }
}

placeShipAddEventListeners()

/* ----------------------------------------- GAMEPLAY ----------------------------------------- */

// Gameplay start function
function gameplay () {
    cellsAddEventListener () // Activates event listeners
    genMessage.textContent = gameData[turn].name + "'s turn" // Displays current player's turn
    titleMessage.textContent = "SELECT YOUR TARGET" // Displays the instructions
}

// Validates the user input after a click event
function checkUserInput (cell, index) {
    gameData[turn].playerBoard.push(index) // Appends the index of the clicked cell and saves it in the playerBoard
    const enemy = turn === 0 ? 1 : 0 // Enemy = !turn
    const hit = gameData[enemy].shipLocation.includes(index) // Identifies if it's a hit or miss

    if (hit) {
        cell.classList.add("hit") // Adds CSS styling if input is a hit
    } else {
        cell.classList.add("miss") // Adds CSS styling if input is a miss
    }
    
    // If all 3 cells have been hit
    if (gameData[enemy].shipLocation.every( x => gameData[turn].playerBoard.includes(x))) {
        winMessage.innerHTML = gameData[enemy].name +"'s ship has fallen. <br>" + gameData[turn].name + " wins." // Display victory message
        gameOver()
    } 
    // Else it's a hit
    else if (hit) {
        winMessage.innerHTML = "You hit the " + gameData[enemy].name + "'s ship.<br> Your turn again." // Displays hit message
        cell.classList.remove('active-cells') // Disables hover effect on the selected cell (was a typo: 'active-cell')
        return
    } 
    // If it's a miss
    else {
        // Disables click listener to all cells
        cachedListeners.forEach(({ element, handler }) => {
            element.removeEventListener('click', handler);
        });

        // Removes highlight from selected cell
        cells.forEach((cell, index) => {
            cell.classList.remove('active-cells')})

        document.getElementById('confirm-turn-btn').classList.toggle('hidden') // Shows end turn button
        winMessage.textContent = ""
    }

}

// Current player ends turn and next player starts
function nextPlayer () {
    const enemy = turn // enemy = last turn
    turn = turn === 0 ? 1 : 0 // new turn = !turn
    
    // Removes CSS styling for played cells from previous player
    cells.forEach((cell) => {
        cell.classList.remove('hit')
        cell.classList.remove('miss')
    })

    cellsAddEventListener() // Activated event listeners
    document.getElementById('confirm-turn-btn').classList.toggle('hidden') // Hides end turn button
    genMessage.textContent = gameData[turn].name + "'s turn"  // Display's current player's turn

    // Displays the progress of the current player's board
    for (item of gameData[turn].playerBoard) {
        const state = gameData[enemy].shipLocation.includes(item) ? 'hit' : 'miss'
        cells[item].classList.add(state)
    }
}

// End game
function gameOver () {
    // Removes all event listeners
    cachedListeners.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
    });

    document.getElementById('replay-btn').classList.toggle('hidden') // Shows play again button
}

// Adds event listeners to cell
function cellsAddEventListener () {
    cells.forEach((cell, index) => {
        // If the cell has been played in the previous turns, no event listener is added
        if (gameData[turn].playerBoard.includes(index)) { 
            return
        } 
        // Adds event listeners to unplayed cells
        else { 
            const handler = () => checkUserInput(cell, index);
            cell.addEventListener('click', handler);
            cachedListeners.push({ element: cell, handler: handler });

            cell.classList.toggle('active-cells') // Applies hover effect
        }
    })
}