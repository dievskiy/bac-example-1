const router = require('express').Router();
const profilesController = require('../controllers/profiles.js');
const {validationResult, query} = require('express-validator');
const auth = require('../middleware/auth');

router.get('/profile', auth, [
    query('username').exists()
        .withMessage('No username provided')
        .isString()
        .withMessage('Invalid username in query params')
], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.errors[0].msg})
    } else {
        return profilesController.getProfile(req, res);
    }
});

module.exports = router;