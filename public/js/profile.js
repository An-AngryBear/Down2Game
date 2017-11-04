// edit button functionality
$('#edit-blurb').click( function() {
    event.preventDefault();
    $('.blurb-input').show();
    $('.blurb').hide()
    $('#edit-blurb').hide();
})

$('#edit-email').click( function() {
    event.preventDefault();
    $('.email-input').show();
    $('.email').hide();
})

$('#edit-language').click( function() {
    event.preventDefault();
    $('.language-input').show()
})

$('#edit-timezone').click( function() {
    event.preventDefault();
    $('.timezone-input').show();
})

$('#gameSearch').focus( function() {
    $('.game-options').removeClass('hidden-list');
})

$('.edit').mousedown( function() {
    $('.input').hide();
    $('.user-info').show();
    $('.edit').show();
})

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
            // $('.game-options').each( function(i) {
            //     if($(this).text().toUpperCase().indexOf(filter) > -1) {
            //         $(this).show();
            //     } else {
            //         $(this).hide();
            //     }
            // });
        })
    }, 500)
})

let searchIgdb = () => {
    let userId = $('#user-name').attr('data')
    console.log(userId);
    let searchTerm = $('#gameSearch').val();
    document.location = `${userId}/${searchTerm}`;

}

// $('#gameSearch').focusout( function() {
    //     $('.game-options').addClass('hidden-list');
    // })
    
    $('#language').change( function() {
        $('#lang-submit').click();    
    })
    
    $('#timezone').change( function() {
        $('#timezone-submit').click();    
})

$('.edit').click( function() {
    $('.edit').show();
    $(this).hide();
})

$('.input').focusout( function() {
    $('.user-info').show();
    $('.edit').show();
})

//enter works to submit text inputs
$('.blurb-input').keypress( function() {
    if(event.keyCode == 13) {
        event.preventDefault();
        this.form.submit();
    }
})

$('.email-input').keypress( function() {
    if(event.keyCode == 13) {
        event.preventDefault();
        this.form.submit();
    }
})

//ajax call to game route, hits IGDB API
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
            console.log("ajax data", data)
            let parsed = JSON.parse(data);
            let gamelist = parsed.map( (game) => {
                return game.name;
            })
            resolve(gamelist);
        });
        
    });
}

$(document).on('click', "li.game-options", function() {
    console.log(this.textContent);
    $('#hidden-gamesearch').val(this.textContent);
    console.log($('#hidden-gamesearch').val());
    $('#hidden-game-submit').click();
})