'use strict';

//send-msg profile
$('#send-msg').click( function() {
    let recipientId = parseInt($(this).attr('data'));
    let msgContent = $('#msg-content').val();
    sendMessage(recipientId, msgContent)
    .then( (data) => {
        let otherUser = $('#send-msg').attr('data');
        console.log(otherUser);
        $('.msg-box').append(`<li class="user-message current-user-msg">${msgContent}</li><br>`);
        let objDiv = document.getElementById("msg-modal-body");
        objDiv.scrollTop = objDiv.scrollHeight;
        updateInbox(recipientId, msgContent, otherUser);
    });
});

let updateInbox = (recipientId, msgContent, otherUser) => {
    console.log(otherUser);
    let date = dateConverter(new Date());
    let senderId = $('.screen-name-inbox').attr('data');
    getCurrentScreenName(recipientId)
    .then( (name) => {
        let screenName = name;
        $('.list-group').prepend(`
            <li id="${recipientId}-user" role="button" data=${otherUser} class="list-group-item inbox-btn current-users-post" data-toggle="modal" data-target="#msg-model"> 
            <div class="row inbox-messages">
                <div class="col-md-4">
                    <p class="screen-name-inbox" data="${senderId}"> To: ${screenName}</p>
                </div>
                <div class="col-md-4">
                    <p class="message-content-inbox"> Last Message: ${msgContent}</p>
                </div>
                <div class="col-md-4">
                    <p class="timestampe-inbox"> ${date}</p>
                </div>
            </div></li>`);
    });
};

// }); //TODO update modal header with screen name of other user

let dateConverter = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let newDate = `${month}/${day}/${year}`;
    return newDate;
};

let getCurrentScreenName = (userId) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"GET",
            url: `/user/${userId}/screenname`,
            success: function () {
                console.log("successful message post");
            },
            error: function () {
                console.log("error posting message");
            }
        })
        .then( (data) => {
            resolve(data);
        }); 
    });
};

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
};

//Open Message Modal - GET

$('#message-btn').click( function() {
    let currentUser = parseInt($('#user-name').attr('data'));
    let userBeingMessaged = parseInt($(this).attr('data'));
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



//open modal inbox
$('.inbox-btn').click( function() {
    let otherUser = parseInt($(this).attr('data'));
    let currentUser = parseInt($('#inbox-container').attr('data'));
    let userBeingMessaged = parseInt($(this).attr('id'));
    $('#send-msg').attr('data', otherUser);
    getMessages(userBeingMessaged)
    .then( (messages) => {
        messages.forEach( (message) => {
            if(message.senderId === currentUser) {
                $('.msg-box').append(`<li class="user-message current-user-msg">${message.msgContent}</li><br>`);
            } else {
                $('.msg-box').append(`<li class="user-message other-user-msg">${message.msgContent}</li><br>`);
            }
        });
        $('.send-msg-inbox').attr('id', `${userBeingMessaged}-recipient-id`);
    });
});

$(document).keypress( function(event) {
    if(event.keyCode == 13 && $('#msg-content').is(':focus')) {
        $('.send-msg').click();
        $('.send-msg-inbox').click();
        $('#msg-content').val('');
    }
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
            resolve(data);
        });
    });
};

$(document).on('hide.bs.modal', '#msg-model', function (event) {
    $('.msg-box').empty();
    $('#msg-content').val('');
    if(window.location.pathname === '/inbox') {

    //     .col-md-4
    //     p(class="screen-name-inbox") To: #{userMsg.screenName} 
    // .col-md-4
    //     p(class="message-content-inbox") Last Message: #{userMsg.msgContent}
    // .col-md-4
    //     p(class="timestamp-inbox") #{userMsg.createdAt}
    }
}); //TODO fix inbox update when modal is closed

$(document).on('shown.bs.modal', '#msg-model', function (event) {
    let objDiv = document.getElementById("msg-modal-body");
    objDiv.scrollTop = objDiv.scrollHeight;
});

// SOCKET IO

// var username = $(this).children("input").val();
// socket.emit("add-user", {"username": username});