function removeSelect() {
	var selectOverlay = document.getElementById('selectOverlay');
	selectOverlay.parentElement.removeChild(selectOverlay);
}

function selectHighlight() {
	$('.ci-group-feed-sections').append('<div id="selectOverlay"></div>');
}

function getList() {
	var outerNameDiv = '#app > div.threecol.ci-groups-layout > div.content > div.col2 > div.content.col2.primary > div > div > div.members > div > div';
	var innerNameDiv = '#app > div.threecol.ci-groups-layout > div.content > div.col2 > div.content.col2.primary > div > div > div.members > div > div:nth-child(INDEX) > div > div > div.flex-grow.list-item-title';
	var chatList = [];
	$('.vtop').click();

	var checkExist = setInterval(function() {
	   if ($('div.content.col2.primary').length) {
	      console.log("Exists!");
	      clearInterval(checkExist);
	      var listNameLength = document.querySelectorAll('#app > div.threecol.ci-groups-layout > div.content > div.col2 > div.content.col2.primary > div > div > div.members > div > div').length;

		for (let i=3; i<=listNameLength; i++) {
			let listNameSelector = innerNameDiv.replace("INDEX", i);
			let listName = document.querySelector(listNameSelector).textContent.split('(')[0].trim();
			chatList.push(listName);
		}

		chrome.runtime.sendMessage({
		    msg: "something_completed", 
		    data: {
		        list: chatList
		    }
		});

		$('.vtop').click();

		}
	}, 100);

}

function openUsersList() {
	$('.group-settings-icon').trigger('click');
}

function inputName() {
	chrome.storage.sync.get({"users": []}, function (value) {
		oldList = value.users;
	})
}

function addUnblockedIndex(MessageNum) {
	document.querySelectorAll('.ci-item-content')[MessageNum]
	var authorMessagesIndex = document.querySelectorAll('.ci-item-content')[MessageNum].parentElement.parentElement.parentElement;
	authorMessagesIndex.classList.add('unlocked-index');
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

	if (messageAuthor === recievedName) {
		removeBlockedClass(MessageNum);
	} else if (oldList.includes(messageAuthor)) {
		addBlockedClass(MessageNum);
	} else {
		addUnblockedIndex(MessageNum);
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
	if (request == "GetList") {
		getList();
	} 	else if (request == "SelectBlock") {
		selectHighlight();
	}	else if (request == "RemoveSelect") {
		removeSelect();
	}	else {
		var sentFunction = "toRemove";
		var request = request.username;
		setTimeout(function(){
			GetMessages(request);
		},2000);
	}
});