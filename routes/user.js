const User = require('../models/User')
const { verifyTokenAndAuthorization } = require('./verifyToken')
const router = require('express').Router()
const jwt = require('jsonwebtoken')


//get user by token
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    const {token} = req.body
    try{
        const user = jwt.verify(token, process.env.JWT_SEC)
        const username = user.username
        const data = await User.findOne({username})
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update a user
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


//delete a user
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User Deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})


// get a user by id
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json(err)
    }
})


router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({'highestScore.score': -1}).limit(10).select('-password'); 
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(err)
    }
})


module.exports = router