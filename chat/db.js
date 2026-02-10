mysql = require('mysql2/promise');

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'dev',
    password:'devpass',
    database:'chat',
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