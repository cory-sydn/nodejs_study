const express = require('express')
const router = express.Router()
const path = require( 'path')

//define our route with http method 'get' fro splash page
router.get('^/$|index(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
});

module.exports = router;