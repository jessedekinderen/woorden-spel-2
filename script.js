let words = [];
fetch("words.json")
    .then(response => response.json())
    .then(data => words = data)
    .catch(error => console.error("Fout bij laden woorden:", error));

let teams = [];
let scores = {};
let currentTeamIndex = 0;
let timeLeft = 15;
let maxTime = 45;
let timer;
let wordsGuessed = 0;

function showTeamSetup() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("setup").style.display = "block";
}

function addTeam() {
    let teamInput = document.getElementById("teamName").value;
    if (teamInput && !teams.includes(teamInput)) {
        teams.push(teamInput);
        scores[teamInput] = 0;
        document.getElementById("teamList").innerHTML += `<li>${teamInput}</li>`;
        document.getElementById("teamName").value = "";
    }
}

function startGame() {
    if (teams.length < 2) {
        alert("Voeg minimaal 2 teams toe!");
        return;
    }
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("currentTeam").innerText = teams[currentTeamIndex];
}

function newWord() {
    document.getElementById("word").innerText = words[Math.floor(Math.random() * words.length)];
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    wordsGuessed = 0;
    updateTimer();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0 || timeLeft >= maxTime) {
            endRound();
        }
    }, 1000);
}

function correctWord() {
    wordsGuessed++;
    timeLeft = Math.min(timeLeft + 5, maxTime);
    document.getElementById("word").innerText = words[Math.floor(Math.random() * words.length)];
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerText = timeLeft;
}

function endRound() {
    clearInterval(timer);
    scores[teams[currentTeamIndex]] += wordsGuessed;
    document.getElementById("game").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("finalScore").innerText = wordsGuessed;
}

function nextTeam() {
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    document.getElementById("results").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("currentTeam").innerText = teams[currentTeamIndex];
    document.getElementById("word").innerText = "Klik op 'Start' om te beginnen";
}
