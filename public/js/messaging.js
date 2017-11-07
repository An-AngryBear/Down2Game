'use strict';

//send-msg button
$('.send-msg').click( function() {
    let recipientId = parseInt($(this).attr('id'));
    let msgContent = $('#msg-content').val();
    console.log(recipientId, msgContent);
    sendMessage(recipientId, msgContent);
})

let sendMessage = (recipientId, msgContent) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"POST",
            data: {
                recipientId: recipientId,
                msgContent: msgContent,
                request: false
            },
            url: `/inbox/message`,
            success: function () {
                console.log("successful message post");
            },
            error: function () {
                console.log("error posting message");
            }
        })
        .then( (data) => {
            resolve();
        }); 
    });
}

//Open Message Modal - GET

$('.message-btn').click( function() {
    let currentUser = parseInt($('#user-name').attr('data'));
    let userBeingMessaged = parseInt($(this).attr('id'));
    getMessages(userBeingMessaged)
    .then( (messages) => {
        messages.forEach( (message) => {
            if(message.senderId === currentUser) {
                $('.msg-box').append(`<li class="user-message current-user-msg">${message.msgContent}</li><br>`);
            } else {
                $('.msg-box').append(`<li class="user-message other-user-msg">${message.msgContent}</li><br>`);
            }
        });
    });
});

let getMessages = (userBeingMessaged) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/inbox/message/${userBeingMessaged}`,
            success: function () {
                console.log("successful message get");
            },
            error: function () {
                console.log("error getting messages");
            }
        })
        .then( (data) => {
            console.log("messages", data)
            resolve(data);
        });
    });
}

$(document).on('hide.bs.modal', '#msg-model', function (event) {
    console.log("hiding modal");
    $('.msg-box').empty();
    $('#msg-content').val('');
});


