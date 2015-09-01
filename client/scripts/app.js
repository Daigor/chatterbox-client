// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.currentRoom = null;
app.messages = null;
app.roomMessages = null;
app.friends = [];

app.init = function(){
	app.fetch();
};

app.updateRoomOptions = function() {
	var roomnames;
	var option;
	var filterFunction = function(data){
		if (typeof data['roomname'] !== 'string' || data['roomname'] === ''){
			return false;
		}
		return true;
	};
	
	var filtered = _.filter(app.messages, filterFunction);
	var mapped = _.map(filtered, function(obj){return obj['roomname'];});
	var unique = _.uniq(mapped);
	roomnames = unique;
	$('#rooms').text('')
	var index = roomnames.indexOf(app.currentRoom);
	if (index > 0){
		temp = roomnames[0];
		roomnames[0] = app.currentRoom;
		roomnames[index] = temp;
	}
	else{
		app.currentRoom = roomnames[0];
	}
	for(var i = 0; i < roomnames.length; i++){
		option = $("<option/>");
		option.text(roomnames[i]).attr("value", roomnames[i]);
		$('#rooms').append(option);
	}
	app.fetchRoom();
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
		  // app.fetch();
		}
	});
}

app.fetchRoom = function(){
	url = 'https://api.parse.com/1/classes/chatterbox';
	var filterRoom = function(obj) { return (obj['roomname'] === app.currentRoom);};
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: url,
	  type: 'GET',
	  success: function(data){ app.roomMessages = _.filter(data['results'], filterRoom);
	  		app.display(); 
	 	 // app.fetchRoom(app.currentRoom);
		}
	});
}

app.display = function(){
	var name;
	var text;
	var div;
	var roomnames;
	//maps data by roomnames and only takes the unique of those roomnames, then filters by filter function above
	
	$('#chats').text('');

	// for (var r = 0; r < roomnames.length; r++){
		// creates a div
		div = $('<div/>');
		// adds an id with the rooms name
		div.attr("id", app.currentRoom);
		$('#chats').append(div);
		h3 = $('<h3/>');
		h3.text(app.currentRoom);
		div.append(h3);

	for(var i = 0; i < app.roomMessages.length; i++){
		name = app.roomMessages[i].username;
		text = app.roomMessages[i].text;
		roomname = app.roomMessages[i].roomname;

		if (app.friends.indexOf(name) < 0){
			span = $('<span/>');
			span.text(name).attr('class', 'username');
		} else{
			span = $('<span/>');
			span.text(name).attr('class', 'username');
			span.css({"font-weight" : "bold"});
		}

		//Single room
		div = $('<div/>');
		div.text(text);
		div.append(span);

		$('#' + app.currentRoom).append(div);
		$('.username').on("click", function(){
			console.log($(this));
			app.friends.push($(this).innerText);
		});
	}
	setInterval(app.fetch,5000);
};

$('#send').submit(function(event){
	event.preventDefault();
	var username = $('#send').children('#username').val();
	var text = $('#send').children('#message').val();
	var roomname = app.currentRoom; 
	app.send({username: username, text: text, roomname: roomname});
});
$('#rooms').change(function(){
	app.currentRoom = $( "#rooms :selected" )[0].innerText;
})
