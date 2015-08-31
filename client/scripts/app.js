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

app.realTime = function(){

}

app.display = function(){
	var name;
	var text;
	var div;
	$('#chats').text('');
	for(var i = 0; i < app.messages.length; i++){
		name = app.messages[i].username;
		text = app.messages[i].text;
		div = $('<div/>');
			div.text(name + ":" + text);
			$('#chats').append(div);
	}
};

$('#send').submit(function(event){
	event.preventDefault();
	var username = $('#send').children('#username').val();
	var text = $('#send').children('#message').val();
	app.send({username: username, text: text, roomname: '4chan'});
});