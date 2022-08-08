const path = require('path')

const express = require('express')
const router = express.Router()

router.get('/acerca', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'acerca.html'))
})

module.exports = router
