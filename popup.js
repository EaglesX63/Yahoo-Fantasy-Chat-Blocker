// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var s = $('input'),
    f  = $('form'),
    a = $('.after'),
    open = $('.left-button'),
		m = $('h4');

function sendOpen() {
  var OpenRequest = "yes";
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {RequestType: OpenRequest}, function(response) { });
  });
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

function getArrayValue(unblock_name, names) {
  var amountOfUsers =  names.users.length;

  for (i = 0; i <= amountOfUsers; i++) {
    var blockedUser = names.users.sort()[i];
    if(blockedUser === unblock_name){
      var newList = names.users.splice(i,1);
      var newList = names.users;

      chrome.storage.sync.set({"users": newList}, function() {
        chrome.storage.sync.get("users", function (results) {
          afterChange();
        })
      })

    }
  }

}

function UnblockName(names) {
  var unblock = $('.unblock_section');

  unblock.on('click', function(){
      var unblock_name = $(this).parent().attr('data-name');
      setTimeout(function() {
        getArrayValue(unblock_name, names);
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

function inputName() {
	chrome.storage.sync.get({"users": []}, function (value) {
		var oldList = value.users;
		var newUser = document.querySelector('#name_input').value;

		oldList.push(newUser);

		chrome.storage.sync.set({"users": oldList}, function() {
			chrome.storage.sync.get("users", function (results) {
				afterChange();
			})
		})
	})
}

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