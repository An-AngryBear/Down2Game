'use strict';

//user to user interaction



// edit button functionality


$('#edit-blurb').click( function() {
    event.preventDefault();
    $('.blurb-input').show();
    $('.blurb-display').hide();
    $('#edit-blurb').hide();
});

$('#edit-email').click( function() {
    event.preventDefault();
    $('.email-input').show();
    $('.email').hide();
});

$('#edit-language').click( function() {
    event.preventDefault();
    $('.language-input').show()
});

$('#edit-timezone').click( function() {
    event.preventDefault();
    $('.timezone-input').show();
});

$('#gameSearch').focus( function() {
    $('.game-options').removeClass('hidden-list');
});

$('.edit').mousedown( function() {
    $('.input').hide();
    $('.blurb-display').show();
    $('.edit').show();
});

$('.edit').click( function() {
    $('.edit').show();
    $(this).hide();
});

$('.input').focusout( function() {
    $('.user-info').show();
    $('.edit').show();
});

//filters games in database by search input, waits for user to finish typing
let timeout = null;

$('#gameSearch').keyup( function() {
    clearTimeout(timeout);
    timeout = setTimeout( function() {
        getIgdbGames()
        .then( (data) => {
            let filter = $('#gameSearch').val().toUpperCase();
            $('#game-list').empty();
            for(let i = 0; i < data.length; i++) {
                $('#game-list').append(`<li class="game-options"><a class="game-options">${data[i]}</a></li>`)
            }
        });
    }, 500);
});

//listens for drop down changes to PUT new data in DB
// $('#language').change( function() {
//     $('#lang-submit').click();    
// });

// $('#timezone').change( function() {
//     $('#timezone-submit').click();    
// });

//click enter to submit open text inputs
$('.input').keypress( function() {
    if(event.keyCode == 13) {
        let newInput = $(this).val();
        console.log("thisvalue", $(this).val());
        event.preventDefault();
        editInfo($(this).attr('data'), newInput)
        .then( (data) => {
            $(this).hide();
            $(this).siblings('.user-info').text(newInput);
            $(this).siblings('.user-info').show();
        });
    }
});

//posts game IGDB game to DB
$(document).on('click', "li.game-options", function() {
    $('#hidden-gamesearch').val(this.textContent);
    $('#hidden-game-submit').click();
});

// ************* AJAX **************

//call to game route, hits IGDB API
let getIgdbGames = () => {
    let searchTerm = $('#gameSearch').val();
    let noSpaces = searchTerm.replace(/ /g,"+");
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"GET",
            url: `/games/${noSpaces}`,
            success: function () { },
            error: function () { }
        })
        .then( (data) => {
            let parsed = JSON.parse(data);
            let gamelist = parsed.map( (game) => {
                return game.name;
            });
            resolve(gamelist);
        }); 
    });
};

//call to edit user info in database
let editInfo = (dataName, userData) => {
    let args = {};
    args[dataName] = typeof userData == 'string' ? userData : userData[0];
    console.log(args);
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"PUT",
            data: args,
            url: `/user/`,
            success: function () { },
            error: function () { }
        })
        .then( (data) => {
            resolve(data);
        });
    });
};