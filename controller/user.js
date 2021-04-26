const User = require('../model/userModel')
//for authentication use jwt
const jwt = require('jsonwebtoken')
//for authorization use express-jwt
const expressJwt = require('express-jwt')


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
        res.json({ users })
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