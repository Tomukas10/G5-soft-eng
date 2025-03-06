const { query } = require('./db');

async function testConnection() {
    try {
        const rows = await query('SELECT 1 + 1 AS result');
        console.log('Connection successful:', rows);
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConnection();