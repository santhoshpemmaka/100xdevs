const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://santhoshpemmaka:ygbqtxWRdusk1KKD@cluster0.qyzqtwb.mongodb.net/newcourse-jwt');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password : String,
}, { timestamps: true });

const purchaseSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    imageLink: String,
})

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String,
    purchaseCourse: [purchaseSchema]
}, { timestamps: true });

UserSchema.methods.addUserPurchaseCourses = async function (course) {
    const findIndex = this.purchaseCourse.findIndex(item => item.id == course.id );
    if (findIndex > -1) {
        return false;
    }
    else {
        this.purchaseCourse.push(course);
        await this.save();
        return true;
    }
}

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    id: String,
    title: String,
    description: String,
    price: Number,
    imageLink: String
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}