const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://santhoshpemmaka:ygbqtxWRdusk1KKD@cluster0.qyzqtwb.mongodb.net/newcourseapp');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{timestamps : true});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    purchaseCourses: [
        {
            id: Number,
            title: String,
            description: String,
            price: Number,
            image: String
        }
    ]
}, { timestamps: true });

UserSchema.methods.sayHi = function () {
    console.log("hi from the user schema");
}


UserSchema.methods.addOrUpdateCourse = async function(course) {
    const courseId = course.id;
    const existingCourseIndex = this.purchaseCourses.findIndex(course => course.id === courseId);
    if (existingCourseIndex !== -1) {
        return { message: "Course is already in purchaseCourses" };
    }
    else {
        this.purchaseCourses.push(course);
        await this.save();
        return { message: "Course added to purchaseCourses" }
    }
};

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    id: {
        type: Number,
        required: true,        
    },
    title: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    price: {
        type: Number,
        required : true
    },
    imageLink: {
        type: String,
        required : true
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}