const chat_area = document.querySelector('#chatArea');
let chat_user;
const chat_box = document.querySelector('#chat-input');

async function updateChat() {
	let conversation;
	chat_user = chat_area.getAttribute('data-chat-id');
	if (chat_user) conversation = await (await fetch(`/api/message/${chat_user}`)).json();
	else {
		chat_area.innerHTML = "No Enemy Yet";
		return;
	}

	conversation = conversation.reverse();
	// Clear previous chat
	chat_area.innerHTML = "";

	for (let msg of conversation) {
		let chatEl = document.createElement('li');
		// From enemy
		if (msg.from == chat_user) {
			chatEl.textContent = `ENEMY: ${msg.message}`;
			// chatEl.classList.add(/*class1, class2, class3*/);
		}
		// To enemy
		else {
			chatEl.textContent = `YOU: ${msg.message}`;
			// chatEl.classList.add(/*class1, class2, class3*/);
		}
		chat_area.appendChild(chatEl);
	}
}

async function postChat(event) {
	event.preventDefault();
	if (!chat_user) {
		alert('No enemy yet. Please wait for an enemy to join before chatting!');
		chat_box.value = "";
		return;
	}
	let message = chat_box.value;

	const response = await fetch("/api/message", {
		method: 'post',
		body: JSON.stringify({
			message,
			to: chat_user,
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		chat_box.value = "";
		updateChat();
	} else {
		alert(response.statusText);
	}
}

document.querySelector('#chat-form').addEventListener('submit', postChat);

updateChat();
setInterval(updateChat, 5 * 1000);