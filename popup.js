// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var s = $('input'),
    f  = $('form'),
    a = $('.after'),
		m = $('h4');
	u = $('.unblock_section');

u.on('click', function(){
	var classname = $(this).attr('class');
	alert(classname);
});

function nameList() {
	chrome.storage.sync.get("users", function (names) {
		var amountOfUsers =  names.users.length;
		for (i = 0; i <= amountOfUsers; i++) {
			var blockedUser = names.users.sort()[i];
		    $('.block-table').append('<div class="name_row" id='+blockedUser+'><div class="unblock_section">X</div><div class="name_section">'+blockedUser+'</div></div>');
		}
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

f.submit(function(e){
  e.preventDefault();

  inputName();

  m.html('Thanks, high five!').addClass('show');
  f.addClass('explode');
  setTimeout(function(){
    s.val('');
    f.removeClass('explode');
    m.removeClass('show');
  }, 3000);
})

nameList();