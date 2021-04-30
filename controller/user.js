const User = require('../model/userModel')
//for authentication use jwt
const jwt = require('jsonwebtoken')
//for authorization use express-jwt
const expressJwt = require('express-jwt')

const Token = require('../model/token')
const sendEmail = require('../utils/verifyEmail')
const crypto = require('crypto')


exports.postUser = (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    user.save((error, users) => {
        if (error || !users) {
            return res.status(400).json({ error: "Unable to create an account" })
        }

        const token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            userId: user._id
        })

        token.save((error) => {
            if (error) {
                return res.status(400).json({ error: error })
            }
            sendEmail({
                from: 'no reply@yourWebappilication.com',
                to: users.email,
                subject: 'Email Verification Link',
                text: `Hello, \n\n Please Verify Your Account by clicking the link below \n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`

            })

        })

        res.json({ users })
    })
}

//confirm email after signup
exports.postConfirmation = (req, res) => {
    //at first find the matching token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: "Invalid token or token may have expired" })
        }

        //if we find the valid token then find the valid user
        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({ error: "We are unable to find the valid user for this token" })
            }

            //check if user is already verified or not
            if (user.isVerified) {
                return res.status(400).json({ error: "The email has already been verified , please login to continue" })
            }

            //save the verified user
            user.isVerified = true
            user.save((error) => {
                if (error) {
                    return res.status(400).json({ error: error })
                }
                res.json({ message: "Congrats, your account has been verified. Please login to continue." })

            })
        })

    })
}

//resend verification token 
exports.resendToken = (req, res) => {
    // at first find the registered user
    User.findOne({ email: req.body.email }, (error, user) => {
        if (!user || error) {
            return res.status(400).json({ error: "The email you provided not found in our system" })
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "The provided email is already verified" })
        }

        //now create a token save token to database and verification link
        const token = new Token({
            userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        })

        token.save((error, result) => {
            if (error || !result) {
                return res.status(400).json({ error: error })
            }

            //send mail
            sendEmail({
                from: 'no reply@yourWebappilication.com',
                to: user.email,
                subject: 'Email Verification Link',
                text: `Hello, \n\n Please Verify Your Account by clicking the link below \n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`

            })

        })
        res.json({ message: "Verification link has been sent to your email address." })
    })

}


exports.signIn = (req, res) => {
    const { email, password } = req.body

    //at first check email if it exists in database or not
    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({ error: "Sorry the provided email cannot be found in our system " })
        }

        //now find the valid password for the given email
        if (!user.authenticate(password)) {
            return res.status(400).json({ error: "Invalid password" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: "You need to verify your account before logging in." })
        }

        //now generate token with id and jwt secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        //persist the token with expiry date using the cookie
        res.cookie('t', token, { expiry: Date.now() + 999999 })

        //return response with user and token to frontend
        const { _id, name, email, role } = user
        return res.json({ token, user: { name, email, _id, role } })

    })
}



//for authorization
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
})

//to get user by id
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({ error: "User not found" })
        }
        req.user = user
        next()
    })
}

//to show single user details
exports.read = (req, res) => {
    res.json(req.user)
}

//sign out
exports.signOut = (req, res) => {
    res.clearCookie('t')
    res.json({ message: "Signed out successfully" })
}