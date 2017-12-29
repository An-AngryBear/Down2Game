'use strict';

// edit button functionality
$('.edit').click( function(event) {
    $('.info-display').show();
    $('.input').hide();
    $('.img-input').hide();
    $('.edit').show();
    event.preventDefault();
    $(this).closest('.info').find('.info-display').css('display', 'none');
    $(this).closest('.info').find('.input').css('display', 'block');
    $(this).closest('.info').find('.img-input').css('display', 'block');
    $(this).hide();
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
                $('#game-list').append(`<li class="game-options"><a class="game-options">${data[i]}</a></li>`);
            }
        });
    }, 500);
});

//click enter to submit user info
$('.input').keydown( function(event) {
    if(event.keyCode == 13) {
        event.preventDefault();
        let newInput = $(this).val();
        console.log(newInput);
        editInfo($(this).attr('data'), newInput)
        .then( (data) => {
            $(this).hide();
            $('.img-input').hide();
            $(this).siblings('.info-display').text(newInput);
            $(this).siblings('.info-display').show();
            $('.edit').show();
        });
    }
});

//posts game IGDB game to DB
$(document).on('click', "li.game-options", function() {
    addGame(this.textContent)
    .then( (data) => {
        $('#game-list').empty();
        $('.game-add-input').val("");
    });
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

//posts game to DB
let addGame = (game) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"POST",
            data: { game },
            url: `/games/`,
            success: function () { },
            error: function () { }
        })
        .then( (data) => {
            resolve(data);
        });
    });
};

//gets user's games from DB