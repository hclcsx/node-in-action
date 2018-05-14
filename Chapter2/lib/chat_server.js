const socketio = require('socket.io');
const io;
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  const name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name,
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

function joinRoom(socket, room) {
  // join to room
  socket.join(room);
  
  // send message to user to know 
  currentRoom[socket.id] = room;
  socket.emit('joinResult', { room });

  // send message to all users in room
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + 'has joined' + room + '.'
  });

  // get all user of this room
  const usersInRoom = io.sockets.clients(room);
  let userInRoomSummary = '';
  if (userInRoom.length > 1) {
    userInRoomSummary = 'Users currently in ' + room + ': ';
    for (const index in usersInRoom) {
      const socketId = usersInRoom[index].id;
      if(socketId != socket.id) {
        if (index > 0) {
          userInRoomSummary += ', ';
        }
        userInRoomSummary += nickNames[socketId];
      }
    }
  }
  // let user know who is in this room
  userInRoomSummary += '.';
  socket.emit('message', { text: userInRoomSummary });
}

exports.listen = function(server) {
  io = socketio.listen(server);

  io.set('log level', 1);

  // handle user connection
  io.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, 'Lobby');

    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    handleClientDisconnection(socket, nickNames, namesUsed);
  })
}