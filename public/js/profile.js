'use strict';

let timeout = null;

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
$('#gameSearch').keyup( function() {
    clearTimeout(timeout);
    timeout = setTimeout( function() {
        getIgdbGames()
        .then( (data) => {
            if(data) {
                let formatedData = formatIGDBGames(data);
                console.log(formatedData);
                let filter = $('#gameSearch').val().toUpperCase();
                $('#game-list').empty();
                $('#game-list').show();
                for(let i = 0; i < data.length; i++) {
                    $('#game-list').append(`<li class="game-options" data-name="${data[i].name}" data-platform="${data[i].platform}"><a class="game-options">${formatedData[i]}</a></li>`);
                }
            } else {
                $('#game-list').empty();
            }
        });
    }, 500);
});

$(document).click(function(){
    $('#game-list').hide();
    $('#gameSearch').val('');
}); 

//click enter to submit user info
$('.input').keydown( function(event) {
    if(event.keyCode == 13) {
        event.preventDefault();
        let newInput = $(this).val();
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
    addGame($(this).attr('data-name'), parseInt($(this).attr('data-platform')))
    .then( (data) => {
        $('#game-list').empty();
        $('.game-add-input').val("");
        location.reload();
    });
});

let letParseGameInfo

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
            resolve(data);
        }); 
    });
};

let platformKey = {
    6: 'PC',
    49: 'XBOX1',
    48: 'PS4',
    130: 'Switch',
    12: 'XBOX 360',
    9: 'PS3'
};

let formatIGDBGames = (games) => {
    return games.map( (game) => {
        return `${game.name} - ${platformKey[game.platform]}`
    });
;}

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
let addGame = (gameName, platform) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"POST",
            data: { gameName, platform },
            url: `/games/`,
            success: function () { },
            error: function () { }
        })
        .then( (data) => {
            resolve(data);
        });
    });
};

let addUserImage = (image) => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"PUT",
            data: { image },
            url: `/user/images`,
            success: function () {
                console.log("success");
             },
            error: function () { }
        })
        .then( (data) => {
            console.log("then");
            resolve(data);
        });
    });
};

let addTempImage = (image) => {
    let tempTag = true;
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"PUT",
            data: { image, tempTag },
            url: `/user/images`,
            success: function () {
                console.log("success");
             },
            error: function () { }
        })
        .then( (data) => {
            console.log("then");
            resolve(data);
        });
    });
};

//******croppie******

//takes image from URL and applies it to the cropper    
let basic;

let initializeCroppie = () => {
    let userID = $('#user-name').attr('data');
    basic = $('#crop-body').croppie({
        viewport: {
            width: 200,
            height: 200
        },
        showZoomer: false
    });
    basic.croppie('bind', {
        url: `https://s3.us-east-2.amazonaws.com/down2game/temp/${userID}`,
    });
};

$('#img-url').on('input', function (e) {
    clearTimeout(timeout);
    timeout = setTimeout( function() {
        let imageURL = $('#img-url').val();
        $('.cr-slider-wrap').remove();
        $('.cr-boundary').remove();
        $('#spinner').show();   
        getDataUri(imageURL, function (base64) {
            addTempImage(base64)
            .then( (data) => {
                initializeCroppie();
                $('#spinner').hide();
            });
        });
    }, 500);
});

$('#save-img').on('click', function (event) {
    basic.croppie('result', {
		type: 'base64',
		size: {
			width: 400,
			height: 400
		}
    })
    .then( (data) => {
        $('.cr-slider-wrap').hide();
        $('.cr-boundary').hide();
        $('#spinner').show();
        addUserImage(data)
        .then( (data2) => {
            location.reload();
        });
    });
});

// image proxy
let getDataUri = function (url, cb) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        let reader = new FileReader();
        reader.onloadend = function () {
            cb(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    xhr.open('GET', proxyUrl + url);
    xhr.responseType = 'blob';
    xhr.send();
};