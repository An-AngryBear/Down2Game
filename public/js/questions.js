let postAnswerSelection = (currentUser, userAnswer, questId) => {
    console.log("post answer called");
    return new Promise( (resolve, reject) => {
        $.ajax({
            type:"POST",
            data: {
                AnswerId: userAnswer,
                QuestionId: questId
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
    let question = $(this).closest('.panel-body').siblings('.panel-heading').attr('id');
    let questId = parseInt(question);
    $(this).closest('.panel').removeClass('panel-danger').addClass('panel-success');
    postAnswerSelection(currentUser, userAnswer, questId);
});