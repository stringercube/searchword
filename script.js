import { spanishWords } from "./words.js";

// Picks a random word from words js file
function getRandomWord() {
    const words = spanishWords;
    return words[Math.floor(Math.random() * words.length)];
}

// generates a random string of characters
function generateRandomString() {
    const spanishChars = "abcdefghijklmnñopqrstuvwxyz";
    const length = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    let result = "";

    for (let i = 0; i < length; i++) {
        result += spanishChars.charAt(
            Math.floor(Math.random() * spanishChars.length)
        );
    }

    return result;
}

// converts strings into arrays
function str2Arr(text) {
    return text.split("");
}

// inserts target word characters in random string, returning positions of replacements
function insertTarget(random, target, paddingFill = 1.0) {
    let randomArray = str2Arr(random);
    let targetArray = str2Arr(target);

    // Define popCommonCharacters function
    function popCommonCharacters(sourceArray, comparisonArray) {
        const comparisonSet = new Set(comparisonArray);
        for (let i = sourceArray.length - 1; i >= 0; i--) {
            if (comparisonSet.has(sourceArray[i])) {
                sourceArray[i] = undefined;
            }
        }
    }

    // Remove common characters
    popCommonCharacters(randomArray, targetArray);

    // Filter out undefined values
    let filteredArray = randomArray.filter((item) => item !== undefined);

    const numberOfReplacements = targetArray.length; // Use targetArray length instead
    const replacementLength = Math.floor(
        filteredArray.length / numberOfReplacements
    );
    const paddingLength = Math.floor(replacementLength * paddingFill);
    const targetIndex = [];

    for (let i = 0; i < numberOfReplacements; i++) {
        // Calculate safe bounds for random position
        const segmentStart = i * replacementLength;
        const maxPosition = Math.min(
            segmentStart + paddingLength,
            (i + 1) * replacementLength - 1,
            filteredArray.length - 1
        );

        // Ensure we don't exceed array bounds
        const randomPosition =
            segmentStart +
            Math.floor(
                Math.random() * Math.max(0, maxPosition - segmentStart + 1)
            );

        targetIndex.push(randomPosition);
        filteredArray[randomPosition] = targetArray[i];
    }

    return { filteredArray, targetIndex };
}

document.addEventListener("DOMContentLoaded", () => {
    // Game state variables
    let targetWord = "";
    let targetIndices = [];
    let foundLetters = [];
    let gamesCompleted = 0;
    let totalGameTime = 0;
    let gameStartTime;

    // DOM elements
    const targetElement = document.querySelector(".target");
    const wordSaladElement = document.querySelector(".word-salad");
    const wellDoneElement = document.querySelector(".well-done");
    const startOverButton = document.getElementById("start-over");
    const newGameButton = document.querySelector("footer button");

    // Function to initialize a new game
    function initGame() {
        // Reset game state
        foundLetters = [];
        wellDoneElement.textContent = "";

        // Get a random word and generate random string
        targetWord = getRandomWord();
        const randomString = generateRandomString();

        // Insert target word into random string
        const { filteredArray, targetIndex } = insertTarget(
            randomString,
            targetWord
        );
        targetIndices = targetIndex;

        // Display target word
        targetElement.innerHTML = "";
        for (let i = 0; i < targetWord.length; i++) {
            const letterSpan = document.createElement("span");
            letterSpan.textContent = targetWord[i];
            letterSpan.dataset.index = i;
            targetElement.appendChild(letterSpan);
        }

        // Display word salad
        wordSaladElement.innerHTML = "";
        for (let i = 0; i < filteredArray.length; i++) {
            const letterSpan = document.createElement("span");
            letterSpan.textContent = filteredArray[i];
            letterSpan.dataset.index = i;

            // Add click event listener to each letter
            letterSpan.addEventListener("click", handleLetterClick);

            wordSaladElement.appendChild(letterSpan);
        }

        // Start timer
        gameStartTime = new Date();

        // Display current stats
        updateStatsDisplay();
    }

    // Function to handle letter click in word salad, ordered
    function handleLetterClick(event) {
        const clickedIndex = parseInt(event.target.dataset.index);

        // Only accept clicks for the next character in sequence
        const nextLetterToFind = foundLetters.length;
        const targetLetterIndex = targetIndices[nextLetterToFind];

        if (clickedIndex === targetLetterIndex) {
            // Mark letter as found
            foundLetters.push(nextLetterToFind);

            // Highlight letter in word salad
            event.target.classList.add("found");

            // Highlight corresponding letter in target word
            const targetLetterSpans = targetElement.querySelectorAll("span");
            targetLetterSpans[nextLetterToFind].classList.add("found");

            // Check if all letters are found
            if (foundLetters.length === targetWord.length) {
                gameCompleted();
            }
        }
    }

    // Function to handle game completion
    function gameCompleted() {
        const endTime = new Date();
        const elapsedTime = Math.floor((endTime - gameStartTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        // Update game stats
        gamesCompleted++;
        totalGameTime += elapsedTime;

        wellDoneElement.textContent = `¡Conseguido! Tiempo: ${minutes}m ${seconds}s`;

        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        // Create or get the stats element
        let statsElement = document.getElementById("game-stats");
        if (!statsElement) {
            statsElement = document.createElement("div");
            statsElement.id = "game-stats";
            document.querySelector("header").appendChild(statsElement);
        }

        // Calculate total time in minutes and seconds
        const totalMinutes = Math.floor(totalGameTime / 60);
        const totalSeconds = totalGameTime % 60;

        // Update the stats display
        statsElement.innerHTML = `
            <p>Juegos completados: ${gamesCompleted}</p>
            <p>Tiempo total: ${totalMinutes}m ${totalSeconds}s</p>
        `;
    }

    // Initialize the game
    initGame();

    // Event listeners for buttons
    document.addEventListener("click", function (event) {
        if (event.target.id === "start-over") {
            console.log("Start over clicked via delegation");
            // Start over logic
            foundLetters = [];
            const targetLetterSpans = targetElement.querySelectorAll("span");
            targetLetterSpans.forEach((span) => span.classList.remove("found"));
            const saladLetterSpans = wordSaladElement.querySelectorAll("span");
            saladLetterSpans.forEach((span) => span.classList.remove("found"));
            gameStartTime = new Date();
            wellDoneElement.textContent = "";
        } else if (event.target.closest("footer button")) {
            console.log("New game clicked via delegation");
            initGame();
        }
    });
});
