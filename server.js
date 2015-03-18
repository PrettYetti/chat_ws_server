//create web socket server
var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 2000});

//create clientLog:
var clientLog = [];

//create messageLog:
// var messageLog = [];

//create message constructor:
var message = function(user,msg,type) {
  this.user = user;
  this.msg = msg;
  this.type = type;
}

server.on("connection", function(client) {

  //send connected message to client
  var connectionMessage = new message("server", "You are connected to chatroom", "welcome");
  console.log(connectionMessage);
  client.send(JSON.stringify(connectionMessage));

  //ensure only most recent 50 messages are kept in message log
  // if (messageLog.length > 50) {
  //   messageLog.shift();
  // }

  //send message history to connected clients
  // messageLog.forEach(function(elem) {
  //   client.send(elem);
  // });

  clientLog.push(client);

  //capture client messages and push to messageLog
  client.on("message", function(input) {
    //parse message
    var message = JSON.parse(input);

    if (message.type === "clientMsg") {
      // messageLog.push(input);

      //send messages to all connected clients
      clientLog.forEach(function(elem) {
        elem.send(input)
      });
    }

  });

  //remove clients on close
  client.on("close", function(input) {
    console.log("client disconnected");
    //remove from clientLog
    clientLog.forEach(function(elem) {
      if (elem === client) {
        var removeClient = clientLog.indexOf(client);
        clientLog.splice(removeClient, 1);
        elem.close();
      }
    });
  });


});
