const pool = require('../database');  

const getClicksByDay = async (req, res) => {
    const { shortcode } = req.params;

    try {
        const linkQuery = 'SELECT id FROM links WHERE shortcode = $1';
        const linkResult = await pool.query(linkQuery, [shortcode]);

        if (linkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        const linkId = linkResult.rows[0].id;

        const clicksQuery = `
            SELECT
                DATE(created_at) as date,
                COUNT(*) as clicks
            FROM link_analytics
            WHERE link_id = $1
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `;

        const result = await pool.query(clicksQuery, [linkId]);

        const labels = result.rows.map(row => row.date);
        const values = result.rows.map(row => row.clicks);

        res.json({ labels, values });
    } catch (error) {
        console.error('Error fetching clicks by day:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get clicks grouped by week
const getClicksByWeek = async (req, res) => {
    const { shortcode } = req.params;

    try {
        const linkQuery = 'SELECT id FROM links WHERE shortcode = $1';
        const linkResult = await pool.query(linkQuery, [shortcode]);

        if (linkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        const linkId = linkResult.rows[0].id;

        const clicksQuery = `
            SELECT
                DATE_TRUNC('week', created_at) as week,
                COUNT(*) as clicks
            FROM link_analytics
            WHERE link_id = $1
            GROUP BY DATE_TRUNC('week', created_at)
            ORDER BY DATE_TRUNC('week', created_at) ASC
        `;

        const result = await pool.query(clicksQuery, [linkId]);

        const labels = result.rows.map(row => row.week);
        const values = result.rows.map(row => row.clicks);

        res.json({ labels, values });
    } catch (error) {
        console.error('Error fetching clicks by week:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get clicks grouped by hour
const getClicksByHour = async (req, res) => {
    const { shortcode } = req.params;

    try {
        const linkQuery = 'SELECT id FROM links WHERE shortcode = $1';
        const linkResult = await pool.query(linkQuery, [shortcode]);

        if (linkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        const linkId = linkResult.rows[0].id;

        const clicksQuery = `
            SELECT
                DATE_TRUNC('hour', created_at) as hour,
                COUNT(*) as clicks
            FROM link_analytics
            WHERE link_id = $1
            GROUP BY DATE_TRUNC('hour', created_at)
            ORDER BY DATE_TRUNC('hour', created_at) ASC
        `;

        const result = await pool.query(clicksQuery, [linkId]);

        const labels = result.rows.map(row => row.hour);
        const values = result.rows.map(row => row.clicks);

        res.json({ labels, values });
    } catch (error) {
        console.error('Error fetching clicks by hour:', error);
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
