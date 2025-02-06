document.addEventListener("DOMContentLoaded", () => {
    console.log("script.js geladen!");

    let teams = [];
    let scores = {};
    let currentTeamIndex = 0;
    let winningScore = 15;
    let timeLeft = 15;
    let timer;
    let wordsGuessed = 0;

    // Woorden inladen vanuit words.json
    let words = [];
    fetch("words.json")
        .then(response => response.json())
        .then(data => words = data);

    // Koppel knoppen aan functies
    document.getElementById("startGame").addEventListener("click", showTeamSetup);
    document.getElementById("addTeam").addEventListener("click", addTeam);
    document.getElementById("startRound").addEventListener("click", startGame);
    document.getElementById("startRoundBtn").addEventListener("click", startRound);
    document.getElementById("correctWordBtn").addEventListener("click", correctWord);
    document.getElementById("nextTeamBtn").addEventListener("click", nextTeam);

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
        winningScore = parseInt(document.getElementById("scoreLimit").value);
        document.getElementById("setup").style.display = "none";
        document.getElementById("game").style.display = "block";
        nextTeam();
    }

    function startRound() {
        document.getElementById("startRoundBtn").style.display = "none";
        document.getElementById("correctWordBtn").style.display = "inline-block";
        timeLeft = 15;
        wordsGuessed = 0;
        document.getElementById("wordCounter").innerText = wordsGuessed;
        document.getElementById("timer").innerText = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endRound();
            }
        }, 1000);

        newWord();
    }

    function newWord() {
        let randomIndex = Math.floor(Math.random() * words.length);
        document.getElementById("word").innerText = words[randomIndex];
    }

    function correctWord() {
        wordsGuessed++;
        document.getElementById("wordCounter").innerText = wordsGuessed;
        if (timeLeft < 45) {
            timeLeft += 5; // Voeg 5 seconden toe, maar max 45 sec
        }
        newWord();
    }

    function endRound() {
        clearInterval(timer);
        document.getElementById("game").style.display = "none";
        document.getElementById("results").style.display = "block";

        let currentTeam = teams[currentTeamIndex];
        scores[currentTeam] += wordsGuessed;

        document.getElementById("finalScore").innerText = wordsGuessed;
        document.getElementById("totalScore").innerText = scores[currentTeam];
    }

    function nextTeam() {
        document.getElementById("results").style.display = "none";
        document.getElementById("game").style.display = "block";
        
        currentTeamIndex = (currentTeamIndex + 1) % teams.length;
        document.getElementById("currentTeam").innerText = teams[currentTeamIndex];

        if (Object.values(scores).some(score => score >= winningScore)) {
            alert("Er is een winnaar!");
            location.reload();
        } else {
            document.getElementById("startRoundBtn").style.display = "inline-block";
            document.getElementById("correctWordBtn").style.display = "none";
        }
    }
});
