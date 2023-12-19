const express = require('express');
const bodyParser = require('body-parser');
const zod = require('zod');
const app = express();

app.use(bodyParser.json());

const schema = zod.array(zod.number());

// {
//     email: string => email
//     password: atleast 8 letters
//     country : 'IN', 'US'
// }

const all_users = [
    {
        username: "santhosh@gmail.com",
        password: "123",
        name : "santhosh"
    },
    {
        username: "santhosh1@gmail.com",
        password: "123",
        name : "santhosh1"
    },
    {
        username: "santhosh2@gmail.com",
        password: "123",
        name : "santhosh2"
    }
]

const schema1 = zod.object({
    email: zod.string().email(),
    password: zod.string().min(5),
    country: zod.literal('IN').or(zod.literal('US')),
    kidneys : zod.array(zod.number())
})


app.post('/body-request', (req, res) => {
    const name = req.body.name;

    const kidneys = req.body.kidneys;
    const response = schema.safeParse(kidneys);
    if (!response.success) {
        res.status(411).json({
            msg : "Please check it once input parameters"
        })
    }

    res.json({
        msg: name.length
    })
});

app.get("/", (req, res) => {
    console.log("Hello from express!");
    res.send("Hello from the server")
})



const userExists = (username, password) => {
    let userExists = all_users.findIndex(user => user.username == username && user.password == password);
    return userExists > -1 ? true : false;
}


app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!userExists(username, password)) {
        return res.status(403).json({
            msg: "User doesn't exists in our memory db"
        })
    }

    let token = jwt.sign({ username: username }, jwtPassword);
    return res.status(200).json({
        msg: "user is created",
        token: token
    })
});

app.get("/users", (req, res) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, jwtPassword);
        const filterUsers = all_users.filter(user => user.username != decoded.username);
        return res.status(200).json({
            users : filterUsers
        })
        
    }
    catch (err) {
        return res.status(403).json({
            msg : "Invalid token"
        })
    }
})

// Global Catches
app.use((err, req, res, next) => {
    res.json({
        msg : "Something went wrong with server!"
    })
})


app.listen(3000, () => {
    console.log("The server is running on the port " + 3000);
})

