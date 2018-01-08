'use strict';

const socket = io.connect();

//add user
console.log(userID);

if(!userID) {
    var userID = $('#body').attr('data');
    socket.emit("add-user", {"userID": userID});
}

$('#send-msg').click( function() {
    socket.emit("private-message", {
        "userID": parseInt($(this).attr('data')),
        "content": $('#msg-content').val()
    });
});

socket.on("add-message", function(data){
    $('.msg-box').append(`<li class="user-message other-user-msg">${data.content}</li><br>`);
    let objDiv = document.getElementById("msg-modal-body");
    objDiv.scrollTop = objDiv.scrollHeight;
});