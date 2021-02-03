require ('../src/DB/models/user')
require('../src/DB/models/userTrack')
require('../src/DB/models/admin')
const port = process.env.PORT||3000;
const express = require('express');
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
var cors = require('cors')
const app = express();
const server = http.createServer(app)
const io = socketio(server,{
    cors: {
        origin: port,
        methods: ["GET", "POST"]
    }
});
app.io = io;
const userRouter = require('../src/DB/routers/user')
const trackRouter = require('../src/DB/routers/userTrack')
const adminRouter = require('../src/DB/routers/admin')

require("./DB/Mongoose");
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(trackRouter)
app.use(adminRouter)


app.use(express.static(publicDirectoryPath))

let count = 0
console.log(count)
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
