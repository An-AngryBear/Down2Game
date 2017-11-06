'use strict';

//sidebar
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

// document.getElementById( 'slide' ).addEventListener( 'click', function() {
//     ( this.style.height == '0px' || this.style.height == '' )
//         ? this.style.height = '150px' 
//         : this.style.height = '0px';
// }, false );

$(document).on('click', ".filter-btn", function() {
    console.log($('#slide').height())
    $('#slide').height() == 0 || $('#slide').height() == ''
        ? $('#slide').height(150)
        : $('#slide').height(0)
});

