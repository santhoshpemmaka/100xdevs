const express = require("express");
const adminMiddleware = require("../middleware/admin");
const router = express.Router();
const zod = require('zod');
const { Admin, User, Course } = require('../db');
// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const { username, password } = req.body;
    const adminSchema = zod.object({
        username: zod.string(),
        password: zod.string()
    })
    const checkInput = adminSchema.safeParse({
        username,
        password
    })
    if (!checkInput.success) {
        return res.status(403).json({
            message : "Please check it once inputs parameters"
        })
    }
    const newUser = new Admin({
        username,
        password
    })
    await newUser.save();
    return res.status(200).json({
        message : 'Admin created successfully'
    })


});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const { id, title, description, price, imageLink } = req.body;
    const schemaCourses = zod.object({
        id: zod.number(),
        title: zod.string(),
        description: zod.string(),
        price: zod.number(),
        imageLink: zod.string()
    })
    const checkInput = schemaCourses.safeParse({
        id,
        title,
        description,
        price,
        imageLink
    })
    if (!checkInput.success) {
        return res.status(403).json({
            message : "Please fill all mandatory input fields"
        })
    }
    const newCourse = new Course({
        id,
        title,
        description,
        price,
        imageLink
    })
    await newCourse.save();
    return res.status(200).json({
        message: "Course created successfully",
        courseId: id
    });

});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
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

module.exports = router;