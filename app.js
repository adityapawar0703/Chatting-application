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
        // yeh lenth wala function acitve user keliye bna rha hu
        io.emit("active",userids.length)
    })
    socket.on("message",function(value){
        console.log(value)
        var index = userids.indexOf(socket.id)
        var username = usernames[index];
        io.emit("message",{value,id:socket.id,username})
    })
    console.log("connected")

    socket.on("disconnect",function(val){
        var index = userids.indexOf(socket.id)
        console.log("disconnected")
        // console.log(socket.id)
        userids.splice(index, 1);
        usernames.splice(index, 1);
        io.emit("active",userids.length)
        console.log(usernames)

    })
})

app.get("/",(req,res)=>{
    res.render("index")
})

// app.get('/temp',(req,res)=>{
//     res.render("temp");
// })
server.listen(process.env.PORT ||3000);