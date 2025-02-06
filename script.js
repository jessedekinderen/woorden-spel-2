document.addEventListener("DOMContentLoaded", () => {
    let teams = [];
    let scores = {};
    let currentTeamIndex = 0;
    let totalTime = 45;
    let timeLeft = totalTime;
    let wordsGuessed = 0;
    let timer;
    let winningScore = 15; // Standaard op snel spel

    fetch("words.json")
        .then(response => response.json())
        .then(data => words = data);

    document.getElementById("startGame").addEventListener("click", showTeamSetup);
    document.getElementById("addTeam").addEventListener("click", addTeam);
    document.getElementById("beginGame").addEventListener("click", startGame);
    document.getElementById("correctNext").addEventListener("click", correctWord);

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
        setWinningScore();
        nextTeam();
    }

    function setWinningScore() {
        let selectedScore = document.querySelector('input[name="scoreOption"]:checked').value;
        winningScore = parseInt(selectedScore);
    }

    function startRound() {
        wordsGuessed = 0;
        timeLeft = totalTime;
        document.getElementById("wordCount").innerText = wordsGuessed;
        document.getElementById("timer").innerText = timeLeft;
        document.getElementById("startRound").style.display = "none";
        document.getElementById("correctNext").style.display = "block";
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
            if (timeLeft <= 0) endRound();
        }, 1000);
        newWord();
    }

    function newWord() {
        let randomIndex = Math.floor(Math.random() * words.length);
        document.getElementById("word").innerText = words[randomIndex];
    }

    function correctWord() {
        wordsGuessed++;
        document.getElementById("wordCount").innerText = wordsGuessed;
        if (timeLeft + 5 <= totalTime) {
            timeLeft += 5;
        } else {
            timeLeft = totalTime;
        }
        newWord();
    }

    function endRound() {
        clearInterval(timer);
        let currentTeam = teams[currentTeamIndex];
        scores[currentTeam] += wordsGuessed;
        document.getElementById("roundResult").innerText = `${currentTeam} behaalde ${wordsGuessed} punten! Totaal: ${scores[currentTeam]} punten.`;
        document.getElementById("correctNext").style.display = "none";
        document.getElementById("startRound").style.display = "block";
        nextTeam();
    }

    function nextTeam() {
        currentTeamIndex = (currentTeamIndex + 1) % teams.length;
        if (currentTeamIndex === 0) showScoreboard();
        document.getElementById("currentTeam").innerText = teams[currentTeamIndex];
    }

    function showScoreboard() {
        let scoreboardHTML = "";
        teams.forEach(team => {
            scoreboardHTML += `<div>${team}: ${scores[team]} punten</div>`;
        });
        document.getElementById("scoreboard").innerHTML = scoreboardHTML;
    }
});
