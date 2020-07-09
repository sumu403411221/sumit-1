var chatForm = document.getElementById("chat-form");
// var msg = document.getElementById("msg");
var chatMessages = document.querySelector(".chat-messages");
var username = document.getElementById("username").textContent;
var room     = document.getElementById("room").textContent;


//join chat room


var socket = io();
socket.emit("joinRoom",{username,room});

//get room and room users

socket.on("roomUsers",function({room,users}){
	outputRoomName(room);
	outputUsers(users);
})

socket.on("message",function(message){
	console.log(message);
	outputMessage(message);
	
	//scroll down
	
	chatMessages.scrollTop = chatMessages.scrollHeight;
	
	
	
})

//message submit

chatForm.addEventListener("submit",function(e){
	e.preventDefault();
	var msg = e.target.elements.msg.value;
	// var m = msg.value;
	console.log(msg);
	// emitting message to server
	socket.emit("chatMessage",msg);
	
	// clear input
	
	e.target.elements.msg.value="";
	e.target.elements.msg.focus();
})

//output message to DOM

function outputMessage(message){
	var div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
	<p class="text">${message.text}</p>`;
	document.querySelector(".chat-messages").appendChild(div);
	
}
  const roomName = document.getElementById("room-name");
  const roomUsers = document.getElementById("users");
function outputRoomName(room){
	roomName.innerText = room;
}

function outputUsers(users){
	users.forEach(function(user){
		var li= document.createElement("li");
		li.innerHTML = `${user.username}`;
		
		roomUsers.appendChild(li);	
		
		
	})
}
