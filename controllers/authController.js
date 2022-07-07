const User = require('../model/User')
const bcrypt = require('bcrypt')      // for user password authentication

const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
   
    const foundUser = await User.findOne({username: user}).exec()
    console.log(foundUser);
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // grab roles
        const roles = Object.values(foundUser.roles)
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo":  {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        );
        const refreshToken= jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn:  '1d'}
        )
        // save refresh token in the database which will allow us to create log out route. (allow us to invalidate refresh token when user logs out)
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result);
     
        // send both refresh token and access token to the user
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });  // secure: true, http only cookie is much more secure AND it is not available to javascript
        res.json({ accessToken });  // have to store this in memory // grab it in the frontend
    } else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin}  // export to routes that we want to protect