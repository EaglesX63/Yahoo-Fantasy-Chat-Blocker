// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var s = $('input'),
    f  = $('form'),
    a = $('.after'),
    open = $('.left-button'),
		m = $('h4');

function removeList() {
  $('.right-button').removeClass("active");
  $('.list_section').remove();
}

function listView(emptyList) {
  console.log(emptyList);
  $('.button-section').after('<div class="list_section"><div class="list_list"></div></div>');
  for (i = 0; i <= emptyList.length-1; i++) {
    var newName = emptyList[i];
    console.log(newName);
    var newNameSplit = newName.split(" ");
    var firstName = newNameSplit[0].trim();
    if (newNameSplit[1] !== undefined) {
      var lastName = newNameSplit[1].trim();
    }
    var lastInitial = lastName.charAt(0);
    $('.list_list').append('<div><span data-list-name="'+emptyList[i]+'">'+firstName+' '+lastInitial+'</span></div>');
  }
  var list_block_div = $('body > div.list_section > div > div');

  list_block_div.on('click', function(){
      var list_block_name = $(this).children().attr('data-list-name');
      inputName(list_block_name);
      removeList();
  })
}

function sendOpen() {
  var OpenRequest = "yes";
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {RequestType: OpenRequest}, function(response) { });
  });
}

function unblockChange(data) {
  var something = $('.name_row[data-name="'+data+'"]').remove();
}

function unblockClass(object) {
  var newClass = $(object).parent().children().eq(1).children().eq(0);
  newClass.addClass("unblock-animation");
  $(object).css("background-color","#750505");
  $(object).css("border-bottom", "3px solid #2b0000");
}

function sendUnblock(name) {
  var sendName = name;
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {username: sendName}, function(response) { });
  });
}

function getArrayValue(unblock_name, names, functionType) {
  var amountOfUsers =  names.users.length;

  for (i = 0; i <= amountOfUsers; i++) {
    var blockedUser = names.users.sort()[i];
    if(blockedUser === unblock_name){
      var newList = names.users.splice(i,1);
      var newList = names.users;

      chrome.storage.sync.set({"users": newList}, function() {
        chrome.storage.sync.get("users", function (results) {
          if (functionType !== undefined) {
            console.log("unblocked a dude");
          } else {
            afterChange();
          }
        })
      })

    }
  }

}

function UnblockName(names) {
  var unblock = $('.unblock_section');

  unblock.on('click', function(){
      var unblock_name = $(this).parent().attr('data-name');
      var functionType = "nameUnblock";
      setTimeout(function() {
        unblockChange(unblock_name);
        getArrayValue(unblock_name, names, functionType);
      },2000);
      sendUnblock(unblock_name);
      unblockClass(this);
  })

}

function nameList() {
	chrome.storage.sync.get("users", function (names) {
		var amountOfUsers =  names.users.length;
		for (i = 0; i <= amountOfUsers; i++) {
			var blockedUser = names.users.sort()[i];
        if(names.users[i] !== undefined) {
		    $('.block-table').append('<div class="name_row" data-name="'+blockedUser+'"><div class="unblock_section">X</div><div class="name_section">'+blockedUser+'<div class="overlay"></div></div></div>');
      }
		}

    UnblockName(names);

	})
}

async function afterChange() {
	await $(".block-table").replaceWith('<div class="block-table"></div>');
	await nameList();
}

function inputName(name_to_block) {
	chrome.storage.sync.get({"users": []}, function (value) {

		var oldList = value.users;
    if (name_to_block !== undefined) {
      var newUser = name_to_block;
    } else {
      var newUser = document.querySelector('#name_input').value;
    }

		oldList.push(newUser);

		chrome.storage.sync.set({"users": oldList}, function() {
			chrome.storage.sync.get("users", function (results) {
				afterChange();
			})
		})
	})
}

function selectBlock() {
  var functionName = "SelectBlock";
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, functionName, function(response) { });
  });   
}

function listBlock() {
  var functionName = "GetList";
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, functionName, function(response) { });
  }); 
}

$('.left-button').click(function(){
  var isActive = document.querySelector('.left-button').classList[2];
  if (isActive == 'active') {
    removeSelect();
  } else {
    $('.left-button').addClass('active');
    selectBlock();
  }
});

$('.right-button').click(function(){
  var isActive = document.querySelector('.right-button').classList[2];
  if (isActive == 'active') {
    removeList();
  } else {
    $('.right-button').addClass('active');
    listBlock();
  }
});

s.focus(function(){
  if( f.hasClass('open') ) return;
  f.addClass('in');
  setTimeout(function(){
    f.addClass('open');
    f.removeClass('in');
  }, 1300);
});

a.on('click', function(e){
  e.preventDefault();
  if( !f.hasClass('open') ) return;
   s.val('');
  f.addClass('close');
  f.removeClass('open');
  setTimeout(function(){
    f.removeClass('close');
  }, 1300);
})

open.on('click', function(e){
  sendOpen();
})

f.submit(function(e){
  e.preventDefault();

  inputName();

  m.html('Thanks, high five!').addClass('show');
  f.addClass('explode');
  setTimeout(function(){
    s.val('');
    f.removeClass('explode');
    m.removeClass('show');
  }, 1000);
})

nameList();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "something_completed") {
            //  To do something
            var unblockedList = request.data.list;

            chrome.storage.sync.get("users", function (names) {
              var blockedList =  names.users;
              var emptyList = [];

              jQuery.grep(unblockedList, function(el) {
                      if (jQuery.inArray(el, blockedList) == -1) emptyList.push(el);
              });

              listView(emptyList);

            });

        }
    }
);