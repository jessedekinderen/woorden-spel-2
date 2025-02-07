document.addEventListener("DOMContentLoaded", function() {
    let words = [];
    let teams = [];
    let scores = {};
    let currentTeamIndex = 0;
    let totalGameTime = 45; // Maximale speeltijd per ronde
    let roundTime = 15; // Starttijd per ronde
    let correctAnswers = 0;
    let extraTimeGiven = 0; // Houdt bij hoeveel keer extra tijd is gegeven
    let timer;
    let progressTimer;

    // Koppel knoppen aan functies
    document.getElementById("startGameBtn").addEventListener("click", showTeamSetup);
    document.getElementById("addTeamBtn").addEventListener("click", addTeam);
    document.getElementById("beginGameBtn").addEventListener("click", startGame);
    document.getElementById("newWordBtn").addEventListener("click", startRound);
    document.getElementById("correctWordBtn").addEventListener("click", correctWord);
    document.getElementById("nextTeamBtn").addEventListener("click", nextTeam);

    // Woorden laden uit words.json
    fetch("words.json")
        .then(response => response.json())
        .then(data => words = data);

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
        nextTeam();
    }

    function startRound() {
        document.getElementById("newWordBtn").style.display = "none";
        document.getElementById("correctWordBtn").style.display = "inline-block";

        startTimer();
        startProgressBar();
        newWord();
    }

    function newWord() {
        let randomIndex = Math.floor(Math.random() * words.length);
        document.getElementById("word").innerText = words[randomIndex];
    }

    function startTimer() {
        clearInterval(timer);
        document.getElementById("timer").innerText = roundTime;

        timer = setInterval(() => {
            roundTime--;
            document.getElementById("timer").innerText = roundTime;
            if (roundTime <= 0 || totalGameTime <= 0) {
                clearInterval(timer);
                endRound();
            }
        }, 1000);
    }

    function startProgressBar() {
        let progress = 100;
        let step = 100 / totalGameTime;

        clearInterval(progressTimer);
        progressTimer = setInterval(() => {
            progress -= step;
            document.getElementById("progress-bar").style.width = `${progress}%`;

            if (progress <= 0) {
                clearInterval(progressTimer);
                endRound();
            }
        }, 1000);
    }

    function correctWord() {
        if (correctAnswers < 6 && extraTimeGiven < 6) { 
            roundTime = Math.min(roundTime + 5, totalGameTime); // Extra tijd, maar nooit boven de 45 sec
            extraTimeGiven++; // Extra tijd tellen
        }
        
        correctAnswers++;
        document.getElementById("roundScore").innerText = correctAnswers;
        newWord();
    }

    function endRound() {
        clearInterval(timer);
        clearInterval(progressTimer);

        let currentTeam = teams[currentTeamIndex];
        scores[currentTeam] += correctAnswers;

        document.getElementById("game").style.display = "none";
        document.getElementById("results").style.display = "block";
        document.getElementById("finalScore").innerText = correctAnswers;
        document.getElementById("totalScore").innerText = scores[currentTeam];
    }

    function nextTeam() {
        // **Reset alle waardes direct bij klikken op 'Volgend team'**
        roundTime = 15;
        totalGameTime = 45;
        correctAnswers = 0;
        extraTimeGiven = 0;
        
        clearInterval(timer);
        clearInterval(progressTimer);
        
        // **Zorg ervoor dat de timer, balk en score direct veranderen op het scherm**
        document.getElementById("timer").innerText = roundTime;
        document.getElementById("progress-bar").style.width = "100%";
        document.getElementById("roundScore").innerText = correctAnswers;

        currentTeamIndex = (currentTeamIndex + 1) % teams.length;

        document.getElementById("results").style.display = "none";
        document.getElementById("game").style.display = "block";

        document.getElementById("currentTeam").innerText = teams[currentTeamIndex];
        document.getElementById("newWordBtn").style.display = "inline-block";
        document.getElementById("correctWordBtn").style.display = "none";
    }
});
