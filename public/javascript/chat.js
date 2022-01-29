const chat_area = document.querySelector('#chatArea');
const chat_user = chat_area.getAttribute('data-chat-id');
const chat_box = document.querySelector('#chat-submit');

async function updateChat() {
	let conversation = await (await fetch(`/api/message/${chat_user}`)).json();
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

	if(response.ok) {
		chat_box.value = "";
		updateChat();
	}
	else {
		alert(response.statusText);
	}
}

document.querySelector('#chat-form').addEventListener('submit', postChat);

updateChat();
setInterval(updateChat, 10*1000);