'use strict';

//sidebar
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

$(document).on('click', ".filter-btn", function() {
    console.log($('#slide').height())
    $('#slide').height() == 0 || $('#slide').height() == ''
        ? $('#slide').height(200)
        : $('#slide').height(0)
});

