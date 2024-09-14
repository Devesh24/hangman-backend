const jwt = require('jsonwebtoken')


// middleware for authentication - verify the token provided in the header
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token // in the form "Bearer token"
    if(authHeader)
    {
        const token = authHeader.split(" ")[1]
        //verify the token based on the secret key
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid!")
            else
            {
                req.user = user 
                next()
            }
        })
    }
    else
    {
        return res.status(401).json("You are not authenticated!")
    }
}

// middleware for checking if user is valid or not
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.userId)
        {
            next()
        }
        else res.status(403).json("You are not allowed to do this")
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization }