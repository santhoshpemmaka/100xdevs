const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db/index");
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_PASSWORD = "100xdev";
// Admin Routes
router.post('/signup', async(req, res) => {
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
        };

        const userExists = await Admin.findOne({ username });
        if (userExists) {
            return res.status(200).json({
                message : "User already exists in the database."
            })
        }

        const newUser = new Admin({
            username: username,
            password: password
        });
        await newUser.save();
        return res.status(201).json({
            message: "Admin created successfully"
        });
    }
    catch (e) {
        console.log("Error occured inside admin signup router");
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
        };
        const userExists = await Admin.findOne({ username });
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
        console.log("Error in the inside Admin signin router");
        return res.status(500).json({
            message : "Error occured server side"
        })
    }



});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    try {
        const { id, title, description, price, imageLink } = req.body;
        if (!id || !title || !description || !price || !imageLink) {
            return res.status(401).json({
                message : "Please fill all mandatory input fields"
            })
        }
        const newCourse = await new Course({
            id,
            title,
            description,
            price,
            imageLink
        })
        await newCourse.save();
        return res.status(201).json({
            message : "Course created successfully"
        })
    }
    catch (err) {
        console.log("Error occured inside of the adming courses router")
    }
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    return res.status(200).json({
        courses : courses
    })
});

module.exports = router;