//quotes generation using api
const textApiURL = 'https://api.quotable.io/random?minLength=200&maxLength=350';
const textSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//display random text
const generateText = async () => {
    const response = await fetch(textApiURL);

    let data = await response.json();
    quote = data.content;

    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    textSection.innerHTML += arr.join("");
};
//typing logic
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split("");
    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            }
            else {
                char.classList.remove("fail");
            }
        }
        else {
            if (!char.classList.contains("fail")) {
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        if (check) {
            displayResult();
        }
    });
});
//timer
function updateTimer() {

    if (time == 0) {
        displayResult();
    }
    else {
        document.getElementById("timer").innerText = --time + "s";
    }
}
//set timer
const timereduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};
const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timetaken = 1;
    if (time != 0) {
        timetaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timetaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
};

//start test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timereduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    generateText();
}