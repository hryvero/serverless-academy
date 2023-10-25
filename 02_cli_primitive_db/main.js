// After launching the program, a message is displayed asking for a name, meaning we enter the user creation mode:
//     Then you are prompted to choose a gender from the list;
// Then specify age;
// then the cycle with adding a user repeats. In this way you can add another user.
//     To stop adding users, just press ENTER instead of entering the name.
//
//     After refusing to add another user, the application prompts you to find the user by name in the database.
//     You can choose between two answers: Y/N. If you choose N, exit, and if you choose Y,
//     perform the search and inform you about the results: if the user is found in the database,
//     display all the information about him/her, if not - indicate that such a user does not exist.
//
//     Important notes
// You should use a regular text file (.txt) as your database. Add new users without overwriting previously added ones.
//     Organize data storage in your database so that each user can be easily turned into an object (JSON.parse and JSON.stringify should work just fine).
// Pay attention to the search algorithm and take the variant that a user can write a request in caps lock, but still have to get a valid result
import inquirer from "inquirer";
import fs from "fs";


let db = getFromDb("db.txt");

function getFromDb(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveToDb(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
}


const writeDataToDb = () => {
    inquirer.prompt([{
        name: 'name', message: 'Enter the user`s name. To cancel press Enter', type: 'input',
    }]).then(answer => {
        if (answer.name) {
            inquirer.prompt([{
                name: 'gender', message: 'Choose gender', type: "list", choices: ["male", "female"]
            }, {
                name: 'age', message: 'What is your age?', type: "input",
            }]).then(function (answerDetails) {
                const user = {
                    name: answer.name,
                    gender: answerDetails.gender,
                    age: answerDetails.age
                }
                if (Object.values(user)) {
                    db.push(user)
                }
                writeDataToDb()
            });
        } else {
            saveToDb('db.txt', db)
            getDataFromDb()
        }
    })

}

function getDataFromDb() {
    inquirer.prompt([{
        name: 'confirmation',
        type: 'confirm',
        message: 'Would you like to search user in db (yes/no)?',
    },])
        .then(answers => {
            if (answers.confirmation) {
                console.log(db)
                inquirer.prompt([{
                    name: "name",
                    type: "input",
                    message: "Enter user`s name you wanna find:"
                }]).then(answer => {
                    const result = db.filter((item) => item.name.toLowerCase().includes(answer.name.toLowerCase()))
                    console.log(result)
                })
            } else {
                console.log("Goodbye");
            }
        })
}

writeDataToDb()
