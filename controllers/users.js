const pool = require('../db/db')
const {jwtSecret, saltLength} = require("../config")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require("uuid");


/**
 * Register a new user
 * @param req
 * @param res
 */
const register = async (req, res) => {
    const client = await pool.connect()
    try {
        const {username, password} = req.body

        const usernameQuery = await client.query('SELECT id FROM users WHERE username = $1', [
            username
        ])
        if (usernameQuery.rowCount > 0) {
            return res
                .status(400)
                .json({message: 'The username is already in use.'})
        }

        const hashedPassword = await bcrypt.hash(password, saltLength)

        // creating profile and user should be inside the same transaction
        await client.query('BEGIN')
        const profileQuery = await client.query(
            `INSERT INTO profiles (description, api_key) VALUES ($1, $2) RETURNING id`,
            ['This is just some description here', `${uuid.v4()}`]
        )

        const userQuery = await client.query(
            'INSERT INTO USERS (username, password, profile_id) VALUES ($1, $2, $3) RETURNING id',
            [username, hashedPassword, profileQuery.rows[0].id]
        )
        await client.query('COMMIT')

        const resp = {
            accessToken: '',
            user: {
                id: userQuery.rows[0].id,
                username: username
            }
        }
        resp.accessToken = jwt.sign({user: userQuery.rows[0].id}, jwtSecret, {
            expiresIn: '2 days'
        })
        return res.status(200).json(resp)
    } catch (e) {
        console.log(`Users:Register ${e}`)
        await client.query('ROLLBACK')
        return res.status(500).json({message: 'Server error'})
    } finally {
        client.release()
    }
}

/**
 * Login with username and password
 * @param req
 * @param res
 */
const login = async (req, res) => {
    try {
        const {username, password} = req.body

        const userQuery = await pool.query(
            'SELECT id, username, password FROM users WHERE username = $1',
            [username]
        )

        if (!userQuery.rowCount) {
            return res.status(404).json({message: 'User not found. Please register first.'})
        }
        const checkPass = await bcrypt.compare(password, userQuery.rows[0].password)
        if (!checkPass) {
            return res
                .status(400)
                .json({message: 'Invalid password'})
        }

        const resp = {
            accessToken: '',
            user: {
                id: userQuery.rows[0].id,
                username: userQuery.rows[0].username
            }
        }
        resp.accessToken = jwt.sign({user: userQuery.rows[0].id}, jwtSecret, {
            expiresIn: '2 days'
        })

        return res.status(200).json(resp)
    } catch (e) {
        console.log(`Users:Login ${e}`)
        return res.status(500).json({message: 'Server error'})
    }
}

module.exports = {
    register,
    login
};