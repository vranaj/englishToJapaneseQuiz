    var timer = 0; // timer initial value
    var maxTime = 1200; // timer maximum value
    var interval;
    var questionStatus = [];
    var qsSelectedBlock = 0;
    var totalScore = 0;

    var dataSetOrigin = [ // original dataset
        {
            verb: 'eats',
            conjugation: ['eats','eats','eats','eats','eats','eats'],
            sub: ['I','she','he','we','they','you'],
                obj: ['umeboshi', 'rice', 'okonomiyaki'],
            location: ['at home', 'in office'],

            j_verb: 'tabemasu',
            j_conjugation: ['tabemasu','tabemasu','tabemasu','tabemasu','tabemasu','tabemasu'],
            j_sub: ['watashi wa', 'kanojo wa', 'kare wa', 'wareware wa', 'karera wa', 'anata wa'],
            j_obj: ['umeboshi o', 'gohan o', 'okonomiyaki o'],
            j_location: ['ie de', 'office de'],

            j_verb_script: '食べます',
            j_conjugation_script: ['食べます','食べます','食べます','食べます','食べます','食べます'],
            j_sub_script: ['私は', '彼女は', '彼は', '我々は', '彼らは', 'あなたは'],
            j_obj_script: ['梅干しを', 'ご飯を', 'お好み焼きを'],
            j_location_script: ['家で', 'オフィスで'],


        },
        {
            verb: 'drinks',
            conjugation: ['drink','drinks','drinks','drink','drink','drink'],
            sub: ['I','she','he','we','they','you'],
            obj: ['tea', 'coffee', 'water'],
            location: ['at home', 'in a cafe'],

            j_verb: 'nomimasu',
            j_conjugation: ['nomimasu','nomimasu','nomimasu','nomimasu','nomimasu','nomimasu'],
            j_sub: ['watashi wa', 'kanojo wa', 'kare wa', 'wareware wa', 'karera wa', 'anata wa'],
            j_obj: ['tea o', 'coffee o', 'water o'],
            j_location: ['ie de', 'cafe de'],

            j_verb_script: '飲みます',
            j_conjugation_script: ['飲みます','飲みます','飲みます','飲みます','飲みます','飲みます'],
            j_sub_script: ['私は', '彼女は', '彼は', '我々は', '彼らは', 'あなたは'],
            j_obj_script: ['お茶を', 'コーヒーを', '水を'],
            j_location_script: ['家で', 'カフェで'],
        },
        {
            verb: 'reads',
            conjugation: ['read','reads','reads','read','read','read'],
            sub: ['I','she','he','we','they','you'],
            obj: ['a book', 'a newspaper'],
            location: ['in library', 'at home'],

            j_verb: 'yomimasu',
            j_conjugation: ['yomimasu','yomimasu','yomimasu','yomimasu','yomimasu','yomimasu'],
            j_sub: ['watashi wa', 'kanojo wa', 'kare wa', 'wareware wa', 'karera wa', 'anata wa'],
            j_obj: ['hon o', 'shinbun o'],
            j_location: ['toshokan de', 'ie de'],


            j_verb_script: '読みます',
            j_conjugation_script: ['読みます','読みます','読みます','読みます','読みます','読みます'],
            j_sub_script: ['私は', '彼女は', '彼は', '我々は', '彼らは', 'あなたは'],
            j_obj_script: ['本を', '新聞を'],
            j_location_script: ['図書館で', '家で'],
        }
    ];

    var tempDataSet = [];// temporary array to functional use
    tempDataSet = dataSetOrigin;



    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    var speechRecTimer = 0;
    var maxSpeechRecTimer = 10;
    var speechAnswer = '';
    var speechInterval;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "ja-JP";


    recognition.onstart = function(event){
        // console.log('You can speak now!!!');
        $('#recordingWarning').text('You can speak now!!!');

    }

    recognition.onerror = function(event){
        // console.log(event);
        // console.log('listening error');
        speechAnswer = '';
        $('#recordingWarning').text('');

    }

    recognition.onresult = function(event){
        // console.log(event);
        // console.log('User sound input found');
        $('#recordingWarning').text('');
        if (event && event.results && event.results[0] && event.results[0][0]) {
            var text = event.results[0][0].transcript;
            // console.log(text);
            speechAnswer = text;
            clearInterval(speechInterval);
            speechRecTimer = 0;
            checkJaText();
        } else {
            speechAnswer = ''
        }

    }

    function soundCountDown() {
        clearInterval(speechInterval);
        speechRecTimer = 0;
        speechInterval = setInterval(function(){
            if (speechRecTimer < maxSpeechRecTimer) { // validate the timer with maximum time limit
                speechRecTimer = speechRecTimer + 1;
                // console.log(speechRecTimer);
            } else {
                clearInterval(speechInterval);
                speechRecTimer = 0;
                checkJaText();
            }

        }, 1000);
    }

    function startSR() {
        stopSR();
        // console.log('listening start');
        recognition.start();
        soundCountDown();
    }

    function stopSR() {
        // console.log('listening Stop');
        recognition.stop();
        // $('#recordingWarning').text('');
    }

    function checkJaText(){
        // console.log(speechAnswer);
        // console.log('Testing the sound');
        $('#recordingWarning').text('');
        if (questionStatus[qsSelectedBlock] && questionStatus[qsSelectedBlock].answered == null) {
            $('#userInput').prop('disabled', true);
            // console.log(speechAnswer);
            // console.log(questionStatus[qsSelectedBlock].japAnswer);
            stopSR();


            if(speechAnswer == questionStatus[qsSelectedBlock].japAnswer) {
                questionStatus[qsSelectedBlock].answered = true;


                setTimeout(() => {
                    speechAnswer = '';
                    playJsAnswerSound(questionStatus[qsSelectedBlock].japAnswer);
                    showCorrect();
                }, 500)
            } else {
                questionStatus[qsSelectedBlock].answered = false;


                setTimeout(() => {
                    speechAnswer = '';
                    playJsAnswerSound(questionStatus[qsSelectedBlock].japAnswer);
                    showWrong();
                }, 500)

            }
        }

    }

    function playJsAnswerSound(text) {
        var speech = new SpeechSynthesisUtterance();
        speech.lang = "ja";
        speech.text = text;
        // console.log('speaking right answer');
        window.speechSynthesis.speak(speech);
    }

    function setTimer() {
        clearInterval(interval);
        timer = 0;
        interval = setInterval(function(){
            if (timer < maxTime) { // validate the timer with maximum time limit
                timer = timer + 1;

                var tempHoursCount = Math.floor(timer/3600);
                var tempMinutesCount = Math.floor(timer/60);
                var tempSceondsCount = timer - (tempMinutesCount * 60);

                $('#hoursCell').text(String(tempHoursCount).padStart(2, '0'));
                $('#minutesCell').text(String(tempMinutesCount).padStart(2, '0'));
                $('#secondsCell').text(String(tempSceondsCount).padStart(2, '0'));

            } else {
                $('#question').text('Quiz Finished');
            }

        }, 1000);



    }

    function loadQuestion() {
        resetPage();

        if (timer < maxTime) { // validate the timer with maximum time limit

            var rndmLevel1 = (Math.floor((Math.random() * (tempDataSet.length)))); // get random number to verb
            var rndmLevel2 = (Math.floor((Math.random() * (tempDataSet[rndmLevel1]['obj'].length)))); // get random number to object
            var rndmLevel3 = (Math.floor((Math.random() * (tempDataSet[rndmLevel1]['location'].length)))); // get random number to location
            var rndmLevel4 = (Math.floor((Math.random() * (tempDataSet[rndmLevel1]['sub'].length)))); // get random number to location


            var tempText =  tempDataSet[rndmLevel1]['sub'][rndmLevel4] + ' ' + tempDataSet[rndmLevel1]['conjugation'][rndmLevel4] + ' ' + tempDataSet[rndmLevel1]['obj'][rndmLevel2] + ' ' + tempDataSet[rndmLevel1]['location'][rndmLevel3];
            // var answer =  tempDataSet[rndmLevel1]['j_sub'][rndmLevel4] + ' ' +  tempDataSet[rndmLevel1]['j_location'][rndmLevel3] +  ' ' + tempDataSet[rndmLevel1]['j_obj'][rndmLevel2] + ' '  + tempDataSet[rndmLevel1].j_verb ; // load the text from the data list using  array index
            var answer =  tempDataSet[rndmLevel1]['j_sub'][rndmLevel4] + ' ' +  tempDataSet[rndmLevel1]['j_location'][rndmLevel3] +  ' ' + tempDataSet[rndmLevel1]['j_obj'][rndmLevel2] + ' '  + tempDataSet[rndmLevel1]['j_conjugation'][rndmLevel4] ; // load the text from the data list using  array index
            $('#question').text(tempText); // set the question text
            // $('#answer').text(answer); // set the answer text
            // $('#showButton').show();
            // console.log(answer);

            addQuestionStatus(tempDataSet[rndmLevel1]['sub'][rndmLevel4], tempDataSet[rndmLevel1]['j_sub'][rndmLevel4], false, null, tempDataSet[rndmLevel1]['j_sub_script'][rndmLevel4]);
            addQuestionStatus(tempDataSet[rndmLevel1]['location'][rndmLevel3], tempDataSet[rndmLevel1]['j_location'][rndmLevel3], false, null, tempDataSet[rndmLevel1]['j_location_script'][rndmLevel3]);
            addQuestionStatus(tempDataSet[rndmLevel1]['obj'][rndmLevel2], tempDataSet[rndmLevel1]['j_obj'][rndmLevel2], false, null, tempDataSet[rndmLevel1]['j_obj_script'][rndmLevel2]);
            addQuestionStatus(tempDataSet[rndmLevel1]['conjugation'][rndmLevel4], tempDataSet[rndmLevel1]['j_conjugation'][rndmLevel4], false, null, tempDataSet[rndmLevel1]['j_conjugation_script'][rndmLevel4]);

            checkQuestionBlockIndex();
        } else {
            $('#question').text('Quiz Finished'); // set finished text
        }

    }

    function addQuestionStatus(questionText, answerText, dispaly, answeredOrNot , japaneseAnswer) { // add block to the array
        questionStatus.push({
            question: questionText,
            answer: answerText,
            dispalyed: dispaly,
            answered: answeredOrNot,
            japAnswer: japaneseAnswer
        });

        // console.log(questionStatus);

    }

    function checkQuestionBlockIndex() { // check the current block
        if (questionStatus[questionStatus.length-1].dispalyed == true) {
            calculateScore();
            return;
        } else {
            displayBlock();
        }

    }

    function displayBlock() { // to display question block

        if ($('#hideHint').is(':checked') == false) {
            $('#subQuestion').text('(' + questionStatus[qsSelectedBlock].question + ')');
        }

        questionStatus[qsSelectedBlock].dispalyed = true;
        $('#subQuestion').animate({
            opacity: 1,
            marginDown: ($('#questionBlock').height()/2)  - $('#subQuestion').width(),
            borderWidth: "10px"
        }, 20 );

        // $('#voiceRecognition').click();
        startSR();

        $('#userInput').val('');
        $('#userInput').prop('disabled', false);
        $('#userInput').focus();
    }

    function displayAnswerBlock() { // to display answer block

        $('#subAnaswer').text(questionStatus[qsSelectedBlock].answer);
        $('#subAnaswer').animate({
            opacity: 1,
            marginLeft: 0,
            borderWidth: "10px"
        }, 20 );
        resetBlock();

    }

    function showIncompleteAnswer() {
        var tempAnswer = '';
        questionStatus.forEach(function(tempQuestion, index) {
            if (tempQuestion.dispalyed == true) {
                tempAnswer = tempAnswer + ' ' + tempQuestion.answer;
            }
        });
        $('#answer').text(tempAnswer);
        setTimeout(function() {
            $('#answer').fadeIn('show');
        }, 20);

    }

    function calculateScore() { // calculate the score
        var tempScore = 0;
        questionStatus.forEach(function(tempQuestion, index) {
            if (tempQuestion.answered == false) {
                tempScore = tempScore - 0.25;
            } else {
                tempScore = tempScore + 0.25;
            }
        });

        if (tempScore < 0) {
            tempScore = 0;
        }

        totalScore = Number(totalScore) + Number(tempScore);
        $('#totalSCore').text(String(totalScore).padStart(2,'0'));

        if (Number(tempScore) > 0.5) {
            var beepsound = new Audio('./yeah.mp3');
            if($('#muteSound').is(':checked') == false) {
                beepsound.play();
            }

        }

        // if (Number(totalScore) < 0) {
        //     $('#totalSCore').text(String(0).padStart(2,'0'));
        // } else {
        //     $('#totalSCore').text(String(totalScore).padStart(2,'0'));
        // }

        showAnswer();
    }

    function showAnswer() { // to show the total answer
        if ($('#answer').text().length > 0) {
            $('#answer').slideDown('show');
        }
        //
        // $('#showButton').hide();
        $('#nextButton').show();
    }


    function moveToNextQs() { // to move to next question
        loadQuestion();
    }

    function resetPage() { // reset whole page to next question
        $('#question').text('');
        $('#answer').text('');
        $('#answer').hide();
        $('#showButton').hide();
        $('#nextButton').hide();
        $('#correctIcon').hide();
        $('#wrongIcon').hide();
        $('#subAnaswer').text('');
        $('#subQuestion').text('');
        questionStatus = [];
        qsSelectedBlock = 0;
    }

    function resetBlock() { // reset block content to next block
        setTimeout(function() {
            $('#userInput').val('');
            $('#correctIcon').hide();
            $('#wrongIcon').hide();
            $('#subAnaswer').text('');
            $('#subQuestion').text('');

            qsSelectedBlock++;
            checkQuestionBlockIndex()
        }, 500);
    }

    function showCorrect() { // show if answer is correct
        $('#correctIcon').show();
        var beepsound = new Audio('./correct.mp3');

        if($('#muteSound').is(':checked') == false) {
            beepsound.play();
        }

        // $('#userInput').css('border', '5px solid green');

        setTimeout(function() {
            $('#correctIcon').hide();
            resetBlock();
            showIncompleteAnswer();
            // $('#userInput').css('border', '');
        },1000);
    }

    function showWrong() {// show if answer is wrong
        $('#wrongIcon').show();
        var beepsound = new Audio('./wrong.mp3');
        if($('#muteSound').is(':checked') == false) {
            beepsound.play();
        }

        // $('#userInput').css('border', '5px solid red');

        setTimeout(function() {
            $('#wrongIcon').hide();
            // $('#userInput').css('border', '');
            displayAnswerBlock();
            showIncompleteAnswer();
        }, 1000);
    }

    function startTheQuiz() {
        loadQuestion(); // load question
        setTimer(); // start the timer
    }

    $(document).ready(function () {

        $('#userInput').on('keypress', function(event) { // check user input
            if ((event.keyCode == 13) && (timer < maxTime)) {
                event.preventDefault();

                $('#userInput').prop('disabled', true);
                playJsAnswerSound(questionStatus[qsSelectedBlock].japAnswer);
                stopSR();

                if($('#userInput').val() == questionStatus[qsSelectedBlock].answer) {
                    showCorrect();
                    questionStatus[qsSelectedBlock].answered = true;
                } else {
                    showWrong();
                    questionStatus[qsSelectedBlock].answered = false;
                }
            }

        });

        $('#hideHint').on('change', function() {
            if ($('#hideHint').is(':checked') == false) {
                $('#subQuestion').text('(' + questionStatus[qsSelectedBlock].question + ')');
            } else {
                $('#subQuestion').text('');
            }
        })
    });
