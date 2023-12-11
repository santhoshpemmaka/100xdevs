const fs = require('fs');


fs.readFile('a.txt','utf-8', (err, res) => {
    console.log("Read content from a.txt", res);
})

let result = 0;
for (let i = 0; i < 10000; i++){
    result = result + i;
}
console.log(result);

fs.appendFile('a.txt', '\n A.txt file update content from the fs module', (err, res) => {
    if (err) {
        console.error("Error writing to file:", err);
    }
    else {
        console.log("Content written to file successfully!");
    }
});