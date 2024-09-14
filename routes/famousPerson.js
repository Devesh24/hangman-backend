const FamousPerson = require('../models/FamousPerson')
const router = require('express').Router()

// get all the words(famous personalities) from the db
router.get('/', async (req, res) => {
    try {
        const data = await FamousPerson.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router

