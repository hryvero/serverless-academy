const fs = require('fs');
const readline = require('readline');


let count = [];
const folderPath = './files';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }
    console.time('Time to process');
    uniqueValues(folderPath, files);
    counOfValues(folderPath, files)
    existInAtleastTen(folderPath, files)
    console.timeEnd('Time to process');
});

const uniqueValues = (folderPath, files) => {
    const uniqueValuesSet = new Set();
    let readStream;
    let uniqueValuesArray = [];
    let filePath;
    files.map((file) => {
        if (file.endsWith('.txt')) {
            filePath = `${folderPath}/${file}`;
            readStream = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: process.stdout,
                terminal: false,
            });
            readStream.on('line', (line) => {
                uniqueValuesSet.add(line.trim());
            });
            readStream.on('error', (error) => {
                console.log("Some error happened")
            });
        }
    });
    readStream.on('close', () => {
        uniqueValuesArray = [...uniqueValuesSet]
        console.log('Unique values:', uniqueValuesArray.length);
    });
}

const counOfValues = (folderPath, files) => {
    let readStream;
    let count = [];
    let filePath;
    files.map((file) => {
        if (file.endsWith('.txt')) {
            filePath = `${folderPath}/${file}`;
            readStream = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: process.stdout,
                terminal: false,
            });
            readStream.on('line', (line) => {
                count.push(line.trim)
            });
            readStream.on('error', (error) => {
                console.log("Some error happened")
            });
        }
    });
    readStream.on('close', () => {
        console.log('Count:', count.length);
    });
}
const existInAtleastTen = (folderPath, files) => {
    let readStream;
    let count = [];
    let filePath;
    for (let i = 0; i <= 9; i++) {
        file = 'out' + Math.floor(Math.random() * 19) + '.txt'
        console.log(file)
        if (file.endsWith('.txt')) {
            filePath = `${folderPath}/${file}`;
            readStream = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: process.stdout,
                terminal: false,
            });
            readStream.on('line', (line) => {
                count.push(line.trim)
            });
            readStream.on('error', (error) => {
                console.log("Some error happened")
            });
        }
    }
    readStream.on('close', () => {
        console.log('Count in 10 files:', count.length);
    });

}

