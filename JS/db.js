// db.js
const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
    host: '', // MariaDB host
    user: '', // MariaDB username
    password: '', // MariaDB password
    database: '', // Database name
    port: ,
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
