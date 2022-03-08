const pool = require('../db/db')

/**
 * Get profile for user
 * @param req
 * @param res
 */
const getProfile = async (req, res) => {
    const client = await pool.connect()
    try {
        const {username} = req.query

        const userProfileQuery = await client
            .query(`SELECT username, created_at, description, api_key from users INNER JOIN profiles on users.profile_id = profiles.id WHERE users.username = $1`,
                [username])

        if (!userProfileQuery.rowCount) {
            return res.status(404).json({message: 'Profile not found'})
        }

        const response = {
            profile: {...userProfileQuery.rows[0]}
        }

        return res.status(200).json(response)
    } catch (e) {
        console.log(`Profiles:GetProfile ${e}`)
        return res.status(500).json({message: 'Server error'})
    } finally {
        client.release()
    }
}

module.exports = {
    getProfile
}