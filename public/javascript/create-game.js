const carrierStart = document.querySelector('#carrier');
const carrierFlip = document.querySelector('#carrier-rotate');
const battleshipStart = document.querySelector('#battleship');
const battleshipFlip = document.querySelector('#battleship-rotate');
const cruiserStart = document.querySelector('#cruiser');
const cruiserFlip = document.querySelector('#cruiser-rotate');
const submarineStart = document.querySelector('#submarine');
const submarineFlip = document.querySelector('#submarine-rotate');
const destroyerStart = document.querySelector('#destroyer');
const destroyerFlip = document.querySelector('#destroyer-rotate');

function checkShip(str, length, flipped) {
	let ship = {
		valid: false
	}
	let match;
	// Check horizontal
	if (!flipped) match = str.match(new RegExp(`^([A-J])([1-${10-length+1}])$`, 'm'));
	// Check vertical
	else match = str.match(new RegExp(`^([A-${String.fromCharCode(74 - length + 1)}])([1-9][0]?)$`, 'm'));
	// Setup object if valid input
	if (match) {
		ship.valid = true;
		ship.letter = match[1];
		ship.number = parseInt(match[2]);
		ship.coord = match[0];
		ship.length = length;
		ship.flipped = flipped;
	}

	return ship;
}

function drawShip(ship, shouldDraw, shipName) {
	for (let i = 0; i < ship.length; i++) {
		let square;
		// Get the next grid coordinate
		if (!ship.flipped) {
			square = document.querySelector(`#${ship.letter}${ship.number + i}`);
		} else {
			square = document.querySelector(`#${String.fromCharCode(ship.letter.charCodeAt(0) + i)}${ship.number}`);
		}
		// Set the ship icon
		square.innerHTML = `<img src="/icons/${shipName}.png" alt="${shipName} icon"></img>`;
		// If it's already green, ships overlap
		if (square.classList.contains('bg-green-400')) return false;
		if (shouldDraw) square.classList.add('bg-green-400');
	}
	return true;
}

function resetGrid() {
	// Remove green background from each square
	for (let i = 0; i < 10; i++) {
		for (let j = 1; j <= 10; j++) {
			let square = document.querySelector(`#${String.fromCharCode(65 + i)}${j}`);
			if (square.classList.contains('bg-green-400')) square.classList.remove('bg-green-400');
		}
	}
}

function checkInputs(shouldDraw) {

	// Reset grid display
	resetGrid();

	// Sanitize input
	let carrierStr = carrierStart.value.toUpperCase().trim().replace(/ /g, '');
	let battleshipStr = battleshipStart.value.toUpperCase().trim().replace(/ /g, '');
	let cruiserStr = cruiserStart.value.toUpperCase().trim().replace(/ /g, '');
	let submarineStr = submarineStart.value.toUpperCase().trim().replace(/ /g, '');
	let destroyerStr = destroyerStart.value.toUpperCase().trim().replace(/ /g, '');

	// Check if the ship placements are valid
	let carrier = checkShip(carrierStr, 5, carrierFlip.checked);
	let battleship = checkShip(battleshipStr, 4, battleshipFlip.checked);
	let cruiser = checkShip(cruiserStr, 3, cruiserFlip.checked);
	let submarine = checkShip(submarineStr, 3, submarineFlip.checked);
	let destroyer = checkShip(destroyerStr, 2, destroyerFlip.checked);

	// If any are invalid, alert user
	if (!carrier.valid) {
		alert('Invalid Carrier location!');
		return;
	}
	if (!battleship.valid) {
		alert('Invalid Battleship location!');
		return;
	}
	if (!cruiser.valid) {
		alert('Invalid Cruiser location!');
		return;
	}
	if (!submarine.valid) {
		alert('Invalid Submarine location!');
		return;
	}
	if (!destroyer.valid) {
		alert('Invalid Destroyer location!');
		return;
	}

	// All ships are valid, so we can draw them on the screen
	if (!drawShip(carrier, shouldDraw, 'carrier')) {
		alert('Your Carrier is overlapping another ship!');
		return;
	}
	if (!drawShip(battleship, shouldDraw, 'battleship')) {
		alert('Your Battleship is overlapping another ship!');
		return;
	}
	if (!drawShip(cruiser, shouldDraw, 'cruiser')) {
		alert('Your Cruiser is overlapping another ship!');
		return;
	}
	if (!drawShip(submarine, shouldDraw, 'submarine')) {
		alert('Your Submarine is overlapping another ship!');
		return;
	}
	if (!drawShip(destroyer, shouldDraw, 'destroyer')) {
		alert('Your Destroyer is overlapping another ship!');
		return;
	}

	// Return all ships
	return {
		carrier,
		battleship,
		cruiser,
		submarine,
		destroyer
	};
}

