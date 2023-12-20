const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/user");
const zod = require('zod');
const { User, Course } = require("../db/index");
// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const { username, password } = req.body;
    const userSchema = zod.object({
        username: zod.string(),
        password: zod.string()
    })
    const checkInput = userSchema.safeParse({
        username,
        password
    })
    if (!checkInput.success) {
        return res.status(403).json({
            message : "Please check it once inputs parameters"
        })
    }
    const newUser = new User({
        username,
        password
    })
    await newUser.save();
    return res.status(200).json({
        message : 'User created successfully'
    })
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find();
    if (courses.length) {
        return res.status(200).json({
            courses: courses
        })
    }
    else {
        return res.status(200).json({
            message : "Didn't have any courses yet!"
        })
    }

});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const username = req.headers.username;
    const password = req.headers.password;
    const courseId = req.params.courseId;
    const course = await Course.findOne({ id: courseId });
    const user = await User.findOne({ username, password });
    const result = await user.addOrUpdateCourse(course);
    return res.status(201).json({
        message : result.message
    })
    
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({ username, password });
    if (!user) {
        res.status(401).json({
            message : "Invalid crendentials"
        })
    }
    const purchaseCourses = user.purchaseCourses;
    res.status(200).json({
        purchaseCourses : purchaseCourses
    })
});

module.exports = router;