mysql = require('mysql2/promise');
dotenv = require('dotenv');

const db = mysql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TABLE,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = db;


async function testDB() {
    const [rows] = await db.query(
        'SELECT 1 + 2 AS solution'
    );
    console.log('DB TEST: ', rows);
};

//testDB()