const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');

const authenticate = asyncHandler(async (req, res, next) =>{
    let token

    //Check that there is a token in the header AND make sure it's a bearer token using the method ()
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //grab token in the header
            token = req.headers.authorization.split(' ')[1]
            
            //QA the token
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
            // console.log({displayTokenDetails: decodeToken})

            //Get user from decoded token. Remove password from token.
            let user = req.user = await User.findById(decodeToken.id).select('-password')
            // console.log(user)
            
            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Not authorized')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error ('Not authorized. Credentials missing! Please sign in.')        
    }
})

module.exports = {authenticate}