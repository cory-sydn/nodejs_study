const User = require('../model/User')
const bcrypt = require('bcrypt')


const getAllUsers = async(req, res) => {
    const allUsers = await User.find()
    if(!allUsers) return res.status(204).json({ 'message':'No user data'})
    res.json(allUsers)
}

const createUser = async(req, res) => {
    if(!req?.body?.username || !req?.body?.pwd) return res.status(400).json({'message': 'username and password missing'})
    const duplicate = await User.findOne({username: req.body.username}).exec()
    if (duplicate) return res.sendStatus(409); // Conflict
    try {
        const hashedPwd = await bcrypt.hash(req.body.pwd, 10)
        const result = await User.create({
        username: req.body.username,
        password: hashedPwd        
    })
    res.status(201).json(result)
    } catch (err) {
        console.log(err);
    }
}

const updateUser = async(req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message': 'ID required to update user'})
    const selectedUser = await User.findOne({ _id: req.body.id}).exec()
    if(!selectedUser) return res.status(204).json({'message': `No user with ID:${req.body.id}`})
    if(req.body?.username) selectedUser.username = req.body.username;
    if(req.body?.pwd){
        try {
            selectedUser.password = await bcrypt.hash(req.body.pwd, 10);
        } catch (error) {
            console.log(error);
        }
    }
    const result = await selectedUser.save()
    res.status(201).json(result)
    console.log(`updated user: ${result}`);
}

const deleteUser = async(req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message': 'ID required to delete user'})

    const selectedUser = await User.findOne({ _id: req.body.id  }).exec()
    if(!selectedUser) return res.status(204).json({'message': `No user with ID:${req.body.id}`})
    
    const result = await selectedUser.deleteOne({ _id: req.body.id })
    res.json(result)
    console.log(`Deleted user: ${result}`);
}

const getUser = async(req, res)=> {
    if(!req?.params?.id) return res.status(400).json({'message': 'ID required-'})
    const selectedUser = await User.findOne({ _id: req.params.id }).exec()
    if(!selectedUser) return res.status(204).json({'message': `No user with ID:${req.params.id}`})
    res.json(selectedUser)
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser    
}