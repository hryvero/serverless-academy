// Your first task is to write a small CLI application without any external dependencies that expects the user to enter
// a few words or numbers separated by a space.
// Next, the program should ask how to sort the user's input.
//
// The complete flow should look like this:
//
// Wait for user’s input
// Ask what the user would like to see in the output - what operation to do with words and numbers, namely:
// Sort words alphabetically
// Show numbers from lesser to greater
// Show numbers from bigger to smaller
// Display words in ascending order by number of letters in the word
// Show only unique words
// Display only unique values from the set of words and numbers entered by the user
// To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting


const valuesOfAnswer = {
    1: "1. Sort words alphabetically",
    2: "2. Show numbers from lesser to greater",
    3: "3. Show numbers from bigger to smaller",
    4: "4. Display words in ascending order by number of letters in the word",
    5: "5. Show only unique words",
    6: "6. Display only unique values from the set of words and numbers entered by the user"

}


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function getUserInput() {
    readline.question('Enter a few words or numbers separated by a space (or type "exit" to quit): ', (input) => {
        if(!input && input.length===0){
            console.log("I can't live without food :(")
            getUserInput()
        }
        if (input.toLowerCase() === 'exit') {
            console.log("Goodbye!")
            readline.close();
        } else {
            getChoice(input.toLowerCase().split(" "), valuesOfAnswer)
        }
    });
}

function getChoice(input, valuesOfAnswer) {
    const choiceByValues = Object.values(valuesOfAnswer)
    readline.question(`How to sort? \n${choiceByValues.join('\n')} \n`, answer => {
        if (answer.toLowerCase() === 'exit') {
            console.log("Goodbye!")
            readline.close();
        }
        if (answer < 1 || answer > 6) {
            console.log('Invalid option. Please choose a valid option (1-6).');
            getChoice(input, valuesOfAnswer);
        } else {
            sortByChoice(input, answer)
        }
    })
}


const sortByChoice = (input, answer) => {
    switch (answer) {
        case "1":
            console.log(input.filter(item => !/\d/.test(item)&&isNaN(item)).sort((a, b) => a.localeCompare(b)));
            break;
        case "2":
            console.log(input.filter(item => !isNaN(item)).sort((a, b) => a - b));
            break;
        case "3":
            console.log(input.filter(item => !isNaN(item)).sort((a, b) => b - a));
            break;
        case "4":
            console.log(input.filter(item => !/\d/.test(item)&& isNaN(item) ).sort((a, b) => a.length-b.length));
            break;
        case "5":
            console.log( Array.from(new Set(input.filter((item)=> isNaN(parseInt(item))))))
            break;
        case "6":
            console.log(Array.from(new Set(input)))
            break;
    }
    getUserInput()
}

getUserInput()


