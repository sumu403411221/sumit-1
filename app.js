var express     =require("express");
var http        =require("http");
var app         =express();
var socketio = require("socket.io");

var server = http.createServer(app);

var formatMessage = require("./models/messages");
const { userJoin, getCurrentUser,userLeave,getRoomUsers} = require("./models/users");
app.set("view engine","ejs");
app.use(express.static("public"));
var io = socketio(server);
app.get("/",function(req,res){
	res.render("index");
	
})
app.get("/chat",function(req,res){
	var name=req.query.username;
	var room= req.query.room;
	
	console.log(req.query);
	res.render("chat",{name:name,room:room});
})
var name="chat";

io.on("connection",function(socket){
	console.log("NEW WS connected");
	
socket.on("joinRoom",function({username,room}){
		var user = userJoin(socket.id,username,room);
		socket.join(user.room);
	    socket.emit("message",formatMessage(name,"welcome to chat app"));
	    socket.broadcast.to(user.room).emit("message",formatMessage("USER",`${user.username} joined the chat`));
	    // send users and room info
	    io.to(user.room).emit("roomUsers",{
			room: user.room ,
			users: getRoomUsers(user.room)
		});

})


	//runs on client disconnect
	 socket.on("disconnect",function(){
		   const user = userLeave(socket.id);
		 if(user){
			io.to(user.room).emit("message",formatMessage("USER",user.username+" has disconnected the chat")); 
			 io.to(user.room).emit("roomUsers",{
			room: user.room ,
			users: getRoomUsers(user.room)
		});
		 }
			
	})
	
	//listen for chatMessage

    socket.on("chatMessage",function(msg){
		const user = getCurrentUser(socket.id);
	    io.to(user.room).emit("message",formatMessage(user.username,msg));
    })  

})


	




server.listen(process.env.PORT || 3000,function(){
	console.log("server started");
})