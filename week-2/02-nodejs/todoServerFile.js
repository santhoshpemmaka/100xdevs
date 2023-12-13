const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
console.log("directory",__dirname);

app.get('/todos', (req, res) => {
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        return res.status(200).json(JSON.parse(data));
    })
});


app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        let todoList = JSON.parse(data);
        let todoIndex = todoList.findIndex(todo => todo.id == id);
        if (todoIndex != -1) {
            return res.status(200).json(todoList[todoIndex]);
        }
        else {
            return res.status(404).send();
        }
    })
});


app.post('/todos', (req, res) => {
    const body = req.body;
    const title = body.title;
    const description = body.description;
    const completed = body.completed;
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        else {
            const todoList = JSON.parse(data);
            const ID = parseInt(Math.random() * 100000);
            console.log(ID, "Id");
            const newtodoList = {
                id: ID,
                title,
                description,
                completed
            };
            todoList.push(newtodoList);
            fs.writeFile('todos.json', JSON.stringify(todoList), (err) => {
                if (err) {
                    throw err;
                }
                else {
                    res.status(201).json(newtodoList);
                }
            })
        }
    })
    
})


app.post('/todos/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        const todoList = JSON.parse(data);
        const todoIndex = todoList.findIndex(todo => todo.id == id);
        if (todoIndex != -1) {
            todoList[todoIndex].completed = true;
            fs.writeFile('todos.json', JSON.stringify(todoList), (err) => {
                if (err) {
                    throw err;
                }
                else {
                    res.status(200).json(todoList[todoIndex]);
                }
            })
        }
    
        else {
            return res.status(404).send();
        }
    })
})


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        const todoList = JSON.parse(data);
        const todoIndex = todoList.findIndex(todo => todo.id == id);
        if (todoIndex != -1) {
            const updateList = todoList.filter(todo => todo.id != id);
            fs.writeFile('todos.json', JSON.stringify(updateList), (err, data) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send();
            })
        }
        else {
            return res.status(404).send();
        }
        

    })

});



app.listen(3001, () => {
    console.log("server is running in the port: ", 3001);
})


module.exports = app;