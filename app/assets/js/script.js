/*-----------LOGO----------------------*/

$('.home').on('click', function(){
	alert('на главную!')
})

/*----------navbar------------*/

var currentBar = $('a.activeMenu');
var divs = $('#rules, #profile, #chooseField, #registr');
var currentElem = divs.filter(function(){
	return $(this).attr('id') === currentBar.attr('data-id');
});

//----------------по клику пункта меню меняем содержимое страницы---------------------

$('ul.menu a').each(function(i){
	$(this).on('click', function(e){
		currentElem.css('display', 'none');
		currentBar.removeClass('activeMenu');
		currentBar = $(this).addClass('activeMenu');
		currentElem = divs.filter(function(){
			return $(this).attr('id') === currentBar.attr('data-id');
		});
		currentElem.css('display', 'block');

//-------------------если это порфиль, загрузим с сервера данные-----------------------

		if($(this).attr('id') === 'toProfile') {
			loadFamilyData();
		}
	});
});

/*--------------создание таблицы "Семья" в профиле------*/

//подгружаем базу членов семьи с сервера

function loadFamilyData(){
	$.ajax({
	  url: 'https://api.backendless.com/v1/data/family',
	  headers: {'application-id': 'AB0324F9-EDD5-8364-FF41-A14B3E3EF400',
	            'secret-key': 'F1EBB45C-2A5F-33F9-FF49-59FD80750100'},
	  success: function(data){
	    refreshFamilyTAble(data.data);
	  },
	  error: function (xhRequest, ErrorText, thrownError) {
      console.log(xhRequest, ErrorText, thrownError);
    }
	});
}
	
// функция обновления таблицы на странице

function refreshFamilyTAble(data) {
	var trs = [];
	data.forEach(function(person){
		trs.push(createTablePerson(person));
	});
	
	$('tr[id^="objectId"]').remove();
	trs.forEach(function(item){
		$('#createPanel').before(item);
	});
	
	console.log('Обновили таблицу!!!');
}

//-----------------создание domElement 1 person-----------

function createTablePerson(person){
	var tr = $('<tr></tr>').attr('id', 'objectId' + person.objectId);
	var num = $('<td></td>').html('+');
	var name = $('<td></td>').html(person.name).attr('data-objectId', person.objectId);
	var age = $('<td></td>').html(person.age);
	var role = $('<td></td>').html(person.role);
	var check = $('<td></td>');
	var checkBtn = $('<input type="checkbox">').attr('name', person.objectId);
	check.append(checkBtn);
	return	tr.append(num).append(name).append(age).append(role).append(check);
}

//---------добавление члена семьи в базу---------------

$('#create').on('click', createNewPerson);

//-----------создание нового члена семьи---------

function createNewPerson(){
	var data = {};
	data.name = $('#myFamily input[name="name"]').val();
	data.age = $('#myFamily input[name="age"]').val();
	data.role = $('#myFamily input[name="role"]').val();
	data = JSON.stringify(data);

	$.ajax({
		url: 'https://api.backendless.com/v1/data/family',
		type: 'POST',
		crossDomain: true,
		headers: {'application-id': 'AB0324F9-EDD5-8364-FF41-A14B3E3EF400',
	            'secret-key': 'F1EBB45C-2A5F-33F9-FF49-59FD80750100'},
		data: data, 
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){ console.log('Добавили на сервер!!!')	},
		error: function (xhRequest, ErrorText, thrownError) {
      console.log(xhRequest, ErrorText, thrownError);
    },
		complete: function(){	
			loadFamilyData();
			$('#createTable')[0].reset();
		}
	});
}

//----------------удаление члена семьи---------------------

$('#delete').on('click', deletePerson);

function deletePerson(){
	$('#myFamily input:checked').each(function(){
		var id = this.parentElement.parentElement.getAttribute('id').slice(8);
		var data = JSON.stringify({objectId: id});
		
		$.ajax({
			url: 'https://api.backendless.com/v1/data/family',
			type: 'DELETE',
			crossDomain: true,
			headers: {'application-id': 'AB0324F9-EDD5-8364-FF41-A14B3E3EF400',
		            'secret-key': 'F1EBB45C-2A5F-33F9-FF49-59FD80750100'},
			data: data, 
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){ console.log('Удалили с сервера!!!')	},
			error: function (xhRequest, ErrorText, thrownError) {
	      console.log(xhRequest, ErrorText, thrownError);
	    },
	    complete: function(){	loadFamilyData()	}
		});
	});
}

/*------------регистрация------------------*/

$('#autorization').on('submit', sendRegistr);

