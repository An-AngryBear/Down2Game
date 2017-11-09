'use strict';

// done as ifs for speed of image load

if(window.location.pathname === '/login') {
    $('#body').css('background-image', 'url(/public/imgs/gamepad.jpeg')
}

if(window.location.pathname.indexOf('/user/') >= 0) {
    $('#body').css('background-image', 'url(/public/imgs/background.jpg')
    // $('#body').css('background-image', 'url(/public/imgs/keyboard.jpg')
}

if(window.location.pathname === '/inbox') {
    $('#body').css('background-image', 'url(/public/imgs/bluegamepad.jpg')
}

if(window.location.pathname === '/') {
    $('#body').css('background-image', 'url(/public/imgs/ds4.jpeg')
}

if(window.location.pathname === '/register') {
    $('#body').css('background-image', 'url(/public/imgs/keyboard.jpg')
}
