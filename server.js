var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 2000});
var messagelog = [];
var clientlog = [];

server.on("connection", function(client) {

  console.log("client connected");

  //send connected message to client
  client.send(JSON.stringify("connected to chatroom"));

  //send message history to connected clients
  messagelog.forEach(function(elem) {
    client.send(elem);
  });

  clientlog.push(client);

  //capture client messages and push to messagelog
  client.on("message", function(input) {
    //parse message
    var message = JSON.parse(input);
    messagelog.push(input);
    console.log(input);

    //send messages to all connected clients
    clientlog.forEach(function(elem) {
      elem.send(input);
    })
  });

  //remove clients on close
  client.on("close", function(input) {
    console.log("client disconnected");
    //remove from clientlog
    clientlog.forEach(function(elem) {
      if (elem === client) {
        var removeClient = clientlog.indexOf(client);
        clientlog.splice(removeClient, 1);
        elem.close();
      }
    });
  });


});
