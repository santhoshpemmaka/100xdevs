const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const zod = require('zod');

require('dotenv').config()

const mongooseURI = `mongodb+srv://santhoshpemmaka:${process.env.password}@cluster0.qyzqtwb.mongodb.net/userappnew`;

const jwtPassword = "123456";

const app = express();
app.use(bodyParser.json());

const schema = new mongoose.Schema({
    username: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    }

}, { timestamps: true })

const User = mongoose.model('user', schema);

const zodSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(5)
})

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const inputValidation = zodSchema.safeParse({ username, email, password });
    if (!inputValidation.success) {
        return res.status(403).json({
            msg: "Please give all input parameters"
        })
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).json({
            msg : "User email already exists in database!"
        })
    }
    const newUser = new User({
        username: username,
        email: email,
        password : password
    })
    await newUser.save();

    return res.status(200).json({
        msg: "User success created"
    })

})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const zodSignvalidation = zod.object({
        email: zod.string().email(),
        password: zod.string().min(5)
    });
    const checkInputValidation = zodSignvalidation.safeParse({ email, password });
    if (!checkInputValidation.success) {
        return res.status(403).json({
            msg: "Please give all input parameters"
        })
    }
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({
                msg: "Invalid crendentials"
            })
        }
        const token = jwt.sign({ password }, jwtPassword);
        return res.status(200).json({
            token: token
        })

    }
    catch (err) {
        return res.status(500).json({
            msg: "Internal sever error"
        })
    }
});


app.get('/users', async(req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({
            msg : "Unauthorization requests"
        })
    }
    const verifyPassword = jwt.verify(token, jwtPassword);
    console.log("Verify",verifyPassword)
    if (verifyPassword.password) {
        const users = await User.find();
        return res.status(200).json({
            users: users
        });
    }

    return res.status(403).json({
        msg : "Unauthorization requests"
    })
    
})


app.use((err, req, res, next) => {
    return res.status(500).json({
        msg: "Something went wrong on server!"
    })
})

mongoose.connect(mongooseURI).then(res => {
    app.listen(3000);
    console.log("Running");
})
    .catch(err => {
        console.log("Error occured in the database connection");
})
