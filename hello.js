function inputName() {
	chrome.storage.sync.get({"users": []}, function (value) {
		oldList = value.users;
	})
}

function removeBlockedClass(MessageNum) {
	document.querySelectorAll('.ci-item-content')[MessageNum]
	var authorMessagesLength = document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message').length;
	for (let i = 0; i <= authorMessagesLength-1; i++) {
		document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message')[i].parentElement.parentElement.classList.remove("blocked-message");
	}
}

function addBlockedClass(MessageNum) {
	document.querySelectorAll('.ci-item-content')[MessageNum]
	var authorMessagesLength = document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message').length;
	for (let i = 0; i <= authorMessagesLength-1; i++) {
		document.querySelectorAll('.ci-item-content')[MessageNum].querySelectorAll('.iris-chat-message')[i].parentElement.parentElement.classList.add("blocked-message");
	}
}

function CheckAuthor(MessageNum,recievedName) {
	var messageAuthor = document.querySelectorAll('.col2 .user-name')[MessageNum].getAttribute("title").split("(")[0].trim();
	var recievedName = recievedName;
	inputName();

	if (oldList.includes(messageAuthor)) {
		addBlockedClass(MessageNum);
	} else if (messageAuthor === recievedName) {
		removeBlockedClass(MessageNum);
	}
}

function GetMessages(recievedName) {
	var messageSectionsLength = document.querySelectorAll('.ci-item-content').length;
	var recievedName = recievedName;

	for (let i = 0; i <= messageSectionsLength-1; i++) {
			CheckAuthor(i,recievedName);
	}
}

sendFunction = "toAdd";

setInterval (function() {
	GetMessages();
}, 500)

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var sentFunction = "toRemove";
	var request = request.username;
	setTimeout(function(){
		GetMessages(request);
	},1500);
});