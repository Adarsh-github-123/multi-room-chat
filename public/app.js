var socket = io();

var userList = document.getElementById("active_users_list");
var roomList = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var sendMessageBtn = document.getElementById("send_message_btn");
var roomInput = document.getElementById("roomInput");
var createRoomBtn = document.getElementById("room_add_icon_holder");

const chatDisplay = document.getElementById("chat");

var currentRoom = "globalChat";
var myUsername = "";

socket.on("connect", function(){
    myUsername = prompt("Enter name");
    socket.emit("createUser",myUsername);
})

//send message on click
sendMessageBtn.addEventListener('click', function(){
    socket.emit('sendMessage', message.value);
    message.value = "";
})

//send message on enter key press
message.addEventListener("keyup", function(event){
  if(event.key === "Enter") {
    sendMessageBtn.click();
  }
})

socket.on("updateChat", function(username, data){
    if(username === 'INFO') {
        chatDisplay.innerHTML = `<div class='announcement'><span>${data}</span></div>`
    } else {
        chatDisplay.innerHTML += `<div class="message_holder ${
            username === myUsername ? "me" : ""
          }">
                                      <div class="pic"></div>
                                      <div class="message_box">
                                        <div id="message" class="message">
                                          <span class="message_name">${username}</span>
                                          <span class="message_text">${data}</span>
                                        </div>
                                      </div>
                                    </div>`;
    }
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

function changeRoom( room ) {
  if(room !== currentRoom) {
    socket.emit("updateRooms", room);
    document.getElementById(currentRoom).classList.remove("active_item");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("active_item");

  }
}