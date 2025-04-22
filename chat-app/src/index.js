const http= require('http')
const express= require('express')
const path= require('path')
const socketio= require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port= process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new connection')
    
    socket.emit('welcome', 'welcome')
    socket.broadcast.emit('message', 'a new user has joined')

    socket.on('sendmessage', (message, callback)=>{
        console.log(message)
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'a user has left')
    })
})

server.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})
