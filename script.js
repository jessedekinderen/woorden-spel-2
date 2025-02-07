document.addEventListener("DOMContentLoaded", () => {
    let teams = [];
    let scores = {};
    let currentTeamIndex = 0;
    let winningScore = 15;
    let roundTime = 15;
    let maxTime = 45;
    let timeLeft = roundTime;
    let progressTimeLeft = maxTime;
    let timer;
    let progressTimer;
    let wordsGuessed = 0;
    let words = [];

    fetch("words.json")
        .then(response => response.json())
        .then(data => words = data);

    document.getElementById("startGame").addEventListener("click", showTeamSetup);
    document.getElementById("addTeam").addEventListener("click", addTeam);
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
        document.getElementById("setup").style.display = "none";
        document.getElementById("game").style.display = "block";
        nextTeam();
    }

    function startRound() {
        document.getElementById("startRoundBtn").style.display = "none";
        document.getElementById("correctWordBtn").style.display = "inline-block";
        timeLeft = roundTime;
        progressTimeLeft = maxTime;
        wordsGuessed = 0;
        document.getElementById("wordCounter").innerText = wordsGuessed;
        document.getElementById("timer").innerText = timeLeft;
        updateProgressBar();
        resetWordBoxes();

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                clearInterval(progressTimer);
                endRound();
            }
        }, 1000);

        progressTimer = setInterval(() => {
            progressTimeLeft--;
            updateProgressBar();
        }, 1000);

        newWord();
    }

    function newWord() {
        let randomIndex = Math.floor(Math.random() * words.length);
        document.getElementById("word").innerText = words[randomIndex];
    }

    function correctWord() {
        if (wordsGuessed < 6) {
            wordsGuessed++;
            document.getElementById("wordCounter").innerText = wordsGuessed;
            document.getElementById("wordBox" + wordsGuessed).classList.add("filled");
            timeLeft = Math.min(timeLeft + 5, maxTime);
        }
        newWord();
    }

    function endRound() {
        clearInterval(timer);
        clearInterval(progressTimer);
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

        document.getElementById("startRoundBtn").style.display = "inline-block";
        document.getElementById("correctWordBtn").style.display = "none";
    }

    function updateProgressBar() {
        let progress = (progressTimeLeft / maxTime) * 100;
        document.getElementById("progressBar").style.width = progress + "%";
    }

    function resetWordBoxes() {
        for (let i = 1; i <= 6; i++) {
            document.getElementById("wordBox" + i).classList.remove("filled");
        }
    }
});
