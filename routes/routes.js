const router = require('express').Router()
const usersRouter = require('./users')
const profilesRouter = require('./profiles')

router.use('/users', usersRouter)

router.use('/profiles', profilesRouter)

module.exports = router