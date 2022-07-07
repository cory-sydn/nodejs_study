const User = require('../model/User')

const handleLogout = async (req, res) => {
    //on client (frontend) also delete thew accessToken. (from memory of the client's application)
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // successfull. No content to request in this matter
    const refreshToken = cookies.jwt
    // is refreshToken in db? 
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        // foundUser is false but we do have a cookie
        refreshToken.clearCookie('jwt', { httpOnly: true, sameSite: 'None', }) // secure: true
        return res.sendStatus(204); //  successfull. No content npm cache verify    
    }
    // Delete refreshToken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save()
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None',}) // secure: true - only serves on https.  IN PRODUCTION!!!
    res.sendStatus(204)
}
    
module.exports = { handleLogout } // export to routes that we want to protect