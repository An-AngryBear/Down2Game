$('#edit-blurb').click( function() {
    event.preventDefault();
    $('.blurb-input').toggleClass('hidden-blurb');
    $('.blurb').toggleClass('hidden-blurb');
    $('.submit-blurb').toggleClass('hidden-blurb');
})

$('#edit-email').click( function() {
    event.preventDefault();
    $('.email-input').toggleClass('hidden-email');
    $('.email').toggleClass('hidden-email');
    $('.submit-email').toggleClass('hidden-email');
    
})

$('#edit-language').click( function() {
    event.preventDefault();
    $('.language-input').toggleClass('hidden-language');
    $('.language').toggleClass('hidden-language');
    $('.submit-language').toggleClass('hidden-language');
    
})

$('#edit-timezone').click( function() {
    event.preventDefault();
    $('.timezone-input').toggleClass('hidden-timezone');
    $('.timezone').toggleClass('hidden-timezone');
    $('.submit-timezone').toggleClass('hidden-timezone');
    
})
