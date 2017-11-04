let postAnswerSelection = (currentUser, userAnswer) => {
    console.log("post answer called");
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"POST",
            data: {
                AnswerId: userAnswer
            },
            url: `/user/${currentUser}/questions`,
            success: function () { },
            error: function () { }
        })
        .then( (data) => {
            console.log("Success!")
            resolve(data);
        });
    });
}


$('.radio-input').click( function() {
    let currentUser = $('#quest-container').attr('data');
    let userAnswer = $(this).val();
    postAnswerSelection(currentUser, userAnswer);
});