function sendRegistr(e) {
	e.preventDefault();
	var password = $('input[name="password"]').val();
	var password2 = $('input[name="password2"]').val();

	if (password !== password2) {
		alert('пароль не совпал !!!');
		return;
	} 

	var login = $('input[name="login"]').val();
	var firstName = $('input[name="firstName"]').val();
	var lastName = $('input[name="lastName"]').val();
	var gender = $('input[name="gender"]').val();
	var birthday = $('input[name="birthday"]').val();
	
	var data = JSON.stringify(
		{ 'login': login, 
			'firstName': firstName,
			'lastName': lastName,
			'password': password, 
			'gender': gender, 
			'birthday': birthday
		}
	);
	
	$.ajax({
			url: 'https://api.backendless.com/v1/data/Square_Users',
			type: 'POST',
			crossDomain: true,
			headers: {'application-id': 'AB0324F9-EDD5-8364-FF41-A14B3E3EF400',
		            'secret-key': 'F1EBB45C-2A5F-33F9-FF49-59FD80750100'},
			data: data, 
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){ 
				console.log('Поздравляем с регистрацией!!!');
				$('#autorization')[0].reset();
			},
			error: function (xhRequest, ErrorText, thrownError) {
	      console.log(xhRequest, ErrorText, thrownError);
	    },
	    complete: function(){  }
		});
}

/*----------------игра-------------------------------*/
/*
var square = document.getElementById('square');
var mess = document.getElementById('info');

function Player(name, colour, avatar){
	var _self = this;

	this.avatar = avatar;
	this.name = name;
	this.colour = colour;
	this.count = 0;
	this.goal = 0;

this.punch = function(){

	if(this.ball){
		var playerId = Math.ceil(Math.random() * this.players.length) - 1;
		this.ball = false;

	if(Math.random()*2 > 1){
		field.players[playerId].addGoal();
		this.addCount();
		field.started = false;
	} else { 
		field.players[playerId].getBall();
	}
};
	this.ball = false;

	this.getBall = function(){ 
		this.ball = true 
	};
	
	this.addCount = function(){ 
		this.count++ 
	};
	
	this.addGoal = function(){ 
		this.goal++ 
	};
	
	this.render = function(index){
		var ball = '';

		if(this.ball) { ball = '<div class="ball"></div>'; }

		var result = [
			'<div class="player ', 
			this.colour, 
			'" data-index="', 
			index, 
			'"><img src="', 
			this.avatar, 
			'"><br>', 
			this.name, 
			ball, 
			'</div>'
		];

		return result.join('');
	};

	this.click = function(e, obj) {
		console.log(e, obj);
		obj = obj || this.field;
		console.log(this.field);

		obj.players.forEach( function(p){ 
			p.ball = false;  
		});

		_self.getBall();
		obj.render();
		mess.innerHTML = 'мяч у меня!' +  _self.name;
	};
};

function Field(players, obj){
	this.players = players;
	this.domObj = obj;
	this.started = false;

	this.render2 = function(){
		var _self = this;
		var result =  this.players.map(
			function(p, index){
				return p.render(index);
			}
		).join('');

		this.domObj.innerHTML = result;

		var domPlayers = document.getElementsByClassName('player');

		for (var i = 0; i < domPlayers.length; i++) {
			domPlayers[i].addEventListener('click', function(_i, _f) {
				return function() {
					_f.players[_i].click(_i, _f);
				};
			}(i, _self));
		}
	};

	this.render = function(){
		var _self = this;

		var result =  this.players.map(
			function(p, index){
				return p.render(index);
			}
		).join('');

		this.domObj.innerHTML = result;

		var domPlayers = document.getElementsByClassName('player');

		for (var i = 0; i < domPlayers.length; i++) {
			domPlayers[i].addEventListener('click', {
				handleEvent: this.players[i].click,
				field: _self
			});
		}
	};
 
	this.start = function(){
		if(!this.started) {
			var p_Id = Math.ceil(Math.random() * this.players.length) - 1;
			this.started = true;
			this.players[p_Id].getBall();
		}else {
			mess.innerHTML = 'Игра уже идет!!!!!!!!!!!!!!!!';  
		}

		this.render();
	}
}

var p1 = new Player('Cap', 'green', 'images/cap.png');
var p2 = new Player('IronMan', 'red', 'images/ironman.png');
var p3 = new Player('SpiderMan', 'yellow', 'images/spiderman.png');
var p4 = new Player('Puh', 'blue', 'images/puh.png');
var field = new Field([p1, p2, p3, p4], square);

var startGame = document.getElementById('startGame');
startGame.addEventListener('click', function(){
		field.start();
});
*/