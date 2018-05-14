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

Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  });
}

Chat.prototype.processCommand = function (command) {
  const words = command.split(' ');

  switch (command) {
    case 'join':
      const room = '';
      this.changeRoom(room);
      break;
    
    case 'nick':
      const name = 'name';
      this.socket.emit('nameAttempt', name);
      break 

    default:
      message = 'Unrecognized command.';
      break;
  }

  return message;
}