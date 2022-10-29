const asyncHandler = require('express-async-handler');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')

//Generate JWT Authentication Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '1hr',
    })
}


//Register New Account
// POST /api/users
// Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password ) {
        res.status(400)
        throw new Error('Please complete all required inputs')
    }

    // Existing User Test
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error ({message: 'This e-mail is already in use.'})
    }

    const saltRounds = 10

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name, email, password: hashedPass
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Data')
    }
})

//Auth. User
// POST /api/signin
// Public
const signInUser = asyncHandler(async(req, res) => {

    const {email, password} = req.body

    //is this email in use?
    const user = await User.findOne({email})

    if(user && await(bcrypt.compare(password, user.password))) {
        res.json({
            status: 'Sign In Sucessful',
            message: 'Welcome back!',
            id: user.id,
            name: user.name,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('This password is incorrect')
    }
})

// Get users data
// GET /api/users/self
// Private
const getUserData = asyncHandler(async(req, res) => {

    //Pulls user data from decoded Token function authenticate() in authentication handling
    const {_id, name, email} = await User.findById(req.user.id)
    // console.log(req.user)

    res.status(200).json({
        status: 'Display User Data',
        id: _id,
        name,
        email
    })
})

module.exports = {registerUser, signInUser, getUserData}