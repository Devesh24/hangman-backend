const mongoose = require('mongoose')

const defaultHighScore = {
    score: 0,
    date: Date.now()
}
const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        pastScores: {type: [Object], default: []},
        highestScore: {type: Object, default: defaultHighScore}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)