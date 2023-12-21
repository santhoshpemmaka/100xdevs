const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index");
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_PASSWORD = "100xdev";

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    try {
        const { username, password } = req.body;
        const userInputSchema = zod.object({
            username: zod.string(),
            password: zod.string().min(4)
        })
        const checkInputParameter = userInputSchema.safeParse({
            username,
            password
        })
        if (!checkInputParameter.success) {
            return res.status(403).json({
                message: "Give validtor inputs parameters"
            })
        };
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(200).json({
                message : "User already exists in the database."
            })
        }
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        return res.status(201).json({
            message: "User created successfully"
        });
    }
    catch (err) {
        console.log("Error occured inside user signup router");
        return res.status(500).json({
            message : "Error occured in the server"
        })
    }
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    try {
        const { username, password } = req.body;
        const userInputSchema = zod.object({
            username: zod.string(),
            password: zod.string().min(4)
        })

        const checkInputParameter = userInputSchema.safeParse({
            username,
            password
        });
        if (!checkInputParameter.success) {
            return res.status(403).json({
                message: "Give validtor inputs parameters"
            })
        }
        const userExists = await User.findOne({ username });
        console.log("uset", userExists);
        if (!userExists) {
            return res.status(403).json({
                message: "Please check it once your crendentials"
            })
        }
        if (userExists.password == password) {
            const token = jwt.sign({ password:password}, JWT_PASSWORD);
            return res.status(200).json({
                token: token
            })
        }
        else {
            return res.status(403).json({
                message : "Invalid crendentials"
            })
        }
    }
    catch (err) {
        console.log("Error in the inside signin signin router");
        return res.status(500).json({
            message : "Error occured server side"
        })
    }
});

router.get('/courses', userMiddleware, async(req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find({});
        return res.status(200).json({
            courses : courses
        })
    }
    catch (err) {
        console.log("Error occured in the inside user courses router");
        return res.status(500).json({
            message: "Error occured in the server"
        })
    }
    

});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    try {
        const courseId = req.params.courseId;
        const course = await Course.findOne({ id: courseId });
        if (!course) {
            return res.status(200).json({
                message : "Courses not present in the database"
            })
        }
        const password = req.userpassword;
        const user = await User.findOne({ password })
        const result = await user.addUserPurchaseCourses(course);
        if (!result) {
            return res.status(401).json({
                message : "Courses already purchased"
            })
        }
        else {
            return res.status(200).json({
                message : "Course purchased successfully"
            })
        }
    }
    catch (err) {
        console.log("Error occured user courses router");
        return res.status(500).json({
            message : "Error occured in the server" + err
        })
    }
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    try {
        const password = req.userpassword;
        const user = await User.findOne({ password });
        return res.status(200).json({
            "purchasedCourses" : user.purchaseCourse
        })
    }
    catch (err) {
        console.log("Error inside in the user purchased Courses");
        return res.status(500).json({
            message :"Error occured in the server"
        })
    }
});


module.exports = router;
