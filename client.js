// var WebSocket = require("ws");
var client = new WebSocket("ws://localhost:2000");

//start the app with the cursor in the input box
document.querySelector('.inputMessage').focus();

//append to chat function
var appendToChat = function(msg) {
  var messages = document.querySelector('.messages');
  var msgli = document.createElement('li');
  var txtNode = document.createTextNode(msg);
  msgli.appendChild(txtNode);
  messages.appendChild(msgli);
  messages.scrollTop = messages.scrollHeight;
}

//create message constructor
var message = function(user, msg, type) {
  this.user = user;
  this.msg = msg;
  this.type = type;
};

window.onkeypress = function(evt) {
  var inputMessage = document.querySelector('.inputMessage');
  inputMessage.focus();
  if (evt.keyCode === 13) {
    //create client message (note: in app would pass current_user as user param rather than "client" placeholder here)
    var clientMessage = new message("client", inputMessage.value, "clientMsg");
    console.log(clientMessage);
    client.send(JSON.stringify(clientMessage));
    inputMessage.value = "";
  }
}

client.onmessage = function(evt) {
  var serverMsg = JSON.parse(evt.data);

  if (serverMsg.type === "welcome") {
    var appendMessage = "Welcome! " + serverMsg.msg
  }
  else {
    var appendMessage = serverMsg.user + ": " + serverMsg.msg
  }
  appendToChat(appendMessage);
}
