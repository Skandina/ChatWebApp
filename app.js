const fs = require('fs')
const express = require('express')
const socket = require('socket.io')

const hostname ='13.48.123.92'
const port = 5000
const http = require('http')
const app = express()
const server = http.createServer(app).listen(port)
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data){
        if(err) {
            response.send('error')
        } else {
          response.writeHead(200, {'Content-Type':'text/html'})
          response.write(data)
          response.end()
        }
    })
})

io.sockets.on('connection', function(socket){

  socket.on('newUser', function(name) {
    console.log(name + ' logged in')
    socket.name = name 
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + ' logged in'})
  })

  socket.on('message', function(data){
    data.name = socket.name
    console.log((data.name), data)
    socket.broadcast.emit('update', data);
  })
  
  socket.on('disconnect', function() {
    console.log(socket.name + ' logged out')
    socket.broadcast.emit('update', {type: 'disconnect', name:'SERVER', message: socket.name + '  logged out'});
  })
})


