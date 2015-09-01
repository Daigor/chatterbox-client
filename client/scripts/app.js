// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.messages = null;
app.init = function(){
	app.fetch();
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
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  success: function(data){ app.messages = data['results']; app.display(); app.fetch();}
	});
}

app.display = function(){
	var name;
	var text;
	var div;
	var roomnames;
	// filters data for strings and numbers only 
	var filterFunction = function(data){
		if (typeof data !== 'string'){
			return false;
		}
		return true;
	};
	//maps data by roomnames and only takes the unique of those roomnames, then filters by filter function above
	roomnames = _.filter(_.uniq(_.map(app.messages, function(obj){return obj['roomname'];})),filterFunction);
	$('#chats').text('');
	//all is equal to a jquery div with an id of 'all'
	var all = $('<div/>').attr('id','all');
	//targets the node with chat ID and appends the <div id = all>
	$('#chats').append(all);
	//targets the node with all ID and appends a header that has all the rooms
	$('#all').append($('<h3>All Rooms</h3>'));
	//loops through unique roomname array
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

		//All rooms
		div = $('<div/>');
		div.text(name + ":" + text);
		$('#all').append(div);

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