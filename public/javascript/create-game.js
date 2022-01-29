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
/*
const newGrid = {
	ships: [
		{
			row: null,
			col: null,
			length: 2,
			isSank: false,
			isHorizontal: true
		},
		{
			row: null,
			col: null,
			length: 3,
			isSank: false,
			isHorizontal: true
		},
		{
			row: null,
			col: null,
			length: 3,
			isSank: false,
			isHorizontal: true
		},
		{
			row: null,
			col: null,
			length: 4,
			isSank: false,
			isHorizontal: true
		},
		{
			row: null,
			col: null,
			length: 5,
			isSank: false,
			isHorizontal: true
		}
	],
	myGrid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	enemyGrid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
*/
// return str.match(/^[a-jA-J][1-9][0]?$/m);



async function createGame(event) {
	event.preventDefault();
}

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

function drawShip(ship) {
	for (let i = 0; i < ship.length; i++) {
		let square;
		if (!ship.flipped) {
			square = document.querySelector(`#${ship.letter}${ship.number + i}`);
		} else {
			square = document.querySelector(`#${String.fromCharCode(ship.letter.charCodeAt(0) + i)}${ship.number}`);
		}
		if(square.classList.contains('bg-green-400')) return false;
		square.classList.add('bg-green-400');
	}
	return true;
}

function resetPreview() {
	for(let i = 0; i < 10; i++) {
		for(let j = 1; j <= 10; j++) {
			let square = document.querySelector(`#${String.fromCharCode(65 + i)}${j}`);
			if(square.classList.contains('bg-green-400')) square.classList.remove('bg-green-400');
		}
	}
}

async function generatePreview(event) {
	
	// Clear all colored grids before checking
	resetPreview();

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
	if (!drawShip(carrier)) {
		alert('Your Carrier is overlapping another ship!');
		return;
	}
	if (!drawShip(battleship)) {
		alert('Your Battleship is overlapping another ship!');
		return;
	}
	if (!drawShip(cruiser)) {
		alert('Your Cruiser is overlapping another ship!');
		return;
	}
	if (!drawShip(submarine)) {
		alert('Your Submarine is overlapping another ship!');
		return;
	}
	if (!drawShip(destroyer)) {
		alert('Your Destroyer is overlapping another ship!');
		return;
	}
}

document.querySelector('#board-form').addEventListener('submit', createGame);
document.querySelector('#preview-btn').addEventListener('click', generatePreview);