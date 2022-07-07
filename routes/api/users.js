const express = require('express')
const router = express()
const userController = require('../../controllers/usersController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin), userController.createUser)
    .put(verifyRoles(ROLES_LIST.Admin), userController.updateUser)
    

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getUser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser)

module.exports = router