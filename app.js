 var questions = [
    {
        question: "What does HTML stand for?",
        options: [ "Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        question: "Which HTML tag is used to create a paragraph?",
        options: [ "<h1>","<p>","<br>","<para>" ],
        answer: 1
    },
    {
        question: "Which CSS property changes text color?",
        options: ["font-color","text-color","color","text-style" ],
        answer: 2
    },
    {
        question: "Which CSS property changes background color?",
        options: [ "bgcolor", "background-color", "background-style", "color-background"],
        answer: 1
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        options: [ ".", "#", "*", "@"],
        answer: 1
    },
    {
        question: "Which keyword can declare a variable in JavaScript?",
        options: [ "var", "variable", "int","string"],
        answer: 0
    },
    {
        question: "Which method selects an element by ID?",
        options: [ "getElementById()", "getElement()", "selectById()", "findElement()"],
        answer: 0
    },
    {
        question: "Which symbol creates a single-line comment in JavaScript?",
        options: [ "<!-- -->", "/* */", "//", "#"],
        answer: 2
    },
    {
        question: "Which HTML tag creates a link?",
        options: [ "<link>", "<a>", "<href>", "<url>"],
        answer: 1
    },
    {
        question: "Which CSS property makes text bold?",
        options: [ "font-style", "text-bold", "font-weight", "text-weight"],
        answer: 2
    }
];

var currentQuestion = 0;
var score = 0;
var timeLeft = 10;
var timer;
var answered = false;


var startScreen = document.getElementById("start-screen");
var quizScreen = document.getElementById("quiz-screen");
var resultBox = document.getElementById("result-box");

var questionElement = document.getElementById("question");
var questionNumber = document.getElementById("question-number");

var options = document.querySelectorAll(".option");

var timerElement = document.getElementById("timer");
var timerProgress = document.getElementById("timer-progress");

var scoreElement = document.getElementById("score");

var nextButton = document.getElementById("next-btn");

var finalScore = document.getElementById("final-score");
var resultMessage = document.getElementById("result-message");



function startQuiz() {

    currentQuestion = 0;
    score = 0;

    startScreen.style.display = "none";
    resultBox.style.display = "none";
    quizScreen.style.display = "block";

    scoreElement.textContent = "Score: 0";

    loadQuestion();
}

function loadQuestion() {

    clearInterval(timer);

    answered = false;
    timeLeft = 10;

    var question = questions[currentQuestion];

    questionElement.textContent = question.question;

    questionNumber.textContent =
        "Question " + (currentQuestion + 1) + " / " + questions.length;

    scoreElement.textContent =
        "Score: " + score;


    options.forEach(function(button, index) {

        button.textContent = question.options[index];

        button.disabled = false;

        button.classList.remove("correct");
        button.classList.remove("wrong");

    });


    nextButton.style.display = "none";

    timerElement.textContent = timeLeft;

    timerProgress.style.width = "100%";

    startTimer();
}


function startTimer() {

    timer = setInterval(function() {

        timeLeft--;

        timerElement.textContent = timeLeft;

        timerProgress.style.width =
            (timeLeft / 10) * 100 + "%";


        if (timeLeft === 0) {

            clearInterval(timer);

            timeUp();

        }

    }, 1000);
}


function selectAnswer(selectedIndex) {

    if (answered) {
        return;
    }

    answered = true;

    clearInterval(timer);

    var correctAnswer = questions[currentQuestion].answer;


    options.forEach(function(button) {
        button.disabled = true;
    });


    if (selectedIndex === correctAnswer) {

        options[selectedIndex].classList.add("correct");

        score += 10;

    } else {

        options[selectedIndex].classList.add("wrong");

        options[correctAnswer].classList.add("correct");

    }


    scoreElement.textContent = "Score: " + score;

    nextButton.style.display = "block";
}


function timeUp() {

    if (answered) {
        return;
    }

    answered = true;

    var correctAnswer = questions[currentQuestion].answer;


    options.forEach(function(button) {
        button.disabled = true;
    });


    options[correctAnswer].classList.add("correct");

    nextButton.style.display = "block";
}


function nextQuestion() {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResult();

    }
}


function showResult() {

    clearInterval(timer);

    quizScreen.style.display = "none";
    resultBox.style.display = "block";

    finalScore.textContent = score + " / 100";


}


function restartQuiz() {

    clearInterval(timer);

    currentQuestion = 0;
    score = 0;
    timeLeft = 10;

    resultBox.style.display = "none";
    quizScreen.style.display = "none";
    startScreen.style.display = "block";

    scoreElement.textContent = "Score: 0";
    timerElement.textContent = "10";
    timerProgress.style.width = "100%";
}