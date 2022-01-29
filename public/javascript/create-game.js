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

function drawShip(ship, shouldDraw) {
	for (let i = 0; i < ship.length; i++) {
		let square;
		if (!ship.flipped) {
			square = document.querySelector(`#${ship.letter}${ship.number + i}`);
		} else {
			square = document.querySelector(`#${String.fromCharCode(ship.letter.charCodeAt(0) + i)}${ship.number}`);
		}
		if (square.classList.contains('bg-green-400')) return false;
		if (shouldDraw) square.classList.add('bg-green-400');
	}
	return true;
}

function resetGrid() {
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
	if (!drawShip(carrier, shouldDraw)) {
		alert('Your Carrier is overlapping another ship!');
		return;
	}
	if (!drawShip(battleship, shouldDraw)) {
		alert('Your Battleship is overlapping another ship!');
		return;
	}
	if (!drawShip(cruiser, shouldDraw)) {
		alert('Your Cruiser is overlapping another ship!');
		return;
	}
	if (!drawShip(submarine, shouldDraw)) {
		alert('Your Submarine is overlapping another ship!');
		return;
	}
	if (!drawShip(destroyer, shouldDraw)) {
		alert('Your Destroyer is overlapping another ship!');
		return;
	}

	return {
		carrier,
		battleship,
		cruiser,
		submarine,
		destroyer
	};
}

function generateBoard(ships) {
	let board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for(var ship in ships) {
		if(!ships[ship].flipped) {
			let i = ships[ship].letter.charCodeAt(0) - 65;
			for(let j = ships[ship].number - 1; j < ships[ship].number - 1 + ships[ship].length; j++) {
				board[i] += 2 << (j*2);
			}
		}
		else {
			let j = ships[ship].number - 1;
			for(let i = ships[ship].letter.charCodeAt(0) - 65; i < ships[ship].letter.charCodeAt(0) - 65 + ships[ship].length; i++) {
				board[i] += 2 << (j*2);
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

	// At this point we know the ships are all in valid locations, so we can create a game and board on database

	const gameResponse = await fetch('/api/game/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	let game_id = null;
	if(gameResponse.ok) {
		game_id = (await gameResponse.json()).id;
	}
	else {
		alert(`${gameResponse.status}: Error making a new game!`);
		return;
	}

	let board = generateBoard(ships);
	let grid = {
		carrier: {
			letter: ships.carrier.letter,
			number: ships.carrier.number,
			flipped: ships.carrier.flipped,
			length: ships.carrier.length
		},
		shots: board
	};
	
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

	if(boardResponse.ok) {
		document.location.replace(`/game/${(await boardResponse.json()).id}`);
	}
	else {
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