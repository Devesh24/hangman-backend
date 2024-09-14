const User = require('../models/User')
const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// signup
router.post('/register', async (req, res) => {
    //user to be added
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString() //encrypt the assword using cryptojs
    })

    try{
        const oldUsername = await User.findOne({username: req.body.username})
        if(oldUsername) //if user already exists
        {
            res.status(400).json("Username already exists!!")
        }
        else
        {
            const savedUser = await newUser.save() //save the user in db
            res.status(200).json(savedUser)
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

// login
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username}) //find the user using the username
        if(!user) //if user does not exists
        {
            res.status(401).json("Wrong Credentials!")
        } 
        else
        {
            const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8) 
            if(decryptedPass !== req.body.password) //match the passwords
            {
                return res.status(401).json("Wrong Password!")
            }

            //create an accesstoken
            const accessToken = jwt.sign(
                {
                    username: user.username
                },
                process.env.JWT_SEC,
                {expiresIn: "3d"}
            )

            //remove the password from the returned object so that it is not passed to user
            const {password, ...others} = user._doc;
            decryptedPass === req.body.password && res.status(200).json({...others, accessToken})
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router