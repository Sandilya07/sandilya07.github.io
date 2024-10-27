document.addEventListener("DOMContentLoaded", () => {
    const startMenu = document.getElementById("start-menu");
    const startButton = document.getElementById("start-button");
    const gameContainer = document.getElementById("game-container");
    const tiger = document.getElementById("tiger");
    const scoreDisplay = document.getElementById("score");
    const tigerHealthBar = document.querySelector(".tiger-health-bar .health");

    let score = 0;
    let tigerHealth = 20;
    let maxTigerHealth = 20; // Max health set to 20
    let gameInterval;
    let spawnInterval;
    let difficultyIncreaseInterval;
    let poacherSpeed = 2; // Reduced speed
    let maxPoacherHealth = 1; // Initial poacher health

    startButton.addEventListener("click", startGame);

    function startGame() {
        startMenu.style.display = "none";
        gameContainer.style.display = "block";
        score = 0;
        tigerHealth = maxTigerHealth;
        updateScore();
        updateTigerHealth();
        gameInterval = setInterval(gameLoop, 20);
        spawnInterval = setInterval(spawnPoacher, 2000);
        difficultyIncreaseInterval = setInterval(increaseDifficulty, 10000);
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateTigerHealth() {
        tigerHealthBar.style.width = `${(tigerHealth / maxTigerHealth) * 100}%`;
        if (tigerHealth <= 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        clearInterval(difficultyIncreaseInterval);
        alert(`Game Over! Your score is ${score}`);
        gameContainer.style.display = "none";
        startMenu.style.display = "block";
    }

    function spawnPoacher() {
        const poacher = document.createElement("div");
        poacher.classList.add("enemy");
        poacher.style.width = "50px"; // Increased size
        poacher.style.height = "50px"; // Increased size

        // Randomly decide which edge to spawn the poacher on
        const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        switch (edge) {
            case 0: // Top
                poacher.style.top = "0%";
                poacher.style.left = `${Math.random() * 100}%`;
                break;
            case 1: // Right
                poacher.style.top = `${Math.random() * 100}%`;
                poacher.style.left = "100%";
                break;
            case 2: // Bottom
                poacher.style.top = "100%";
                poacher.style.left = `${Math.random() * 100}%`;
                break;
            case 3: // Left
                poacher.style.top = `${Math.random() * 100}%`;
                poacher.style.left = "0%";
                break;
        }

        poacher.health = Math.ceil(Math.random() * maxPoacherHealth); // Random health between 1 and maxPoacherHealth

        const healthBar = document.createElement("div");
        healthBar.classList.add("health-bar");
        const health = document.createElement("div");
        health.classList.add("health");
        health.style.width = "100%";
        healthBar.appendChild(health);
        poacher.appendChild(healthBar);

        poacher.addEventListener("click", () => {
            poacher.health--;
            health.style.width = `${(poacher.health / maxPoacherHealth) * 100}%`;
            if (poacher.health <= 0) {
                score++;
                updateScore();
                gameContainer.removeChild(poacher);
            }
        });

        gameContainer.appendChild(poacher);
    }

    function gameLoop() {
        const poachers = document.querySelectorAll(".enemy");
        poachers.forEach(poacher => {
            const tigerRect = tiger.getBoundingClientRect();
            const poacherRect = poacher.getBoundingClientRect();

            const dx = tigerRect.left + tigerRect.width / 2 - (poacherRect.left + poacherRect.width / 2);
            const dy = tigerRect.top + tigerRect.height / 2 - (poacherRect.top + poacherRect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            const moveX = (dx / distance) * poacherSpeed;
            const moveY = (dy / distance) * poacherSpeed;

            poacher.style.left = `${poacher.offsetLeft + moveX}px`;
            poacher.style.top = `${poacher.offsetTop + moveY}px`;

            if (distance < 30) {
                tigerHealth -= 1;
                updateTigerHealth();
                gameContainer.removeChild(poacher);
            }
        });
    }

    function increaseDifficulty() {
        poacherSpeed += 0.4;
        maxPoacherHealth += 1;
    }
});
