
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";


var historyList = document.getElementById("history-list");
var historyMessage = document.getElementById("history-message");
var userEmail = document.getElementById("user-email");
var refreshButton = document.getElementById("refresh-btn");

var loggedInUser = null;
var authReady = false;

onAuthStateChanged(auth, async function(user) {
    authReady = true;

    if (!user) {
        userEmail.textContent = "You are not logged in.";
        historyMessage.textContent =
            "Please log in to view your quiz history.";

        historyList.replaceChildren();

        return;
    }

    loggedInUser = user;

    userEmail.textContent =
        "Logged in as: " + (user.email || user.displayName || "User");

    await loadHistory();
});


refreshButton.addEventListener("click", function() {
    if (!authReady) {
        historyMessage.textContent = "Checking your login...";
        return;
    }

    if (!loggedInUser) {
        historyMessage.textContent = "Please log in first.";
        return;
    }

    loadHistory();
});


async function loadHistory() {
    if (!loggedInUser) {
        return;
    }

    historyMessage.textContent = "Loading your quiz history...";
    historyList.replaceChildren();
    refreshButton.disabled = true;

    try {
        var historyQuery = query(
            collection(db, "quizHistory"),
            where("userId", "==", loggedInUser.uid)
        );

        var snapshot = await getDocs(historyQuery);

        if (snapshot.empty) {
            historyMessage.textContent =
                "No quiz history found. Complete a quiz to see your results here.";

            return;
        }

        var attempts = [];

        snapshot.forEach(function(documentSnapshot) {
            attempts.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            });
        });

        attempts.sort(function(a, b) {
            var dateA = a.completedAt
                ? a.completedAt.toMillis()
                : 0;

            var dateB = b.completedAt
                ? b.completedAt.toMillis()
                : 0;

            return dateB - dateA;
        });

        historyMessage.textContent =
            "You have completed " + attempts.length + " quiz attempt(s).";

        attempts.forEach(function(attempt, index) {
            createHistoryCard(attempt, index + 1);
        });

    } catch (error) {
        console.error("History loading error:", error);

        historyMessage.textContent =
            "Unable to load history. Check your internet connection and Firestore rules.";

    } finally {
        refreshButton.disabled = false;
    }
}


function createHistoryCard(attempt, attemptNumber) {
    var card = document.createElement("div");
    card.className = "history-card";

    var heading = document.createElement("h2");
    heading.textContent = "Quiz Attempt " + attemptNumber;
    card.appendChild(heading);

    var dateParagraph = document.createElement("p");

    var completedDate = attempt.completedAt
        ? attempt.completedAt.toDate().toLocaleString()
        : "Date unavailable";

    dateParagraph.textContent = "Completed: " + completedDate;
    card.appendChild(dateParagraph);

    var scoreParagraph = document.createElement("p");
    scoreParagraph.textContent =
        "Score: " + attempt.score + " / 100";
    card.appendChild(scoreParagraph);

    var correctParagraph = document.createElement("p");
    correctParagraph.textContent =
        "Correct answers: " +
        (attempt.correctAnswers ?? 0) +
        " / " +
        (attempt.totalQuestions ?? 10);

    card.appendChild(correctParagraph);

    var answersHeading = document.createElement("h3");
    answersHeading.textContent = "Your Answers";
    card.appendChild(answersHeading);

    if (Array.isArray(attempt.answers)) {
        attempt.answers.forEach(function(answer, index) {
            if (!answer) {
                return;
            }

            var answerBox = document.createElement("div");

            answerBox.className = "answer-item " +
                (answer.isCorrect ? "correct-answer" : "wrong-answer");

            var question = document.createElement("p");
            question.textContent =
                (index + 1) + ". " + answer.question;

            var selected = document.createElement("p");
            selected.textContent =
                "Your answer: " +
                (answer.selectedAnswer || "Not answered (time expired)");

            var correct = document.createElement("p");
            correct.textContent =
                "Correct answer: " + answer.correctAnswer;

            var result = document.createElement("strong");
            result.textContent = answer.isCorrect
                ? "Correct"
                : "Incorrect";

            answerBox.appendChild(question);
            answerBox.appendChild(selected);
            answerBox.appendChild(correct);
            answerBox.appendChild(result);

            card.appendChild(answerBox);
        });
    }

    historyList.appendChild(card);
}
