/* ----------------------------------------- HTML DOM ----------------------------------------- */

const board = document.getElementById("board") // Get 'board' element from HTML
const genMessage = document.getElementById("gen-message")
const titleMessage = document.getElementById("title-message")
const winMessage = document.getElementById("win-message")
const buttonsWrap = document.getElementById("buttons-wrapper") // Get 'board' element from HTML
const welcomePage = document.getElementById("welcome-page")
/* ----------------------------------------- VARIABLES ----------------------------------------- */

const boardSize = 7 // Declare Board Size
const playerBoard = []

let shipLocation = []

// Holds the data of the players and the game
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

            if (numPosition === 0) { // If random position returns 0 (TOP)
                shipLocation = shipPositionTop(num) // Gets the ship's location in an array of three numbers 
            } else if (numPosition === 1) { // If random position returns 1 (MIDDLE)
                shipLocation = shipPositionMidV(num) // Gets the ship's location in an array of three numbers 
            } else if (numPosition === 2) { // If random position returns 2 (BOTTOM)
                shipLocation = shipPositionBottom(num) // Gets the ship's location in an array of three numbers 
            }
        }
    }
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
    gameData[0]['Name'] = document.getElementById("enter-names").nameP1.value
    gameData[1]['Name'] = document.getElementById("enter-names").nameP2.value
    
    document.getElementById('welcome-page').classList.toggle('hidden') // Hides welcome page

    cells.forEach((cell) => {
        cell.classList.toggle('hidden') // Unhides game board
    })

    document.getElementById('rotate-ship-btn').classList.toggle('hidden') // Unhides rotate-ship-btn

    // Displays instruction texts
    genMessage.textContent = gameData[0]['Name'] + "'s turn"
    titleMessage.textContent = "PLACE YOUR SHIP"
}

let cachedListeners = []; // Stores event listeners temporarily

/* ----------------------------------------- PLACING SHIPS ----------------------------------------- */

let shipOrientation = 0 // Ship orientation: 0 = horizontal; 1 = vertical
let indices = [] // Stores current selected index placement from user input

// When a click is triggered on the cells
function placeShip () {
    gameData[turn]['Ship Location'] = indices // Stores the selected indices into the current players game data

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
        cells[i].classList.toggle('placedShip')
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
        cells[i].classList.toggle('placedShip')
    }

    placeShipAddEventListeners() // Enables the hover and click functionality

    // Hides / unhides buttons
    document.getElementById('rotate-ship-btn').classList.toggle('hidden')   
    document.getElementById('confirm-ship-btn').classList.toggle('hidden')
    document.getElementById('reset-ship-btn').classList.toggle('hidden')

    // Removes highlights from previously selected cells
    for (i of gameData[turn]['Ship Location']) {
        cells[i].classList.toggle('highlightShip')
    }
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

// Identifies the highlighted ships on hover
function placeShipHover (index) {

    // If orientation is horizontal
    if (shipOrientation === 0) {
        // If hovered cell is on the leftmost column
        if (index % boardSize === 0) { 
            indices = shipPositionLeft (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        } 
        // If hovered cell is on the rightmost column
        else if (index % boardSize === boardSize - 1) { 
            indices = shipPositionRight (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        } 
        // If hovered cell is in the middle
        else {
            indices = shipPositionMidH (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        }
    } 
    // If orientation is horizontal
    else if (shipOrientation === 1) {
        // If hovered cell is on the top row
        if (index < boardSize) {
            indices = shipPositionTop (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        } 
        // If hovered cell is on the bottom row
        else if (index >= boardSize * (boardSize - 1)) {
            indices = shipPositionBottom (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        } 
        // If hovered cell is in the middle
        else {
            indices = shipPositionMidV (index) // Gets the indices 
            highlightShip (indices) // Sends the indices for highlights
        }
    }
    
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

    cells.forEach((cell) => {
        const handler = () => placeShip();
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
        genMessage.textContent = gameData[1]['Name'] + "'s turn" // Replaces name to current player
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
    genMessage.textContent = gameData[turn]['Name'] + "'s turn" // Displays current player's turn
    titleMessage.textContent = "SELECT YOUR TARGET" // Displays the instructions
}

// Validates the user input after a click event
function checkUserInput (cell, index) {
    gameData[turn]['Player Board'].push(index) // Appends the index of the clicked cell and saves it in the playerBoard
    const enemy = turn === 0 ? 1 : 0 // Enemy = !turn
    const hit = gameData[enemy]['Ship Location'].includes(index) // Identifies if it's a hit or miss

    if (hit) {
        cell.classList.add("hit") // Adds CSS styling if input is a hit
    } else {
        cell.classList.add("miss") // Adds CSS styling if input is a miss
    }
    
    // If all 3 cells have been hit
    if (gameData[enemy]['Ship Location'].every( x => gameData[turn]['Player Board'].includes(x))) {
        winMessage.innerHTML = gameData[enemy]['Name'] +"'s ship has fallen. <br>" + gameData[turn]['Name'] + " wins." // Display victory message
        gameOver()
    } 
    // Else it's a hit
    else if (hit) {
        winMessage.innerHTML = "You hit the " + gameData[enemy]['Name'] + "'s ship.<br> Your turn again." // Displays hit message
        cell.classList.remove('active-cell') // Disables hover effect on the selected cell
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
    genMessage.textContent = gameData[turn]['Name'] + "'s turn"  // Display's current player's turn

    // Displays the progress of the current player's board
    for (item of gameData[turn]['Player Board']) {
        const state = gameData[enemy]['Ship Location'].includes(item) ? 'hit' : 'miss'
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
        if (gameData[turn]['Player Board'].includes(index)) { 
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

