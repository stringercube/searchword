// script.js
import { spanishWords } from "./words.js";

function getRandomWord() {
    const words = spanishWords;
    return words[Math.floor(Math.random() * words.length)];
}

// Usage example
const randomWord = getRandomWord();
console.log(randomWord);

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

// Example usage
const randomText = generateRandomString();
console.log(randomText);
console.log(randomText.length);
