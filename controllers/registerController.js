const User = require('../model/User')
// we need bcrypt package. will help us hash and salt securely store passwords on our database
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    // req have user and password 
    const { user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'})
    // check for duplicate usernames
    const duplicate = await User.findOne({username: user}).exec()
    if (duplicate) return res.sendStatus(409); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        //create and store the new user. // at the same time defining user properties
        const result = await User.create({
            'username': user,           
            'password': hashedPwd                        
        });
        // second way
        // const newUser = new User()
        // newUser.username = user
        // newUser.password = hashedPwd
        // const result = await newUser.save()
        // third way
        // const newUser = new User({
        //     'username': user,           
        //     'password': hashedPwd                        
        // })
        // const result = await newUser.save()

        console.log(result);
        res.status(200).json( { 'success': `New user ${user} created` })

    } catch (error) {
        res.status(500).json({'message': error.message})        
    }
}

module.exports = { handleNewUser }