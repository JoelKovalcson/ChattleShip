const chat_box = document.querySelector('#chatArea');
const chat_user = chat_box.getAttribute('data-chat-id');

async function updateChat() {
	let conversation = await (await fetch(`/api/message/${chat_user}`)).json();
	conversation = conversation.reverse();
	// Clear previous chat
	chat_box.innerHTML = "";

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
		chat_box.appendChild(chatEl);
	}
}
// setInterval(updateChat, 10*1000);
updateChat();