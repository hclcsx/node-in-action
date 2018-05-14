const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/chat_server');
const cache = {};


function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('ERROR 404: resource not found');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200, 
    {'content-type' : mime.getType(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic(response, cache, asbPath) {
  if(cache[asbPath]) {
    sendFile(response, asbPath, cache[asbPath]);
  } else {
    fs.exists(asbPath, function(exists) {
      if (exists) {
        fs.readFile(asbPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[asbPath] = data;
            sendFile(response, asbPath, data);
          }
        })
      } else {
        send404(response);
      }
    })
  }
}

const server = http.createServer(function (request, response) {
  let filePath = '';

  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }

  const asbPath = './' + filePath;
  serveStatic(response, cache, asbPath);
});

chatServer.listen(server);

server.listen(3000, function () {
  console.log('server is starting on 3000');
})