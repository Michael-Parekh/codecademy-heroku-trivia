const startContainerElement = document.getElementById("start-trivia");
const startButtonElement = document.getElementById("button-start");

const questionContainerElement = document.getElementById("trivia-container");
const questionTextElement = document.getElementById("question");
const pointsTextElement = document.getElementById("points");
const trueButtonElement = document.getElementById("button-true");
const falseButtonElement = document.getElementById("button-false");

const endContainerElement = document.getElementById("end-trivia");
const leaderboardListElement = document.getElementById("leaderboard-list");
const restartButtonElement = document.getElementById("button-restart");
const endPointsTextElement = document.getElementById("final-points");

let currentQuestion;
let questionNumber;
let points;

startButtonElement.addEventListener("click", beginTrivia);

function beginTrivia() {
  questionNumber = 0;
  points = 0;
  pointsTextElement.innerText = points + " Points";

  endContainerElement.classList.add("hidden");
  startContainerElement.classList.add("hidden");
  questionContainerElement.classList.remove("hidden");

  nextTriviaQuestion();
}

function nextTriviaQuestion() {
    if (questionNumber >= questions.length) {
      endTrivia();
      return;
    }

    currentQuestion = questions[questionNumber];
    showTriviaQuestion(currentQuestion);
}

function showTriviaQuestion(question) {
  questionTextElement.innerText = question.question;
  trueButtonElement.addEventListener("click", checkTriviaAnswer);
  falseButtonElement.addEventListener("click", checkTriviaAnswer);
}

function checkTriviaAnswer(event) {
  const selectedAnswer = event.target;

  if ((currentQuestion.answers[0] == "correct" && selectedAnswer.innerText == "True")
    || (currentQuestion.answers[1] == "correct" && selectedAnswer.innerText == "False")) {
      points += currentQuestion.points;
      document.body.classList.add("correct");
  } else {
    points -= currentQuestion.points;
    document.body.classList.add("incorrect");
  }
  pointsTextElement.innerText = points + " Points";

  setTimeout(function () {
    document.body.classList.remove("correct");
    document.body.classList.remove("incorrect");
    questionNumber += 1;
    nextTriviaQuestion();
  }, 1000);
}

function endTrivia() {
  sendTriviaPoints(points);

  endContainerElement.classList.remove("hidden");
  questionContainerElement.classList.add("hidden");
  endPointsTextElement.innerText = "You scored a total of " + points + " points!";
  restartButtonElement.addEventListener("click", beginTrivia);

  showTriviaLeaderboard();
}

function sendTriviaPoints(data) {
  fetch("/points", {
    method: "POST", 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      points: data
    })
  }).then(res => {
    console.log("Response: ", res);
  })
  .catch(err => console.log(err));
}

function showTriviaLeaderboard() {
  fetch("/points", {
    method: "GET"
  })
    .then(res => res.json())
    .then(res => {
      let allPoints = []
      for (i = 0; i < res.length; i++) {
        allPoints[i] = res[i].points;
      }
      leaderboard = allPoints.sort((a, b) => b - a).slice(0,5);

      let index = 1;
      listItems = leaderboard.reduce((result, data) => {
        result += `<li>#${index} ${data} Points</li>`;
        index++;
        return result;
      }, '');
      leaderboardListElement.innerHTML = listItems;
    })
    .catch(err => console.log(err));
}

const questions = [
  {
    question: "The top day annually for candy sales is October 31st, right on Halloween.",
    points: 5,
    answers: ["incorrect", "correct"]
  },
  {
    question: "Samhainophobia is the fear of Halloween.",
    points: 10,
    answers: ["correct", "incorrect"]
  },
  {
    question: "Halloween is the third most commercially successful holiday, coming behind Valentine's Day and Christmas.",
    points: 5,
    answers: ["incorrect", "correct"]
  },
  {
    question: "Ireland is typically believed to be the birthplace of Halloween.",
    points: 10,
    answers: ["correct", "incorrect"]
  },
  {
    question: "Halloween has variously been called All Hallows’ Eve, Witches Night, Lamswool, Snap-Apple Night, Samhaim, and Summer’s End.",
    points: 5,
    answers: ["correct", "incorrect"]
  }
]