// db.js
const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
    host: '132.145.18.222', // MariaDB host
    user: 'df2017', // MariaDB username
    password: 'wnd4VKSANY3', // MariaDB password
    database: 'df2017', // Database name
    port: 3306,
    connectionLimit: 10 // Limit the number of connections
});

// Function to execute queries
async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection(); // Get a connection from the pool
        const rows = await conn.query(sql, params); // Execute the query
        return rows;
    } finally {
        if (conn) conn.release(); // Release the connection back to the pool
    }
}

module.exports = { query };