function generateBoard(ships) {
	// Going to use numbers to store firing data in groups of 2 bits (using 20 bits per row)
	let board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var ship in ships) {
		if (!ships[ship].flipped) {
			let i = ships[ship].letter.charCodeAt(0) - 65;
			for (let j = ships[ship].number - 1; j < ships[ship].number - 1 + ships[ship].length; j++) {
				board[i] += 2 << (j * 2);
			}
		} else {
			let j = ships[ship].number - 1;
			for (let i = ships[ship].letter.charCodeAt(0) - 65; i < ships[ship].letter.charCodeAt(0) - 65 + ships[ship].length; i++) {
				board[i] += 2 << (j * 2);
			}
		}
	}
	return board;
}

function generatePreview(event) {
	checkInputs(true);
}

async function createGame(event) {
	event.preventDefault();

	let ships = checkInputs(false);

	let game_id = null;
	// At this point we know the ships are all in valid locations, so we can create a game and board on database
	if (document.location.pathname == "/game/create") {
		const gameResponse = await fetch('/api/game/', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// Get game_id from the newly created game
		if (gameResponse.ok) {
			game_id = (await gameResponse.json()).id;
		} else {
			alert(`${gameResponse.status}: Error making a new game!`);
			return;
		}
	} else if (document.location.pathname.includes("/game/join/")) {
		game_id = document.location.pathname.split('/').pop();
	}
	else {
		alert('Unknown page or game id');
		return;
	}



	// Generate a board with ship data
	let board = generateBoard(ships);
	let grid = {
		carrier: {
			letter: ships.carrier.letter,
			number: ships.carrier.number,
			flipped: ships.carrier.flipped,
			length: ships.carrier.length
		},
		battleship: {
			letter: ships.battleship.letter,
			number: ships.battleship.number,
			flipped: ships.battleship.flipped,
			length: ships.battleship.length
		},
		cruiser: {
			letter: ships.cruiser.letter,
			number: ships.cruiser.number,
			flipped: ships.cruiser.flipped,
			length: ships.cruiser.length
		},
		submarine: {
			letter: ships.submarine.letter,
			number: ships.submarine.number,
			flipped: ships.submarine.flipped,
			length: ships.submarine.length
		},
		destroyer: {
			letter: ships.destroyer.letter,
			number: ships.destroyer.number,
			flipped: ships.destroyer.flipped,
			length: ships.destroyer.length
		},
		shots: board
	};

	// Create a board with the data
	const boardResponse = await fetch('/api/board/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			grid: JSON.stringify(grid),
			game_id
		})
	});

	// If board was created, go to game page for the new game
	if (boardResponse.ok) {
		document.location.replace(`/game/${game_id}`);
	} else {
		alert(`${boardResponse.status}: Error making a new board!`);
		// Delete the game we just made if we have an error making a board
		await fetch(`/api/game/${game_id}`, {
			method: 'delete'
		});
		return;
	}
}

document.querySelector('#board-form').addEventListener('submit', createGame);
document.querySelector('#preview-btn').addEventListener('click', generatePreview);