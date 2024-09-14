const User = require('../models/User')
const { verifyTokenAndAuthorization } = require('./verifyToken')
const router = require('express').Router()
const jwt = require('jsonwebtoken')


//get user by token
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    const {token} = req.body
    try{
        const user = jwt.verify(token, process.env.JWT_SEC) //verify the token provided
        const username = user.username
        const data = await User.findOne({username}) //find the user if token is verified
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update a user - pastScores and highestScores
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// get top 10 users based on highest score
router.get('/', async (req, res) => {
    try {
        //password is removed from the object so it does not reaches the frontend
        const users = await User.find().sort({'highestScore.score': -1}).limit(10).select('-password'); 
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(err)
    }
})


module.exports = router