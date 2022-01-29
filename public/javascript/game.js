const target_input = document.querySelector('#target-input');


async function fireAtEnemy(event) {
	let coord = target_input.value.toUpperCase().time().replace(/ /g, '');
	let match = coord.match(/^[A-J][1-9][0]?$/m);
	if(!match) {
		alert('Invalid coordinate');
		return;
	}
}


document.querySelector('#target-btn').addEventListener('click', fireAtEnemy);