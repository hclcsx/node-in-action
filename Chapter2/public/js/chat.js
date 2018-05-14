const Chat = function(socket) {
  this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
  const message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
}