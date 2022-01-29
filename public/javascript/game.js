const target_input = document.querySelector('#target-input');
const enemy_name_el = document.querySelector('#enemy-name');
const myBoardEl = document.querySelector('#game-player');
const enemyBoardEl = document.querySelector('#game-enemy');
const turnDisplay = document.querySelector('#turn-display');
// chat_area from chat.js is already in memory
var enemyBoard;
var myBoard;
var myTurn = false;
var myId;

async function fireAtEnemy(event) {
	if (!myTurn) {
		alert('It is not your turn yet!');
		return;
	}
	let coord = target_input.value.toUpperCase().trim().replace(/ /g, '');
	let match = coord.match(/^([A-J])([1-9][0]?)$/m);
	if (!match) {
		alert('Invalid coordinate');
		return;
	}
	// If you have already fired there
	let row = match[1].charCodeAt(0) - 65;
	let col = parseInt(match[2]) - 1;
	let prevShot = (enemyBoard.grid.shots[row] >> (col * 2)) & 0b11;
	if (prevShot & 0b01) {
		alert("You've already fired there!");
		return;
	} else if (prevShot & 0b10) {
		alert("You got a hit!");
	} else if (prevShot & 0b00) {
		alert("You missed!");
	}
	// Add the shot to the grid
	enemyBoard.grid.shots[row] |= (0b01 << (col * 2));
	const boardUpdate = await fetch(`/api/board/${enemyBoard.id}`, {
		method: 'put',
		body: JSON.stringify({
			grid: JSON.stringify(enemyBoard.grid)
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!boardUpdate.ok) {
		alert('Error updating board information.');
		return;
	}

	drawBoard(enemyBoard, enemyBoardEl, false);

	let gameDone = false;
	// Hard coded total number of hits to win
	if(enemyBoard.hits == 17) gameDone = true;

	const gameUpdate = await fetch(`/api/game/${document.location.pathname.split('/').pop()}`, {
		method: 'put',
		body: JSON.stringify({
			turn: enemyBoard.owner,
			isComplete: gameDone
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!gameUpdate.ok) {
		alert('Error updating game information.');
	}



	myTurn = !myTurn;
	target_input.value = 'ENEMY TURN';
	target_input.disabled = true;
	setTimeout(updateBoards, 5 * 1000);
}

function drawBoard(board, el, isMe) {
	board.hits = 0;
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let square = el.querySelector(`#${String.fromCharCode(65+i)}${j+1}`);
			let shot = (board.grid.shots[i] >> (j * 2)) & 0b11;
			// Miss
			if (shot == 0b01) {
				if (!square.classList.contains('bg-slate-400')) square.classList.add('bg-slate-400');
			}
			// Hit
			else if (shot == 0b11) {
				board.hits++;
				if (!square.classList.contains('bg-red-400')) square.classList.add('bg-red-400');
			}
			// Display my ships
			else if (shot == 0b10 && isMe) {
				if (!square.classList.contains('bg-green-400')) square.classList.add('bg-green-400');
			}
		}
	}
}


async function updateBoards() {
	let response = await fetch(`/api/game/${document.location.pathname.split('/').pop()}`);
	let data = await response.json();



	if (data.isComplete) {
		let winner = data.boards.find(board => board.owner != data.turn);
		alert(`This game is finished!\n${winner.user.user_name} has won!`);
		document.location.replace('/dashboard');
	}

	myId = data.user_id;
	myBoard = data.boards.find(board => board.owner == myId);
	// If neither board is yours, this game doesn't belong to you, so redirect back to dashboard
	if (!myBoard) {
		alert('You are not a part of this game!');
		document.location.replace('/dashboard');
	}
	enemyBoard = data.boards.find(board => board.owner != myBoard.owner);
	if (!enemyBoard) {
		// Try this function again until an enemy board is found
		setTimeout(updateBoards, 5 * 1000);
		return;
	}

	// Convert grids to their object
	myBoard.grid = JSON.parse(myBoard.grid);
	enemyBoard.grid = JSON.parse(enemyBoard.grid);
	// Set name and chat id for chat.js
	if (enemy_name_el.textContent == "No Enemy Yet") enemy_name_el.textContent = `${enemyBoard.user.user_name}'s Board`;
	if (chat_area.getAttribute('data-chat-id') != `${enemyBoard.owner}`) chat_area.setAttribute('data-chat-id', `${enemyBoard.owner}`);

	// Get boolean for if it's my turn
	myTurn = data.turn == myId;
	if (myTurn) {
		if (target_input.value == 'ENEMY TURN') target_input.value = '';
		target_input.setAttribute('placeholder', 'YOUR TURN');
		target_input.disabled = false;
	} else {
		target_input.value = 'ENEMY TURN';
		target_input.disabled = true;
		setTimeout(updateBoards, 5 * 1000);
	}

	// Draw enemy + player boards
	drawBoard(myBoard, myBoardEl, true);
	drawBoard(enemyBoard, enemyBoardEl, false);
}

updateBoards();
document.querySelector('#target-btn').addEventListener('click', fireAtEnemy);