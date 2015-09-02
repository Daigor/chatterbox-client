var Message = Backbone.Model.extend({

	defaults:{
		"username": "",
		"text": "",
		"objectId": ""
	}

});	

var MessageView = Backbone.View.extend({
	template: _.template('<div class = "chat" data-id ="<%- objectId %>" \
						<div class = "user"> <%- username %> </div> \
						<div class "text"> <%- text %> </div> \
						</div>'),

	render: function(){
		this.$el.html(this.template(this.model.attributes));
		return this.$el;
	}
});

var Messages = Backbone.Collection.extend({
	model: Message,

	url: 'https://api.parse.com/1/classes/chatterbox',

	loadMsgs: function(){
		this.fetch({data: {orders:'-createdAt'}});
	},

	parse: function(response,options){
		return response.results;
	}
});

var MessagesView = Backbone.View.extend({

	initialize: function(){
		this.collection.on('sync', this.render, this);
	},

	render: function(){
		this.collection.forEach(this.renderMessage, this)
	},

	renderMessage: function(message){
		var messageView = new MessageView({model: message});
		$html = messageView.render();
		this.$el.prepend($html);
	}
});