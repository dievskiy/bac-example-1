const router = require('express').Router();
const userController = require('../controllers/users.js');
const {check, validationResult} = require('express-validator');

router.post('/register', [
    check('username').isAlphanumeric().withMessage('Please provide a valid username'),
    check('password').isLength({min: 3, max: 32}).withMessage('Please provide a valid password')
], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.errors[0].msg})
    } else {
        return userController.register(req, res);
    }
});

router.post('/login', [
    check('username').isAlphanumeric().withMessage('Please provide a valid username'),
    check('password').isLength({min: 3, max: 32}).withMessage('Please provide a valid password')
], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.errors[0].msg})
    } else {
        return userController.login(req, res);
    }
});

module.exports = router;