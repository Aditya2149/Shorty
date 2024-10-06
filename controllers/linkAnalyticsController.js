const pool = require('../database');  

const getClicksByHour = async (req, res) => {
    const { linkId } = req.params;
    
    const query = `
        SELECT COUNT(*), DATE_TRUNC('hour', created_at) AS hour
        FROM link_analytics
        WHERE link_id = $1
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY hour
    `;

    try {
        const result = await pool.query(query, [linkId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching click data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getClicksByDay = async (req, res) => {
    const { linkId } = req.params;

    const query = `
        SELECT COUNT(*), DATE(created_at) AS day
        FROM link_analytics
        WHERE link_id = $1
        GROUP BY DATE(created_at)
    `;

    try {
        const result = await pool.query(query, [linkId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching click data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getClicksByWeek = async (req, res) => {
    const { linkId } = req.params;

    const query = `
        SELECT COUNT(*), DATE_TRUNC('week', created_at) AS week
        FROM link_analytics
        WHERE link_id = $1
        GROUP BY DATE_TRUNC('week', created_at)
    `;

    try {
        const result = await pool.query(query, [linkId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching click data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getClicksByGeography = async (req, res) => {
    const { linkId } = req.params;

    const query = `
        SELECT COUNT(*), country, state, ip_address
        FROM link_analytics
        WHERE link_id = $1
        GROUP BY country, state, ip_address
    `;

    try {
        const result = await pool.query(query, [linkId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching geographic data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getClicksByDay, getClicksByWeek, getClicksByGeography, getClicksByHour };
