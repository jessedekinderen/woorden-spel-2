let words = [];

fetch("words.json") // Haalt woorden op uit het JSON-bestand
    .then(response => response.json()) 
    .then(data => words = data)
    .catch(error => console.error("Fout bij het laden van woorden:", error));

let teams = [];
let scores = {};
let currentTeamIndex = 0;
let winningScore = 10;
let timeLeft = 30;
let timer;

// Voeg team toe
function addTeam() {
    let teamInput = document.getElementById("teamName").value;
    if (teamInput && !teams.includes(teamInput)) {
        teams.push(teamInput);
        scores[teamInput] = 0;
        document.getElementById("teamList").innerHTML += `<li>${teamInput}</li>`;
        document.getElementById("teamName").value = "";
    }
}

// Start het spel
function startGame() {
    if (teams.length < 2) {
        alert("Voeg minimaal 2 teams toe!");
        return;
    }
    winningScore = parseInt(document.getElementById("scoreLimit").value);
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    updateScoreboard();
    nextTeam();
}

// Nieuw woord kiezen
function newWord() {
    let randomIndex = Math.floor(Math.random() * words.length);
    document.getElementById("word").innerText = words[randomIndex];
}

// Start de timer
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft === 0) clearInterval(timer);
    }, 1000);
}

// Punten toevoegen
function addPoints() {
    let points = parseInt(document.getElementById("pointsScored").value);
    let currentTeam = teams[currentTeamIndex];
    scores[currentTeam] += points;

    if (scores[currentTeam] >= winningScore) {
        alert(`${currentTeam} heeft gewonnen!`);
        location.reload();
        return;
    }

    updateScoreboard();
    nextTeam();
}

// Update scoreboard
function updateScoreboard() {
    let scoreboardHTML = "";
    teams.forEach(team => {
        scoreboardHTML += `<div class="team">${team}: ${scores[team]} punten</div>`;
    });
    document.getElementById("scoreboard").innerHTML = scoreboardHTML;
}

// Wissel team
function nextTeam() {
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    document.getElementById("currentTeam").innerText = teams[currentTeamIndex];
}
