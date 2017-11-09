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

let answerCount = parseInt($('.useranswer-length').attr('data'));
$('.radio-input').click( function() {
    let questionLength = parseInt($('.question-length').attr('data'));
    console.log("questionlength", questionLength, "answerCount", answerCount)
    let currentUser = $('#quest-container').attr('data');
    let userAnswer = $(this).val();
    let question = $(this).closest('.panel-body').siblings('.panel-heading').attr('id');
    let questId = parseInt(question);
    $(this).closest('.panel').removeClass('panel-danger').addClass('panel-success');
    postAnswerSelection(currentUser, userAnswer, questId);
    if(answerCount !== questionLength) {
        answerCount++;
        if(answerCount === questionLength) {
            $('#quest-container').prepend(`
                <div class="row">
                    <div class="col.lg-12">
                        <a class="see-matches-link" href="/user/${currentUser}/matches"><button class="btn btn-primary prof-btns">See Your Matches!</button></a>
                    </div
                </div>`)
            window.location.href="#quest-container";
        }
    }
});
