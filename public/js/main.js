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

//filters games in database by search input
$('#gameSearch').keyup( function() {
    let filter = $('#gameSearch').val().toUpperCase();
    $('.game-options').each( function(i) {
        if($(this).text().toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
})


$('.game-options').mousedown( function() {
    event.preventDefault();
    console.log(event.target.textContent);
    $('#hidden-gamesearch').val(event.target.textContent);
    $('hidden-game-submit').click();
})

$('#gameSearch').focusout( function() {
    $('.game-options').addClass('hidden-list');
})

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