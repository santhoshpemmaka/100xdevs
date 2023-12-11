const fs = require('fs');

fs.readFile('a1.txt', 'utf-8', (err, res) => {
    const result = res;
    const resultString = result.split(' ');
    let updateString = '';
    resultString.forEach((word) => {
        if (word.length > 0) {
            updateString += word + " ";
        }
    });

    console.log(updateString);
})