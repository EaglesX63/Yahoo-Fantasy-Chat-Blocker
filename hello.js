function inputName() {
	chrome.storage.sync.get({"users": []}, function (value) {
		var oldList = value.users;
		console.log(oldList)
	})
}

function CheckAuthor(MessageNum) {
	var messageAuthor = document.querySelectorAll('.col2 .user-name')[MessageNum].getAttribute("title").split("(")[0].trim();

	if (messageAuthor.includes("Prucha Scott")) {
		document.querySelectorAll('.ci-item-content')[MessageNum]
		var authorMessagesLength = document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message').length;
		for (let i = 0; i <= authorMessagesLength-1; i++) {
			document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message')[i].parentElement.parentElement.classList.add("blocked-message");
		}
	}
}

function GetMessages() {
	var messageSectionsLength = document.querySelectorAll('.ci-item-content').length;

	for (let i = 0; i <= messageSectionsLength-1; i++) {
		CheckAuthor(i);
	}
}

setInterval (function() {
	GetMessages();
}, 500)