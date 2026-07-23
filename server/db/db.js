const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const file = process.env.DB_FILE || path.join(__dirname, 'chat.sqlite');
const sqlite = new Database(file);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// ponytail: mysql2-shape shim so callers keep `const [rows] = await db.query(...)`.
// Rethrows UNIQUE violations as ER_DUP_ENTRY with an sqlMessage matching mysql2's format.
const db = {
    async query(sql, params = []) {
        const stmt = sqlite.prepare(sql);
        try {
            if (/^\s*SELECT/i.test(sql)) {
                return [stmt.all(...params)];
            }
            const info = stmt.run(...params);
            return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }];
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                const col = (err.message.match(/UNIQUE constraint failed:\s*\w+\.(\w+)/) || [])[1] || '';
                const e = new Error(err.message);
                e.code = 'ER_DUP_ENTRY';
                e.sqlMessage = `Duplicate entry for key '${col}'`;
                throw e;
            }
            throw err;
        }
    },
};

module.exports = db;
