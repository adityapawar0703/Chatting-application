const express = require('express')
const app = express();

const http = require("http")
const server = http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server)

app.set("view engine", "ejs")

var usernames = []
var userids = [];

io.on("connection",function(socket){
    socket.on('username',function(value){
        usernames.push(value)
        userids.push(socket.id)
        console.log(usernames, userids);
        socket.emit("saved")
    })
    socket.on("message",function(value){
        console.log(value)
        var index = userids.indexOf(socket.id)
        var username = usernames[index];
        io.emit("message",{value,id:socket.id,username})
    })
    console.log("connected")
})
app.get("/",(req,res)=>{
    res.render("index")
})

// app.get('/temp',(req,res)=>{
//     res.render("temp");
// })
server.listen(3000);