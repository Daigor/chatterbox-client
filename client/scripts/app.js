// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.currentRoom = null;
app.messages = null;
app.roomMessages = null;

app.init = function(){
	app.fetch();
};


app.updateRoomOptions = function() {
	var roomnames;
	var option;
	var filterFunction = function(data){
		if (typeof data !== 'string'){
			return false;
		}
		return true;
	};
	
	roomnames = _.filter(_.uniq(_.map(app.messages, function(obj){return obj['roomname'];})),filterFunction);
	$('#rooms').text('')
	for(var i = 0; i < roomnames.length; i++){
		option = $("<option/>");
		option.text(roomnames[i]);
		$('#rooms').append(option);
	}
};

app.send = function(message){
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
	}
app.fetch = function(){
	url = 'https://api.parse.com/1/classes/chatterbox';
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: url,
	  type: 'GET',
		  success: function(data){ app.messages = data['results']; 
		  
		  app.updateRoomOptions(); 
		  app.fetch();
		}
	});
}

app.fetchRoom = function(){
	url = 'https://api.parse.com/1/classes/chatterbox?where{"roomname":"' + app.currentRoom + '"}';
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: url,
	  type: 'GET',
	  success: function(data){ app.messages = data['results']; app.display(); app.fetchRoom(app.currentRoom);}
	});
}

app.display = function(){
	var name;
	var text;
	var div;
	var roomnames;
	//maps data by roomnames and only takes the unique of those roomnames, then filters by filter function above
	roomnames = _.filter(_.uniq(_.map(app.messages, function(obj){return obj['roomname'];})),filterFunction);
	
	$('#chats').text('');

	for (var r = 0; r < roomnames.length; r++){
		// creates a div
		div = $('<div/>');
		// adds an id with the rooms name
		div.attr("id", roomnames[r]);
		$('#chats').append(div);
		h3 = $('<h3/>');
		h3.text(roomnames[r]);
		div.append(h3);
	}

	for(var i = 0; i < app.messages.length; i++){
		name = app.messages[i].username;
		text = app.messages[i].text;
		roomname = app.messages[i].roomname;


		//Single room
		div = $('<div/>');
		div.text(name + ":" + text);
		$('#' + roomname).append(div);
	}
};

$('#send').submit(function(event){
	event.preventDefault();
	var username = $('#send').children('#username').val();
	var text = $('#send').children('#message').val();
	app.send({username: username, text: text, roomname: '4chan'});
});