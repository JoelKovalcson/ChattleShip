const joinListEl = document.querySelector('#joinList');
const joinArr = [];

async function joinGame(event) {
	let gameId = event.srcElement.id;
	
	const response = await fetch(`/api/game/join/${gameId}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'put'
	});

	if(!response.ok) {
		alert('Error joining that game!');
		document.location.reload();
		return;
	}
	else {
		document.location.replace(`/game/join/${gameId}`);
		return;
	}
}


for(let child of joinListEl.children) {
	child.firstElementChild.getElementsByTagName('button')[0].addEventListener('click', joinGame);
}